import { memo, useCallback } from "react";
import { MessageList, MessageInput, Alert, Loader } from "#components/index";
import { useAuth } from "#context/auth-context";
import { MessageStatus } from "#types/message";

import { useHomePage } from "./hooks";

const HomePage = memo(() => {
  const { username } = useAuth();
  const {
    messages,
    isLoading,
    isLoadingPrevious,
    hasMore,
    error,
    sendMessage,
    loadPreviousMessages,
  } = useHomePage();

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!username) return;
      sendMessage(username, content);
    },
    [username, sendMessage],
  );

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl mb-4">Привет, {username}!</h2>

      {error && (
        <Alert variant="error" message={error.message} className="mb-4" />
      )}

      {isLoading && (
        <div className="text-center mb-2">
          <Loader size="sm" label="Загрузка сообщений..." />
        </div>
      )}

      <MessageList
        messages={messages}
        messageStatuses={messages
          .filter((msg) => msg.status)
          .reduce(
            (acc, msg) => {
              if (msg.id && msg.status) {
                acc[msg.id] = msg.status;
              }
              return acc;
            },
            {} as Record<string, MessageStatus>,
          )}
        isLoadingPrevious={isLoadingPrevious}
        hasMore={hasMore}
        onLoadPrevious={loadPreviousMessages}
      />

      <MessageInput onSend={handleSendMessage} />
    </div>
  );
});

HomePage.displayName = "HomePage";

export default HomePage;
