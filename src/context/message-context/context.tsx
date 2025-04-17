import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { MessageError } from "#types/message";
import { onNewMessage, sendMessage } from "#services/socket";
import { fetchMessages } from "#services/api";
import { MessageContextType } from "./types";
import { messageReducer, initialMessageState } from "./reducer";
import { messageActions } from "./actions";
import errorTrackingService, { LogLevel } from "#services/error-tracking";

const initialContextValue: MessageContextType = {
  messages: [],
  isLoading: false,
  error: null,
  loadMessages: async () => {},
  sendMessage: () => {},
  clearError: () => {},
};

const MessageContext = createContext<MessageContextType>(initialContextValue);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [messageState, dispatch] = useReducer(
    messageReducer,
    initialMessageState,
  );

  const loadMessages = useCallback(async () => {
    dispatch(messageActions.loadStart());

    try {
      const messages = await fetchMessages();
      dispatch(messageActions.loadSuccess(messages));
    } catch (err) {
      const messageError = err as MessageError;
      dispatch(messageActions.loadError(messageError));
    }
  }, []);

  const handleSendMessage = useCallback((username: string, content: string) => {
    const tempId = `temp-${Date.now()}`;
    const timestamp = Date.now();

    dispatch(messageActions.sendMessage(tempId, username, content, timestamp));

    try {
      sendMessage(username, content);
      dispatch(messageActions.messageSent(tempId));
    } catch {
      dispatch(
        messageActions.messageError(tempId, {
          message: "Error sending message",
          code: "ERR_SEND_MESSAGE",
        }),
      );
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch(messageActions.clearError());
  }, []);

  useEffect(() => {
    try {
      console.log("Setting up message listener");
      const unsubscribe = onNewMessage((message) => {
        console.log("New message received:", message);
        dispatch(messageActions.addMessage(message));
      });

      return () => {
        console.log("Cleaning up message listener");
        unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up message listener:", error);
      errorTrackingService.log(
        LogLevel.ERROR,
        "Error setting up message listener",
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );
      return () => {};
    }
  }, []);

  const contextValue = useMemo<MessageContextType>(
    () => ({
      messages: messageState.messages,
      isLoading: messageState.isLoading,
      error: messageState.error,
      loadMessages,
      sendMessage: handleSendMessage,
      clearError,
    }),
    [
      messageState.messages,
      messageState.isLoading,
      messageState.error,
      loadMessages,
      handleSendMessage,
      clearError,
    ],
  );

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
}

export default MessageContext;
