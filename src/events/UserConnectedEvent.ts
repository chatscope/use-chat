import { ChatEventType } from "../enums";
import { ChatEvent } from "./ChatEvent";

export class UserConnectedEvent
  implements ChatEvent<ChatEventType.UserConnected> {
  readonly type = ChatEventType.UserConnected;
  readonly userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
