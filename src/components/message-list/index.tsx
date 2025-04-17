import { useEffect, useRef, memo } from "react";
import { MessageStatus, MessageWithStatus } from "#types/message";
import MessageItem from "./message-item";

interface MessageListProps {
  messages: MessageWithStatus[];
  messageStatuses?: Record<string, MessageStatus>;
}

const MessageList = memo(
  ({ messages, messageStatuses = {} }: MessageListProps) => {
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
      <div className="space-y-2 max-h-[300px] overflow-y-auto p-2 border rounded bg-gray-50">
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
