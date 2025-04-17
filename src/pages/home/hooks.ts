import { useEffect } from "react";
import { useMessages } from "#context/message-context";
import { useAuth } from "#context/auth-context";
import errorTrackingService, { LogLevel } from "#services/error-tracking";

export const useHomePage = () => {
  const { messages, isLoading, error, loadMessages, sendMessage, clearError } =
    useMessages();
  const { username } = useAuth();

  useEffect(() => {
    errorTrackingService.log(LogLevel.INFO, "Loading messages");

    loadMessages().catch((err) => {
      errorTrackingService.log(LogLevel.ERROR, "Error loading messages", {
        error: err instanceof Error ? err.message : String(err),
        username,
      });
      console.error(err);
    });
  }, [loadMessages, username]);

  useEffect(() => {
    if (error) {
      errorTrackingService.log(LogLevel.ERROR, "Error in chat", {
        error: error.message,
        code: error.code,
        username,
      });

      console.error("Error in chat:", error);

      const timerId = setTimeout(() => {
        clearError();
      }, 5000);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [error, clearError, username]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};
