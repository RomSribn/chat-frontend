import { useEffect, memo } from "react";
import { MessageStatus, MessageWithStatus } from "#types/message";
//
import MessageItem from "./message-item";
import { useScrollManagement, useInfiniteScroll } from "./hooks";

interface MessageListProps {
  messages: MessageWithStatus[];
  messageStatuses?: Record<string, MessageStatus>;
  isLoadingPrevious?: boolean;
  hasMore?: boolean;
  onLoadPrevious?: () => void;
}

const MessageList = memo(
  ({
    messages,
    messageStatuses = {},
    isLoadingPrevious = false,
    hasMore = false,
    onLoadPrevious,
  }: MessageListProps) => {
    const { containerRef, endRef } = useScrollManagement(
      messages,
      isLoadingPrevious,
    );
    const { handleScroll } = useInfiniteScroll(
      containerRef,
      isLoadingPrevious,
      hasMore,
      onLoadPrevious,
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }, [containerRef, handleScroll]);

    return (
      <div
        ref={containerRef}
        className="space-y-2 max-h-[300px] overflow-y-auto p-2 border rounded bg-gray-50"
      >
        {isLoadingPrevious && (
          <p className="text-gray-500 text-center py-2">
            Loading prev messages...
          </p>
        )}

        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            status={msg.status || messageStatuses[msg.id]}
          />
        ))}

        {messages.length === 0 && (
          <p className="text-gray-500 text-center py-4">No messages</p>
        )}

        <div ref={endRef} />
      </div>
    );
  },
);

MessageList.displayName = "MessageList";

export { MessageList };
