import { useEffect, useCallback } from "react";
import { useMessages } from "#context/message-context";
import { useAuth } from "#context/auth-context";
import errorTrackingService, { LogLevel } from "#services/error-tracking";

export const useHomePage = () => {
  const {
    messages,
    isLoading,
    isLoadingPrevious,
    hasMore,
    error,
    loadMessages,
    loadPreviousMessages,
    sendMessage,
    clearError,
  } = useMessages();
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

  const handleLoadPreviousMessages = useCallback(() => {
    if (isLoadingPrevious || !hasMore) return;

    errorTrackingService.log(LogLevel.INFO, "Loading previous messages");

    loadPreviousMessages().catch((err) => {
      errorTrackingService.log(
        LogLevel.ERROR,
        "Error loading previous messages",
        {
          error: err instanceof Error ? err.message : String(err),
          username,
        },
      );
      console.error(err);
    });
  }, [loadPreviousMessages, isLoadingPrevious, hasMore, username]);

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
    isLoadingPrevious,
    hasMore,
    error,
    sendMessage,
    loadPreviousMessages: handleLoadPreviousMessages,
  };
};
