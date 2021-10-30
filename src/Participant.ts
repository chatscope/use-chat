import { UserId } from "./Types";
import { ConversationRole } from "./";

export type ParticipantParams = {
  id: UserId;
  role?: ConversationRole;
};

export class Participant {
  readonly id: UserId;
  role: ConversationRole;

  constructor({ id, role = new ConversationRole([]) }: ParticipantParams) {
    this.id = id;
    this.role = role;
  }
}
