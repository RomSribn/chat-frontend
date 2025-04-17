import { useState, FormEvent, useCallback, KeyboardEvent } from "react";

interface UseMessageInputProps {
  onSend: (message: string) => void;
  isSubmitting?: boolean;
}

export const useMessageInput = ({
  onSend,
  isSubmitting = false,
}: UseMessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isSubmittingMessage, setLocalSubmitting] = useState(isSubmitting);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = message.trim();

      if (!trimmed || isSubmittingMessage) return;

      setLocalSubmitting(true);

      try {
        onSend(trimmed);
        setMessage("");
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
      } finally {
        // Reset the sending state after a short delay
        // for better UX (so the user can see that the message is being sent)
        setTimeout(() => {
          setLocalSubmitting(false);
        }, 300);
      }
    },
    [message, onSend, isSubmittingMessage],
  );

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    }
  }, []);

  return {
    message,
    setMessage,
    isSubmittingMessage,
    handleSubmit,
    handleKeyDown,
  };
};
