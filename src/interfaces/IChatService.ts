import { ChatEventType } from "../enums";
import {
  ChatEventHandler,
  SendMessageServiceParams,
  SendTypingServiceParams,
} from "../Types";
import { ChatEvent } from "../events";

/**
 * Why it is prefixed by I?
 * Because purpose of this interface is to Implement it wih other libraries :)
 * So, why other types here is not prefixed with I?
 * Because the other interfaces are only for declaring complex types
 */
export interface IChatService {
  /**
   * Register callback function
   * Chat provider uses this function for registering callbacks.
   * E.g. When service receives a message from the wire (mostly websocket) it should call a registered "onMessage" callback,
   * which will add the message to state and perform re-render.
   *
   * ChatProvider always registers one callback for each event, so you can keep eventHandler for specified event type
   * directly in property. However keeping eventHandler in collection is a better practice.
   * See also ExampleChatService
   *
   * @param evtType
   * @param evtHandler
   */
  on: <T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>
  ) => void;

  /**
   * Remove registered callback
   * @param evtType
   * @param evtHandler
   */
  off: <T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>
  ) => void;

  /**
   * Send chat message
   * Implement send logic for sending chat messages here.
   * @param params
   */
  sendMessage: (params: SendMessageServiceParams) => void;

  /**
   * Send typing indicator.
   * Implement sending typing indicator here.
   * @param conversationId
   * @param userId
   * @param content
   */
  sendTyping: (params: SendTypingServiceParams) => void;
}
