import { memo, useState } from "react";
import { MessageWithStatus, MessageStatus } from "#types/message";
import { formatMessageTime, getMessageRelativeTime } from "./utils";
import MessageStatusIndicator from "./message-status";
import { useOnClickOutside } from "#hooks/index";
import { useRef } from "react";

interface MessageItemProps {
  message: MessageWithStatus;
  status?: MessageStatus;
}

const MessageItem = memo(({ message, status }: MessageItemProps) => {
  const [showExactTime, setShowExactTime] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  useOnClickOutside<HTMLDivElement>(messageRef, () => {
    if (showExactTime) {
      setShowExactTime(false);
    }
  });

  const toggleTimeFormat = () => {
    setShowExactTime(!showExactTime);
  };

  return (
    <div className="border-b pb-2 mb-2" ref={messageRef}>
      <div className="flex justify-between items-baseline">
        <span className="font-semibold">{message.username}</span>
        <span
          className="text-xs text-gray-500 cursor-pointer hover:text-gray-700"
          onClick={toggleTimeFormat}
          title={showExactTime ? "Show relative time" : "Show exact time"}
        >
          {showExactTime
            ? formatMessageTime(message.timestamp)
            : getMessageRelativeTime(message.timestamp)}
        </span>
      </div>
      <p className="mt-1">{message.content}</p>
      {(status || message.status) && (
        <MessageStatusIndicator
          status={status || message.status}
          error={message.error}
        />
      )}
    </div>
  );
});

MessageItem.displayName = "MessageItem";

export default MessageItem;
