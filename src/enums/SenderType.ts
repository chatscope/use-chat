/**
 * The type of the sender of the message.
 */
export enum SenderType {
  User = 0,
  Bot = 1,
  Channel = 2,
  Queue = 3,
  System = 4,
  Custom = 255,
}
