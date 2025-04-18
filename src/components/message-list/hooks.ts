import { useEffect, useRef, useCallback } from "react";
import { MessageStatus, MessageWithStatus } from "#types/message";
import { CHAT_CONSTANTS } from "#constants/chat";

/**
 * Manages scroll behavior in the message list.
 * Automatically scrolls to the bottom on new messages and preserves scroll position when loading previous messages.
 * @param messages - List of chat messages with status
 * @param isLoadingPrevious - Flag indicating if previous messages are currently loading
 * @returns References to the container and end element
 */
export const useScrollManagement = (
  messages: MessageWithStatus[],
  isLoadingPrevious: boolean,
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const prevMessagesLengthRef = useRef<number>(0);

  useEffect(() => {
    if (messages.length > 0 && prevMessagesLengthRef.current === 0) {
      endRef.current?.scrollIntoView({ behavior: "auto" });
    } else if (messages.length > prevMessagesLengthRef.current) {
      const lastMessage = messages[messages.length - 1];
      const isSendingMessage = lastMessage?.status === MessageStatus.SENDING;
      endRef.current?.scrollIntoView({
        behavior: isSendingMessage ? "auto" : "smooth",
      });
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (container && isLoadingPrevious) {
      prevScrollHeightRef.current = container.scrollHeight;
    }
  }, [isLoadingPrevious]);

  useEffect(() => {
    const container = containerRef.current;
    if (container && !isLoadingPrevious && prevScrollHeightRef.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      if (scrollDiff > 0) {
        container.scrollTop = scrollDiff;
        prevScrollHeightRef.current = 0;
      }
    }
  }, [messages, isLoadingPrevious]);

  return { containerRef, endRef };
};

/**
 * Handles infinite scroll behavior.
 * Triggers loading of previous messages when scrolling near the top.
 * @param containerRef - Reference to the scrollable container
 * @param isLoadingPrevious - Flag indicating if previous messages are currently loading
 * @param hasMore - Flag indicating if there are more messages to load
 * @param onLoadPrevious - Callback to load previous messages
 * @returns Scroll event handler
 */
export const useInfiniteScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  isLoadingPrevious: boolean,
  hasMore: boolean,
  onLoadPrevious?: () => void,
) => {
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || isLoadingPrevious || !hasMore || !onLoadPrevious) return;

    if (container.scrollTop < CHAT_CONSTANTS.SCROLL_THRESHOLD) {
      onLoadPrevious();
    }
  }, [containerRef, isLoadingPrevious, hasMore, onLoadPrevious]);

  return { handleScroll };
};
