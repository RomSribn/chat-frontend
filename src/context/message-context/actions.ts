import { MessageError, ChatMessage } from "#types/message";
import { MessageAction, MessageReducerAction } from "./types";

export const messageActions = {
  loadStart: (): MessageAction => ({
    type: MessageReducerAction.LOAD_START,
  }),

  loadSuccess: (messages: ChatMessage[], total: number): MessageAction => ({
    type: MessageReducerAction.LOAD_SUCCESS,
    payload: { messages, total },
  }),

  loadError: (error: MessageError): MessageAction => ({
    type: MessageReducerAction.LOAD_ERROR,
    payload: error,
  }),

  loadPreviousStart: (): MessageAction => ({
    type: MessageReducerAction.LOAD_PREVIOUS_START,
  }),

  loadPreviousSuccess: (
    messages: ChatMessage[],
    total: number,
  ): MessageAction => ({
    type: MessageReducerAction.LOAD_PREVIOUS_SUCCESS,
    payload: { messages, total },
  }),

  loadPreviousError: (error: MessageError): MessageAction => ({
    type: MessageReducerAction.LOAD_PREVIOUS_ERROR,
    payload: error,
  }),

  addMessage: (message: ChatMessage): MessageAction => ({
    type: MessageReducerAction.ADD_MESSAGE,
    payload: message,
  }),

  updateMessage: (message: ChatMessage): MessageAction => ({
    type: MessageReducerAction.UPDATE_MESSAGE,
    payload: message,
  }),

  sendMessage: (
    id: string,
    username: string,
    content: string,
    timestamp: number,
  ): MessageAction => ({
    type: MessageReducerAction.SEND_MESSAGE,
    payload: { id, username, content, timestamp },
  }),

  messageSent: (id: string): MessageAction => ({
    type: MessageReducerAction.MESSAGE_SENT,
    payload: id,
  }),

  messageError: (id: string, error: MessageError): MessageAction => ({
    type: MessageReducerAction.MESSAGE_ERROR,
    payload: { id, error },
  }),

  clearError: (): MessageAction => ({
    type: MessageReducerAction.CLEAR_ERROR,
  }),
};
