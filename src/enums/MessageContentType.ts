export enum MessageContentType {
  TextPlain = 0, // text/plain,
  TextMarkdown = 1, // text/markdown
  TextHtml = 2, // text/html
  Image = 3, // IANA have not registered jpg type!
  Gallery = 4, // It can contain both pictures and videos
  Kml = 5, // application/vnd.google-earth.kml+xml, http://earth.google.com/kml/
  Attachment = 6, // For all other not handled known/ and unknown file types
  AttachmentList = 7, // Maybe it would be better to have only AttachmentList? One Attachments is a special case of AttachmentList
  Video = 8, // Single video file
  VCard = 9, // application/vcard+json or text/vcard
  Other = 255, // Any other custom type
}
