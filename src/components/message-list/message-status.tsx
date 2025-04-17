import { memo } from "react";
import { MessageStatus, MessageError } from "#types/message";
import { getStatusClass, getStatusText } from "./utils";

interface MessageStatusProps {
  status?: MessageStatus;
  error?: MessageError;
}

const MessageStatusIndicator = memo(({ status, error }: MessageStatusProps) => {
  if (!status) return null;

  const statusClass = getStatusClass(status);
  const statusText = getStatusText(status);

  // Don't render if there's no status text (unknown status)
  if (!statusText) return null;

  return (
    <div className={`text-xs mt-1 ${statusClass}`} data-testid="message-status">
      {statusText}
      {error && <span> - {error.message}</span>}
    </div>
  );
});

MessageStatusIndicator.displayName = "MessageStatusIndicator";

export default MessageStatusIndicator;
