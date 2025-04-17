import { memo } from "react";

import { Button, Input } from "#components/ui";
import errorTrackingService, { LogLevel } from "#services/error-tracking";

import { useMessageInput } from "./hooks";

interface MessageInputProps {
  onSend: (message: string) => void;
  isSubmitting?: boolean;
}

const MessageInput = memo(
  ({ onSend, isSubmitting = false }: MessageInputProps) => {
    const {
      message,
      setMessage,
      isSubmittingMessage,
      handleSubmit,
      handleKeyDown,
    } = useMessageInput({ onSend, isSubmitting });

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
      try {
        handleSubmit(e);
      } catch (error) {
        errorTrackingService.log(LogLevel.ERROR, "Error sending message", {
          error: error instanceof Error ? error.message : String(error),
          message,
        });
      }
    };

    return (
      <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
        <div className="flex-1">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your message..."
            disabled={isSubmittingMessage}
            aria-label="Message text"
            fullWidth
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmittingMessage || !message.trim()}
          isLoading={isSubmittingMessage}
          aria-label="Send message"
        >
          Send
        </Button>
      </form>
    );
  },
);

MessageInput.displayName = "MessageInput";

export { MessageInput };
