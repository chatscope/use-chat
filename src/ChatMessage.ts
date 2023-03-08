import { MessageContentType, MessageDirection, MessageStatus } from "./enums";
import {
  AttachmentContent,
  AttachmentListContent,
  AudioContent,
  GalleryContent,
  HtmlContent,
  ICalendarContent,
  ImageContent,
  KmlContent,
  MarkdownContent,
  SystemContent,
  TextContent,
  VCardContent,
  VideoContent,
} from "./interfaces/MessageContent";
import { ChatMessageId } from "./Types";
import type { Sender } from "./Sender";

export type TypedMessageContent<T extends MessageContentType> =
  T extends MessageContentType.TextPlain
    ? TextContent
    : T extends MessageContentType.TextHtml
    ? HtmlContent
    : T extends MessageContentType.TextMarkdown
    ? MarkdownContent
    : T extends MessageContentType.Image
    ? ImageContent
    : T extends MessageContentType.Gallery
    ? GalleryContent
    : T extends MessageContentType.Kml
    ? KmlContent
    : T extends MessageContentType.Attachment
    ? AttachmentContent
    : T extends MessageContentType.AttachmentList
    ? AttachmentListContent
    : T extends MessageContentType.Video
    ? VideoContent
    : T extends MessageContentType.Audio
    ? AudioContent
    : T extends MessageContentType.VCard
    ? VCardContent
    : T extends MessageContentType.ICalendar
    ? ICalendarContent
    : T extends MessageContentType.System
    ? SystemContent<any>
    : T extends MessageContentType.Other
    ? any
    : never;

export type ChatMessageParams<T extends MessageContentType, D = undefined> = {
  id: ChatMessageId;
  status: MessageStatus;
  contentType: T;
  sender: Sender;
  direction: MessageDirection;
  content: TypedMessageContent<T>;
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
  content: TypedMessageContent<T>;
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
