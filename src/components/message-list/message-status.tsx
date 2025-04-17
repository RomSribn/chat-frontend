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

  return (
    <div className={`text-xs mt-1 ${statusClass}`}>
      {statusText}
      {error && <span> - {error.message}</span>}
    </div>
  );
});

MessageStatusIndicator.displayName = "MessageStatusIndicator";

export default MessageStatusIndicator;
