import { Participant, TypingUser } from "./";
import { ConversationId, UserId } from "./Types";
import { TypingUsersList } from "./TypingUsersList";

export interface ConversationParams<ConversationData> {
  readonly id: ConversationId;
  readonly participants?: Array<Participant>;
  readonly unreadCounter?: number;
  readonly typingUsers?: TypingUsersList;
  readonly draft?: string;
  readonly description?: string;
  readonly readonly?: boolean;
  readonly data?: ConversationData;
}

export class Conversation<ConversationData = any> {
  readonly id: ConversationId;
  unreadCounter = 0;
  participants: Array<Participant>;
  typingUsers: TypingUsersList;
  description = "";
  draft = "";
  readonly = false;
  data?: ConversationData;

  constructor({
    id,
    participants = [],
    unreadCounter = 0,
    typingUsers = new TypingUsersList({ items: [] }),
    draft = "",
    description = "",
    readonly = false,
    data,
  }: ConversationParams<ConversationData>) {
    this.id = id;
    this.unreadCounter = unreadCounter;
    this.participants = participants;
    this.typingUsers = typingUsers;
    this.draft = draft;
    this.description = description;
    this.readonly = readonly;
    this.data = data;
  }

  /**
   * Checks if participant exists
   * @param participantId
   * @returns boolean
   */
  participantExists(participantId: UserId): boolean {
    return this.participants.findIndex((p) => p.id === participantId) !== -1;
  }

  /**
   * Get participant and its index
   * @param participantId
   * @returns [Participant,number]|[undefined,undefined]
   */
  getParticipant(
    participantId: UserId
  ): [Participant, number] | [undefined, undefined] {
    const idx = this.participants.findIndex((p) => p.id === participantId);
    if (idx !== -1) {
      return [this.participants[idx], idx];
    }

    return [undefined, undefined];
  }

  /**
   * Add participant to the collection only if not already added.
   * Returns true if participant has been added, otherwise returns false.
   * Returns
   * @param participant
   * @returns boolean
   */
  addParticipant(participant: Participant): boolean {
    if (!this.participantExists(participant.id)) {
      this.participants = this.participants.concat({ ...participant });
      return true;
    }

    return false;
  }

  /**
   * Removes participant.
   * If the participant existed and has been removed, it returns true, otherwise it returns false
   * @param participantId
   * @returns boolean
   */
  removeParticipant(participantId: UserId): boolean {
    const [, idx] = this.getParticipant(participantId);
    if (idx) {
      this.participants = this.participants
        .slice(0, idx)
        .concat(this.participants.slice(idx + 1));
      return true;
    }

    return false;
  }

  /**
   * Ads typing user to the typing users collection.
   * If user with this id already exists it will be replaced
   * @param typingUser
   */
  addTypingUser(typingUser: TypingUser): void {
    this.typingUsers.addUser(typingUser);
  }

  /**
   * Remove user with specified id from the collection of typing users
   * @param userId
   */
  removeTypingUser(userId: UserId): void {
    this.typingUsers.removeUser(userId);
  }
}
