import { ChatMessageId, UserId } from "./Types";
import { MessageDirection } from "./enums";
import { ChatMessage } from "./";
import { MessageContentType } from "./enums";

type MessageGroupParams = {
  id: string;
  senderId: string;
  direction: MessageDirection;
};

export class MessageGroup {
  readonly id: string;
  readonly senderId: UserId;
  readonly direction: MessageDirection;
  messages: Array<ChatMessage<MessageContentType>> = [];

  constructor({ id, senderId, direction }: MessageGroupParams) {
    this.id = id;
    this.senderId = senderId;
    this.direction = direction;
  }

  addMessage(message: ChatMessage<MessageContentType>): void {
    this.messages.push(message);
  }

  getMessage(
    id: ChatMessageId
  ): [ChatMessage<MessageContentType>, number] | [undefined, undefined] {
    const idx = this.messages.findIndex((message) => message.id === id);

    if (idx !== -1) {
      return [this.messages[idx], idx];
    } else {
      return [undefined, undefined];
    }
  }

  /**
   * Replace the given message in the message collection
   * @param message
   */
  updateMessage(message: ChatMessage<MessageContentType>): void {
    const [foundMessage, idx] = this.getMessage(message.id);

    if (foundMessage) {
      this.replaceMessage(foundMessage, idx);
    }
  }

  /**
   * Replace the message at the specified index in the message collection.
   * Returns true if the message exists at the specified position.
   * Returns false if the given index is out of bound.
   * @param message
   * @param index
   */
  replaceMessage(
    message: ChatMessage<MessageContentType>,
    index: number
  ): boolean {
    if (this.messages.length <= index) {
      return false;
    }

    this.messages = this.messages
      .slice(0, index)
      .concat(message)
      .concat(this.messages.slice(index + 1));

    return true;
  }

  // TODO: Remove message
}
