import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type {
  ChatServiceFactory,
  ChatState,
  ConversationId,
  SendTypingServiceParams,
  UserId,
} from "../Types";
import type { IChatService, IStorage } from "../interfaces";
import PropTypes from "prop-types";
import { AutoDraft, ChatEventType, MessageContentType } from "../enums";
import type { Conversation } from "../Conversation";
import type { User } from "../User";
import type { ChatMessage } from "../ChatMessage";
import type {
  MessageEvent,
  UserPresenceChangedEvent,
  UserTypingEvent,
} from "../events";
import { TypingUser } from "../TypingUser";
import { useThrottledSendTyping } from "./useThrottledSendTyping";
import { useDebounceTyping } from "./useDebounceTyping";
import type { MessageGroup } from "../MessageGroup";
import { useLazyServiceFactoryRef } from "./useLazyServiceFactoryRef";

export interface SendMessageParams {
  message: ChatMessage<MessageContentType>;
  conversationId: ConversationId;
  senderId: string;
  generateId?: boolean;
  clearMessageInput?: boolean;
}

export interface SendTypingParams extends SendTypingServiceParams {
  throttle: boolean;
}

type ChatContextProps = ChatState & {
  currentMessages: MessageGroup[];
  setCurrentUser: (user: User) => void;
  addUser: (user: User) => boolean;
  removeUser: (userId: UserId) => boolean;
  getUser: (userId: UserId) => User | undefined;
  setActiveConversation: (conversationId: ConversationId) => void;
  sendMessage: (params: SendMessageParams) => void;
  addMessage: (
    message: ChatMessage<MessageContentType>,
    conversationId: ConversationId,
    generateId: boolean
  ) => void;
  updateMessage: (message: ChatMessage<MessageContentType>) => void;
  setDraft: (message: string) => void;
  sendTyping: (params: SendTypingParams) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (
    conversationId: ConversationId,
    removeMessages: boolean | undefined
  ) => boolean;
  getConversation: (conversationId: ConversationId) => Conversation | undefined;
  updateState: () => void;
  setCurrentMessage: (message: string) => void;
  resetState: () => void;
  service: IChatService;
  removeMessagesFromConversation: (conversationId: ConversationId) => void;
};

// Experimental
type ChatContextPropsTyped<S extends IChatService> =
  | (ChatState & {
      currentMessages: MessageGroup[];
      setCurrentUser: (user: User) => void;
      addUser: (user: User) => boolean;
      removeUser: (userId: UserId) => boolean;
      getUser: (userId: UserId) => User | undefined;
      setActiveConversation: (conversationId: ConversationId) => void;
      sendMessage: (params: SendMessageParams) => void;
      addMessage: (
        message: ChatMessage<MessageContentType>,
        conversationId: ConversationId,
        generateId: boolean
      ) => void;
      updateMessage: (message: ChatMessage<MessageContentType>) => void;
      setDraft: (message: string) => void;
      sendTyping: (params: SendTypingParams) => void;
      addConversation: (conversation: Conversation) => void;
      getConversation: (
        conversationId: ConversationId
      ) => Conversation | undefined;
      resetState: () => void;
      service: S;
    })
  | undefined;

/*const ChatContext = createContext<Partial<ChatContextProps>>({
  conversations: [],
  messages: {},
  users: [],
  currentMessages:[],
  setCurrentUser: user => {},
  addUser: user => false,
  removeUser: userId => false,
  getUser: userId => undefined,
  setActiveConversation: conversationId => {},
  sendMessage: params => {},
  addMessage: (message, conversationId, generateId) => {},
  updateMessage: message => {},
  setDraft: message => {},
  sendTyping: params => {},
  addConversation: conversation => {},
  getConversation: conversationId => undefined,
  resetState: () => {},
});*/

// It can be used to create context in userSpace
const createChatContext = <S extends IChatService>() =>
  createContext<ChatContextPropsTyped<S>>(undefined);

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

ChatContext.displayName = "ChatContext";

export const useChat = (): ChatContextProps => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be within ChatProvider");
  }

  return context;
};

/**
 *
 * @param {IStorage} storage
 * @param {IChatService} service
 * @param setter
 * @param config
 */

const useStorage = (
  storage: IStorage,
  service: IChatService,
  setter: (state: ChatState) => void,
  {
    debounceTyping = true,
    typingDebounceTime = 900,
  }: { debounceTyping: boolean; typingDebounceTime: number }
) => {
  const updateState = useCallback(() => {
    setter(storage.getState());
  }, [setter, storage]);

  const debouncedTyping = useDebounceTyping(
    typingDebounceTime,
    updateState,
    storage
  );

  // Register event handlers
  useEffect(() => {
    const onMessage = ({ message, conversationId }: MessageEvent) => {
      storage.addMessage(message, conversationId, false);

      const [conversation] = storage.getConversation(conversationId);

      // Increment unread counter
      const { activeConversation } = storage.getState();

      if (
        conversation &&
        (!activeConversation || activeConversation.id !== conversationId)
      ) {
        storage.setUnread(conversationId, conversation.unreadCounter + 1);
      }

      // Reset typing
      if (conversation) {
        conversation.removeTypingUser(message.senderId);
      }

      updateState();
    };

    const onConnectionStateChanged = () => {};
    const onUserConnected = () => {};
    const onUserDisconnected = () => {};
    const onUserPresenceChanged = ({
      userId,
      presence,
    }: UserPresenceChangedEvent) => {
      storage.setPresence(userId, presence);
    };

    const onUserTyping = ({
      conversationId,
      userId,
      content,
      isTyping,
    }: UserTypingEvent) => {
      const [conversation] = storage.getConversation(conversationId);

      if (conversation) {
        conversation.addTypingUser(
          new TypingUser({
            userId,
            content,
            isTyping,
          })
        );

        if (debounceTyping) {
          debouncedTyping(conversationId, userId);
        }

        updateState();
      }
    };

    service.on(ChatEventType.Message, onMessage);
    service.on(ChatEventType.ConnectionStateChanged, onConnectionStateChanged);
    service.on(ChatEventType.UserConnected, onUserConnected);
    service.on(ChatEventType.UserDisconnected, onUserDisconnected);
    service.on(ChatEventType.UserPresenceChanged, onUserPresenceChanged);
    service.on(ChatEventType.UserTyping, onUserTyping);

    return () => {
      service.off(ChatEventType.Message, onMessage);

      service.off(
        ChatEventType.ConnectionStateChanged,
        onConnectionStateChanged
      );

      service.off(ChatEventType.UserConnected, onUserConnected);

      service.off(ChatEventType.UserDisconnected, onUserDisconnected);

      service.off(ChatEventType.UserPresenceChanged, onUserPresenceChanged);

      service.off(ChatEventType.UserTyping, onUserTyping);
    };
  }, [storage, service, updateState, debounceTyping, debouncedTyping]);
};

const useChatSelector = ({
  conversations,
  activeConversation,
  messages,
  currentMessages,
  currentMessage,
}: ChatState) => {
  return {
    conversations,
    currentMessages,
    messages,
    activeConversation,
    currentMessage,
  };
};

export interface ChatProviderConfig {
  // Time for throttling send typing message
  typingThrottleTime?: number;
  // Time for debouncing received typing users
  typingDebounceTime?: number;
  debounceTyping?: boolean;
  autoDraft?: AutoDraft;
}

export interface ChatProviderProps<S extends IChatService> {
  serviceFactory: ChatServiceFactory<S>;
  storage: IStorage;
  config: ChatProviderConfig;
  children?: ReactNode;
}

/**
 * Provides methods to operate on chat and properties and collections of chat
 * @param children
 * @param {IChatService} service
 * @param {IStorage} storage
 * @constructor
 */
export const ChatProvider = <S extends IChatService>({
  serviceFactory,
  storage,
  config: {
    typingThrottleTime = 250,
    debounceTyping = true,
    typingDebounceTime = 900,
    autoDraft = AutoDraft.Save | AutoDraft.Restore,
  },
  children,
}: ChatProviderProps<S>): JSX.Element => {
  const [state, setState] = useState(storage.getState());

  const updateState = useCallback(() => {
    const newState = storage.getState();
    setState(newState);
  }, [setState, storage]);

  const serviceRef = useLazyServiceFactoryRef(
    serviceFactory,
    storage,
    updateState
  );

  useStorage(storage, serviceRef.current, setState, {
    debounceTyping,
    typingDebounceTime,
  });

  const throttledSendTyping = useThrottledSendTyping(
    serviceRef.current,
    typingThrottleTime
  );

  const setCurrentUser = useCallback(
    (user: User): void => {
      storage.setCurrentUser(user);
      updateState();
    },
    [storage, updateState]
  );

  const addUser = useCallback(
    (user: User): boolean => {
      const result = storage.addUser(user);
      updateState();
      return result;
    },
    [storage, updateState]
  );

  const removeUser = useCallback(
    (userId: UserId) => {
      const result = storage.removeUser(userId);
      updateState();
      return result;
    },
    [storage, updateState]
  );

  /**
   * Get user by id
   * @param userId
   */
  const getUser = useCallback(
    (userId: UserId) => storage.getUser(userId)[0],
    [storage]
  );

  /**
   * Set active conversation
   * @param {String} conversationId Conversation id
   */
  const setActiveConversation = useCallback(
    (conversationId?: ConversationId, draftOpt: AutoDraft = autoDraft) => {
      const { currentMessage } = storage.getState();

      // Save draft for the current conversation
      if (draftOpt & AutoDraft.Save) {
        storage.setDraft(currentMessage);
      }

      storage.setActiveConversation(conversationId);

      // Set current message input value to the draft from current conversation
      // And reset draft
      if (conversationId) {
        const [activeConversation] = storage.getConversation(conversationId);
        if (activeConversation) {
          // Restore draft from new conversation to message input
          if (draftOpt & AutoDraft.Restore) {
            storage.setCurrentMessage(activeConversation.draft ?? "");
            activeConversation.draft = "";
          }
        }
      }

      updateState();
    },
    [storage, updateState]
  );

  const getConversation = useCallback(
    (conversationId: ConversationId) =>
      storage.getConversation(conversationId)[0],
    [storage]
  );

  /**
   * Sends message to active conversation
   */
  const sendMessage = useCallback(
    ({
      message,
      conversationId,
      senderId,
      generateId = storage.messageIdGenerator ? true : false,
      clearMessageInput = true,
    }: SendMessageParams) => {
      const storedMessage = storage.addMessage(
        message,
        conversationId,
        generateId
      );

      if (clearMessageInput) {
        storage.setCurrentMessage("");
      }

      updateState();

      serviceRef.current.sendMessage({
        message: storedMessage,
        conversationId,
      });
    },
    [storage, updateState, serviceRef]
  );

  /**
   * Adds a message without sending it
   * @param message
   * @param conversationId
   * @param generateId
   */
  const addMessage = useCallback(
    (
      message: ChatMessage<MessageContentType>,
      conversationId: ConversationId,
      generateId: boolean
    ) => {
      storage.addMessage(message, conversationId, generateId);
      updateState();
    },
    [storage, updateState]
  );

  /**
   * Update message
   * @param message
   * @param index
   */
  const updateMessage = useCallback(
    (message: ChatMessage<MessageContentType>) => {
      storage.updateMessage(message);
      updateState();
    },
    [storage, updateState]
  );

  /**
   * Set draft of message in current conversation
   * @param {String} draft
   */
  const setDraft = useCallback(
    (draft: string) => {
      storage.setDraft(draft);
      updateState();
    },
    [storage, updateState]
  );

  /**
   * Add conversation to collection
   * @param c
   */
  const addConversation = useCallback(
    (c: Conversation) => {
      storage.addConversation(c);
      updateState();
    },
    [storage, updateState]
  );

  /**
   * Remove conversation from collection
   * @param conversationId
   */
  const removeConversation = useCallback(
    (
      conversationId: ConversationId,
      removeMessages: boolean | undefined = true
    ) => {
      const result = storage.removeConversation(conversationId, removeMessages);
      updateState();
      return result;
    },
    [storage, updateState]
  );

  const resetState = useCallback(() => {
    storage.resetState();
    updateState();
  }, [storage, updateState]);

  /**
   * Sends typing to active conversation
   * @param {Object} options Options object
   */
  const sendTyping = useCallback(
    ({ content = "", isTyping = true, throttle = true }: SendTypingParams) => {
      const { activeConversation, currentUser } = storage.getState();
      if (activeConversation && currentUser) {
        const params = {
          content,
          isTyping,
          userId: currentUser.id,
          conversationId: activeConversation.id,
        };

        if (throttle) {
          throttledSendTyping(params);
        } else {
          serviceRef.current.sendTyping(params);
        }
      }
    },
    [storage, throttledSendTyping, serviceRef]
  );

  /**
   * Set current  message input value
   * @param message
   */
  const setCurrentMessage = useCallback(
    (message: string) => {
      storage.setCurrentMessage(message);
      updateState();
    },
    [storage, updateState]
  );

  /**
   * Remove all the messages from the conversation
   * @param conversationId
   */
  const removeMessagesFromConversation = useCallback(
    (conversationId: ConversationId) => {
      storage.removeMessagesFromConversation(conversationId);
      updateState();
    },
    [storage, updateState]
  );

  return (
    <ChatContext.Provider
      value={{
        ...state,
        currentMessages:
          state.activeConversation &&
          state.activeConversation.id in state.messages
            ? state.messages[state.activeConversation.id]
            : [],
        setCurrentUser,
        addUser,
        removeUser,
        getUser,
        setActiveConversation,
        sendMessage,
        addMessage,
        updateMessage,
        setDraft,
        sendTyping,
        addConversation,
        removeConversation,
        getConversation,
        setCurrentMessage,
        resetState,
        updateState,
        service: serviceRef.current,
        removeMessagesFromConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

ChatProvider.defaultProps = {
  config: {
    typingThrottleTime: 250,
    debounceTyping: true,
    typingDebounceTime: 900,
  },
};

ChatProvider.propTypes = {
  children: PropTypes.node,
  service: PropTypes.object,
  storage: PropTypes.object,
  config: PropTypes.object,
};
