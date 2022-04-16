import { ChatState, ConversationId, UserId } from "../Types";
import {
  ChatMessage,
  Conversation,
  GroupIdGenerator,
  MessageContentType,
  MessageIdGenerator,
  Participant,
  Presence,
} from "../";
import { User } from "../User";

export interface IStorage<ConversationData = any, UserData = any> {
  readonly groupIdGenerator: GroupIdGenerator;

  readonly messageIdGenerator?: MessageIdGenerator;

  getState: () => ChatState;

  /**
   * Sets current (logged in) user object
   * @param user
   */
  setCurrentUser: (user: User<UserData>) => void;

  /**
   * Add user to collection of users.
   * User will be added only when item with its id not exists in the collection.
   * Returns true if user has been added, otherwise returns false.
   * @param user
   */
  addUser: (user: User<UserData>) => boolean;

  /**
   * Remove user from users collection.
   * If the participant existed and has been removed, it returns true, otherwise it returns false
   * @param userId
   */
  removeUser: (userId: UserId) => boolean;

  /**
   * Get user by id
   * @param userId
   * @return [User, number]|[undefined,undefined]
   */
  getUser: (
    userId: UserId
  ) => [User<UserData>, number] | [undefined, undefined];

  /**
   * Set active conversation and reset unread counter of this conversation if second parameter is set.
   * Why active conversation is kept here in storage?
   * Because it's easy to persist whole storage and recreate from persistent state.
   * @param conversationId
   * @param resetUnreadCounter
   */
  setActiveConversation: (
    conversationId?: ConversationId,
    resetUnreadCounter?: boolean
  ) => void;

  /**
   * Add message to collection of messages
   * @param message
   * @param conversationId
   * @param generateId
   */
  addMessage: (
    message: ChatMessage<MessageContentType>,
    conversationId: ConversationId,
    generateId: boolean
  ) => ChatMessage<MessageContentType>;

  /**
   * Add conversation to collection of conversations.
   * Conversation will be added only when item with its id not exists in the collection.
   * @param conversation
   */
  addConversation: (conversation: Conversation<ConversationData>) => boolean;

  /**
   * Set unread messages for conversation
   * @param conversationId
   * @param count
   */
  setUnread: (conversationId: ConversationId, count: number) => void;

  /**
   * Remove conversation from conversations collection.
   * If the conversation existed and has been removed, it returns true, otherwise it returns false
   * @param conversationId
   * @param removeMessages
   */
  removeConversation: (
    conversationId: ConversationId,
    removeMessages: boolean
  ) => boolean;

  /**
   * Replace the conversation in the collection with the new one specified in the parameter
   * @param conversation
   */
  updateConversation: (conversation: Conversation) => void;

  /**
   * Get conversation by id
   * @param conversationId
   * @return [Conversation, number]|[undefined, undefined]
   */
  getConversation: (
    conversationId: ConversationId
  ) => [Conversation<ConversationData>, number] | [undefined, undefined];

  /**
   * Add participant to conversation
   * @param conversationId
   * @param participant
   */
  addParticipant: (
    conversationId: ConversationId,
    participant: Participant
  ) => void;

  /**
   * Remove participant from conversation
   * If the participant existed and has been removed, it returns true, otherwise it returns false
   * @param conversationId
   * @param participantId
   * @returns boolean
   */
  removeParticipant: (
    conversationId: ConversationId,
    participantId: UserId
  ) => boolean;

  /**
   * Set user presence
   * @param userId
   * @param presence
   */
  setPresence: (userId: UserId, presence: Presence) => void;

  /**
   * Set draft of message in current conversation
   * @param {String} draft
   */
  setDraft: (draft: string) => void;

  /**
   * Update message
   * @param message
   * @param index
   */
  updateMessage: (message: ChatMessage<MessageContentType>) => void;

  /**
   * Reset state to default
   */
  resetState: () => void;

  /**
   * Set every collections and properties of internal state to empty values
   */
  clearState: () => void;

  /**
   * Set current message input value
   * @param message
   */
  setCurrentMessage: (message: string) => void;
}
