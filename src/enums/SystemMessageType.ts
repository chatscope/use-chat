/**
 * System message types
 * The purpose of the system message is to inform the user about the state of the conversation.
 * Often we want to translate this kind of messages at the client side.
 */
export enum SystemMessageType {
  Content = 0, // Client should display content from the content property
  UserJoined = 1, // Content property contains the name of the user who joined the conversation
  UserLeft = 2, // Content property contains the name of the user who left the conversation
  AdvisorJoined = 3, // Content property contains the name of the advisor who joined the conversation
  AdvisorLeft = 4, // Content property contains the name of the advisor who left the conversation
  CustomerJoined = 5, // Content property contains the name of the customer who joined the conversation
  CustomerLeft = 6, // Content property contains the name of the customer who left the conversation
}
