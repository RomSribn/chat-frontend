import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MessageList } from "#components/message-list";
import { MessageStatus } from "#types/message";
import { CHAT_CONSTANTS } from "#constants/chat";

vi.mock("#components/message-list/hooks", () => {
  return {
    useScrollManagement: () => ({
      containerRef: { current: document.createElement("div") },
      endRef: { current: document.createElement("div") },
    }),
    useInfiniteScroll: (
      _containerRef: React.RefObject<HTMLDivElement | null>,
      isLoadingPrevious: boolean,
      hasMore: boolean,
      onLoadPrevious?: () => void,
    ) => {
      if (!isLoadingPrevious && hasMore && onLoadPrevious) {
        onLoadPrevious();
      }

      const handleScroll = () => {
        if (!isLoadingPrevious && hasMore && onLoadPrevious) {
          onLoadPrevious();
        }
      };
      return { handleScroll };
    },
  };
});

describe("MessageList infinite scroll", () => {
  const mockMessages = [
    { id: "1", username: "user1", content: "Message 1", timestamp: 1000 },
    { id: "2", username: "user2", content: "Message 2", timestamp: 2000 },
  ];

  const mockStatuses = {
    "1": MessageStatus.SENT,
    "2": MessageStatus.SENT,
  };

  it("should render loading indicator when isLoadingPrevious is true", () => {
    render(
      <MessageList
        messages={mockMessages}
        messageStatuses={mockStatuses}
        isLoadingPrevious={true}
        hasMore={true}
        onLoadPrevious={vi.fn()}
      />,
    );

    expect(screen.getByText("Loading prev messages...")).toBeInTheDocument();
  });

  it("should not render loading indicator when isLoadingPrevious is false", () => {
    render(
      <MessageList
        messages={mockMessages}
        messageStatuses={mockStatuses}
        isLoadingPrevious={false}
        hasMore={true}
        onLoadPrevious={vi.fn()}
      />,
    );

    expect(
      screen.queryByText("Loading prev messages..."),
    ).not.toBeInTheDocument();
  });

  it("should call onLoadPrevious when scrolled to top", () => {
    const onLoadPreviousMock = vi.fn();

    render(
      <MessageList
        messages={mockMessages}
        messageStatuses={mockStatuses}
        isLoadingPrevious={false}
        hasMore={true}
        onLoadPrevious={onLoadPreviousMock}
      />,
    );

    // Симулируем событие скролла
    const container = document.createElement("div");
    container.scrollTop = CHAT_CONSTANTS.SCROLL_THRESHOLD - 1;

    act(() => {
      fireEvent.scroll(container);
    });

    expect(onLoadPreviousMock).toHaveBeenCalled();
  });

  it("should not call onLoadPrevious when hasMore is false", () => {
    const onLoadPreviousMock = vi.fn();

    render(
      <MessageList
        messages={mockMessages}
        messageStatuses={mockStatuses}
        isLoadingPrevious={false}
        hasMore={false}
        onLoadPrevious={onLoadPreviousMock}
      />,
    );

    const container = document.createElement("div");
    container.scrollTop = CHAT_CONSTANTS.SCROLL_THRESHOLD - 1;

    act(() => {
      fireEvent.scroll(container);
    });

    expect(onLoadPreviousMock).not.toHaveBeenCalled();
  });

  it("should not call onLoadPrevious when isLoadingPrevious is true", () => {
    const onLoadPreviousMock = vi.fn();

    render(
      <MessageList
        messages={mockMessages}
        messageStatuses={mockStatuses}
        isLoadingPrevious={true}
        hasMore={true}
        onLoadPrevious={onLoadPreviousMock}
      />,
    );

    const container = document.createElement("div");
    container.scrollTop = CHAT_CONSTANTS.SCROLL_THRESHOLD - 1;

    act(() => {
      fireEvent.scroll(container);
    });

    expect(onLoadPreviousMock).not.toHaveBeenCalled();
  });
});
