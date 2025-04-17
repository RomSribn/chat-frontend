import { useContext } from "react";
import MessageContext from "./context";

export const useMessages = () => {
  const { messages, isLoading, error, loadMessages, sendMessage, clearError } =
    useContext(MessageContext);

  return {
    messages,
    isLoading,
    error,
    loadMessages,
    sendMessage,
    clearError,
  };
};
