import { useContext } from "react";
import MessageContext from "./context";

export const useMessages = () => {
  const { 
    messages, 
    isLoading, 
    isLoadingPrevious,
    error, 
    hasMore,
    offset,
    limit,
    total,
    loadMessages, 
    loadPreviousMessages,
    sendMessage, 
    clearError 
  } = useContext(MessageContext);

  return {
    messages,
    isLoading,
    isLoadingPrevious,
    error,
    hasMore,
    offset,
    limit,
    total,
    loadMessages,
    loadPreviousMessages,
    sendMessage,
    clearError,
  };
};
