import { ChatMessage, MessageError, MessageWithStatus } from "#types/message";

export enum MessageReducerAction {
  LOAD_START = "LOAD_START",
  LOAD_SUCCESS = "LOAD_SUCCESS",
  LOAD_ERROR = "LOAD_ERROR",
  ADD_MESSAGE = "ADD_MESSAGE",
  UPDATE_MESSAGE = "UPDATE_MESSAGE",
  SEND_MESSAGE = "SEND_MESSAGE",
  MESSAGE_SENT = "MESSAGE_SENT",
  MESSAGE_ERROR = "MESSAGE_ERROR",
  CLEAR_ERROR = "CLEAR_ERROR",
}

export interface MessageState {
  messages: MessageWithStatus[];
  isLoading: boolean;
  error: MessageError | null;
}

export interface MessageContextType extends MessageState {
  loadMessages: () => Promise<void>;
  sendMessage: (username: string, content: string) => void;
  clearError: () => void;
}

export type MessageAction =
  | { type: MessageReducerAction.LOAD_START }
  | { type: MessageReducerAction.LOAD_SUCCESS; payload: ChatMessage[] }
  | { type: MessageReducerAction.LOAD_ERROR; payload: MessageError }
  | { type: MessageReducerAction.ADD_MESSAGE; payload: ChatMessage }
  | { type: MessageReducerAction.SEND_MESSAGE; payload: ChatMessage }
  | { type: MessageReducerAction.MESSAGE_SENT; payload: string }
  | {
      type: MessageReducerAction.MESSAGE_ERROR;
      payload: { id: string; error: MessageError };
    }
  | { type: MessageReducerAction.UPDATE_MESSAGE; payload: ChatMessage }
  | { type: MessageReducerAction.CLEAR_ERROR };
