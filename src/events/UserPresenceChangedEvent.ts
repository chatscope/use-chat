import { ChatEventType } from "../enums";
import { ChatEvent } from "./ChatEvent";
import { UserId } from "../Types";
import { Presence } from "../Presence";

export interface UserPresenceChangedEventParams {
  readonly userId: UserId;
  readonly presence: Presence;
}

export class UserPresenceChangedEvent
  implements ChatEvent<ChatEventType.UserPresenceChanged> {
  readonly type = ChatEventType.UserPresenceChanged;
  readonly userId: UserId;
  readonly presence: Presence;

  constructor({ userId, presence }: UserPresenceChangedEvent) {
    this.userId = userId;
    this.presence = presence;
  }
}
