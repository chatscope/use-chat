import { UserId } from "./Types";

export interface TypingUserParams {
  readonly userId: UserId;
  readonly content: string;
  readonly isTyping: boolean;
}

export class TypingUser {
  readonly userId: UserId;
  readonly content: string;
  readonly isTyping: boolean;

  constructor({ userId, content, isTyping }: TypingUserParams) {
    this.userId = userId;
    this.content = content;
    this.isTyping = isTyping;
  }
}
