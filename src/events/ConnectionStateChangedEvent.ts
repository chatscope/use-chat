import { ChatEventType } from "../enums";
import { ChatEvent } from "./ChatEvent";

export class ConnectionStateChangedEvent
  implements ChatEvent<ChatEventType.ConnectionStateChanged> {
  readonly type = ChatEventType.ConnectionStateChanged;
}
