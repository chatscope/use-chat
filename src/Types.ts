import { IChatService, IStorage } from "./interfaces";
import { ChatEventType, MessageContentType } from "./enums";
import { ChatEvent } from "./events";
import { MessageGroup } from "./MessageGroup";
import { Conversation } from "./Conversation";
import { User } from "./User";
import { ChatMessage } from "./ChatMessage";

export type ChatEventHandler<
  T extends ChatEventType,
  E extends ChatEvent<T>
> = (event: E) => void;
export type ChatMessageId = string;
export type ConversationId = string;
export type UserId = string;
export type Permission = unknown;
export type GroupedMessages = Record<ConversationId, MessageGroup[]>;

export type ChatState<ConversationData = any, UserData = any> = {
  /**
   * Current logged in user (chat operator)
   */
  currentUser?: User<UserData>;
  users: Array<User<UserData>>;
  conversations: Array<Conversation<ConversationData>>;
  activeConversation?: Conversation<ConversationData>;
  currentMessages: MessageGroup[];
  messages: GroupedMessages;
  /**
   * Current Message input value
   */
  currentMessage: string;
};

export type UpdateState = () => void;
export type ChatServiceFactory<S extends IChatService> = (
  storage: IStorage,
  update: UpdateState
) => S;

export type SendMessageServiceParams = {
  message: ChatMessage<MessageContentType>;
  conversationId: ConversationId;
};

export interface SendTypingServiceParams {
  conversationId: ConversationId;
  userId: UserId;
  content: string;
  isTyping: boolean;
}
