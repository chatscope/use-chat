import { ChatEventType } from "../enums";
import { ChatEvent } from "./ChatEvent";

export class UserDisconnectedEvent
  implements ChatEvent<ChatEventType.UserDisconnected> {
  readonly type = ChatEventType.UserDisconnected;
  readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
