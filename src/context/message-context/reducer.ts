import { MessageStatus } from "#types/message";

import {
  addUniqueMessage,
  updateMessage,
  updateMessageStatus,
} from "./helpers";
import { MessageState, MessageAction, MessageReducerAction } from "./types";

export const initialMessageState: MessageState = {
  messages: [],
  isLoading: false,
  isLoadingPrevious: false,
  error: null,
  hasMore: true,
  offset: 0,
  limit: 6,
  total: 0,
};

export function messageReducer(
  state: MessageState,
  action: MessageAction,
): MessageState {
  switch (action.type) {
    case MessageReducerAction.LOAD_START:
      return { ...state, isLoading: true, error: null };

    case MessageReducerAction.LOAD_SUCCESS:
      return {
        ...state,
        messages: action.payload.messages.map((msg) => ({ ...msg })),
        isLoading: false,
        error: null,
        total: action.payload.total,
        offset: state.limit,
        hasMore: action.payload.total > state.limit,
      };

    case MessageReducerAction.LOAD_ERROR:
      return { ...state, isLoading: false, error: action.payload };

    case MessageReducerAction.LOAD_PREVIOUS_START:
      return { ...state, isLoadingPrevious: true, error: null };

    case MessageReducerAction.LOAD_PREVIOUS_SUCCESS:
      return {
        ...state,
        messages: [
          ...action.payload.messages.map((msg) => ({ ...msg })),
          ...state.messages,
        ],
        isLoadingPrevious: false,
        error: null,
        offset: state.offset + state.limit,
        hasMore: state.offset + state.limit < action.payload.total,
      };

    case MessageReducerAction.LOAD_PREVIOUS_ERROR:
      return { ...state, isLoadingPrevious: false, error: action.payload };

    case MessageReducerAction.ADD_MESSAGE:
      return {
        ...state,
        messages: addUniqueMessage(state.messages, action.payload),
      };

    case MessageReducerAction.UPDATE_MESSAGE:
      return {
        ...state,
        messages: updateMessage(state.messages, action.payload),
      };

    case MessageReducerAction.SEND_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          { ...action.payload, status: MessageStatus.SENDING },
        ],
      };

    case MessageReducerAction.MESSAGE_SENT:
      return {
        ...state,
        messages: updateMessageStatus(
          state.messages,
          action.payload,
          MessageStatus.SENT,
        ),
      };

    case MessageReducerAction.MESSAGE_ERROR:
      return {
        ...state,
        messages: updateMessageStatus(
          state.messages,
          action.payload.id,
          MessageStatus.ERROR,
          action.payload.error,
        ),
      };

    case MessageReducerAction.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
}
