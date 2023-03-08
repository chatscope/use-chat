import { MessageContentType, MessageDirection, MessageStatus } from "./enums";
import { MessageContent } from "./interfaces/MessageContent";
import { ChatMessageId } from "./Types";
import type { Sender } from "./Sender";

export type ChatMessageParams<T extends MessageContentType, D = undefined> = {
  id: ChatMessageId;
  status: MessageStatus;
  contentType: T;
  sender: Sender;
  direction: MessageDirection;
  content: MessageContent<T>;
  createdTime?: Date;
  updatedTime?: Date;
  data?: D;
};

export class ChatMessage<T extends MessageContentType, D = undefined> {
  readonly id: ChatMessageId;
  status: MessageStatus;
  readonly contentType: T;
  readonly sender: Sender;
  direction: MessageDirection;
  content: MessageContent<T>;
  readonly createdTime: Date;
  updatedTime?: Date;
  data?: D;

  constructor({
    id,
    status,
    contentType,
    sender,
    direction,
    content,
    createdTime = new Date(),
    updatedTime,
    data,
  }: ChatMessageParams<T>) {
    this.id = id;
    this.status = status;
    this.contentType = contentType;
    this.sender = sender;
    this.direction = direction;
    this.content = content;
    this.createdTime = createdTime;
    this.updatedTime = updatedTime;
    this.data = data;
  }
}
