import { MessageContentType } from "../enums/MessageContentType";
import { SystemMessageType } from "../enums/SystemMessageType";

export interface MessageContent<T extends MessageContentType> {
  body: unknown;
}

export interface TextContent
  extends MessageContent<MessageContentType.TextPlain> {
  body: string;
}

export interface MarkdownContent
  extends MessageContent<MessageContentType.TextMarkdown> {
  body: string;
}

export interface HtmlContent
  extends MessageContent<MessageContentType.TextHtml> {
  body: string;
}

// Images can be sent as:
// - url/data url
// - binary
// If url is empty string it means that it's a binary image
export interface ImageContent extends MessageContent<MessageContentType.Image> {
  url: string;
  body: ArrayBuffer;
}

// TODO: Item with types, and names - how to merge it with ImageContent and VideoContent?
export interface GalleryItem {
  description: string;
  src: string;
}

export interface GalleryContent
  extends MessageContent<MessageContentType.Gallery> {
  body: GalleryItem[];
}

export interface KmlContent extends MessageContent<MessageContentType.Kml> {
  body: string;
}

// Attachments can be sent as
// - url/data url
// - binary
// If url is empty string it means that it's a binary image
export interface AttachmentContent
  extends MessageContent<MessageContentType.Attachment> {
  url: string;
  body: ArrayBuffer;
}

export interface AttachmentListContent
  extends MessageContent<MessageContentType.AttachmentList> {
  body: AttachmentContent[];
}

// Attachments can be sent as
// - url/data url
// - binary
// If url is empty string it means that it's a binary image
export interface VideoContent extends MessageContent<MessageContentType.Video> {
  url: string;
  body: ArrayBuffer;
}

export interface VCardContent extends MessageContent<MessageContentType.VCard> {
  body: string;
}

export interface ICalendarContent
  extends MessageContent<MessageContentType.ICalendar> {
  body: string;
}

export interface SystemContent<T extends SystemMessageType>
  extends MessageContent<MessageContentType.System> {
  type: T;
  body: string;
}

export interface OtherContent extends MessageContent<MessageContentType.Other> {
  body: any;
}
