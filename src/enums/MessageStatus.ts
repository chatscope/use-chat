/**
 * Message status flow:
 * [Pending] Sent [DeliveredToCloud] [DeliveredToDevice] [Seen]
 */
export enum MessageStatus {
  Pending = 0, // Message is waiting in client for sending (using this you can implement delayed sending e.g. to omit mistakes)
  Sent = 1, // Message was sent do the cloud
  DeliveredToCloud = 2, // The cloud acknowledged the receipt of the message
  DeliveredToDevice = 3, // The message has been delivered to at least one client device
  Seen = 4, // The message was seen by the recipient
}
