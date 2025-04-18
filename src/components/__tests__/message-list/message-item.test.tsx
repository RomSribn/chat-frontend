import { vi } from "vitest";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { MessageWithStatus, MessageStatus } from "#types/message";
import MessageItem from "#components/message-list/message-item";
import MessageStatusIndicator from "#components/message-list/message-status";
import {
  formatMessageTime,
  getMessageRelativeTime,
} from "#components/message-list/utils";

vi.mock("#components/message-list/message-status", () => ({
  default: vi.fn(() => <div data-testid="message-status" />),
}));

vi.mock("#hooks/index", () => ({
  useOnClickOutside: vi.fn(() => {
    // Do nothing in tests
  }),
}));

vi.mock("#components/message-list/utils", () => ({
  formatMessageTime: vi.fn(() => "Jan 1, 2023, 10:00 AM"),
  getMessageRelativeTime: vi.fn(() => "2 hours ago"),
}));

describe("MessageItem Component", () => {
  const mockMessage: MessageWithStatus = {
    id: "1",
    username: "user1",
    content: "Hello, world!",
    timestamp: 1672567200000, // 2023-01-01T10:00:00
    status: MessageStatus.SENT,
  };

  const mockError = {
    message: "Failed to send message",
    code: "ERROR_001",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render message content and username", () => {
    render(<MessageItem message={mockMessage} />);

    expect(screen.getByText(mockMessage.username)).toBeTruthy();
    expect(screen.getByText(mockMessage.content)).toBeTruthy();
  });

  it("should render relative time by default", () => {
    render(<MessageItem message={mockMessage} />);

    expect(getMessageRelativeTime).toHaveBeenCalledWith(mockMessage.timestamp);
    expect(screen.getByText("2 hours ago")).toBeTruthy();
  });

  it("should toggle time format when time is clicked", () => {
    render(<MessageItem message={mockMessage} />);

    // Initially shows relative time
    expect(getMessageRelativeTime).toHaveBeenCalledWith(mockMessage.timestamp);
    expect(screen.getByText("2 hours ago")).toBeTruthy();

    // Click on the time
    const timeElement = screen.getByText("2 hours ago");
    fireEvent.click(timeElement);

    // Should now show exact time
    expect(formatMessageTime).toHaveBeenCalledWith(mockMessage.timestamp);
    expect(screen.getByText("Jan 1, 2023, 10:00 AM")).toBeTruthy();

    // Click again to toggle back
    const exactTimeElement = screen.getByText("Jan 1, 2023, 10:00 AM");
    fireEvent.click(exactTimeElement);

    // Should show relative time again
    expect(getMessageRelativeTime).toHaveBeenCalledTimes(2);
    expect(screen.getByText("2 hours ago")).toBeTruthy();
  });

  it("should render MessageStatusIndicator when status is provided", () => {
    render(<MessageItem message={mockMessage} status={MessageStatus.SENT} />);

    expect(screen.getByTestId("message-status")).toBeTruthy();

    const calls = vi.mocked(MessageStatusIndicator).mock.calls;
    expect(calls.length).toBe(1);

    const props = calls[0][0];
    expect(props.status).toBe(MessageStatus.SENT);
    expect(props.error).toBeUndefined();
  });

  it("should render MessageStatusIndicator with error when provided", () => {
    const messageWithError = {
      ...mockMessage,
      status: MessageStatus.ERROR,
      error: mockError,
    };

    render(<MessageItem message={messageWithError} />);

    expect(screen.getByTestId("message-status")).toBeTruthy();

    const calls = vi.mocked(MessageStatusIndicator).mock.calls;
    expect(calls.length).toBe(1);

    const props = calls[0][0];
    expect(props.status).toBe(MessageStatus.ERROR);
    expect(props.error).toEqual(mockError);
  });

  it("should not render MessageStatusIndicator when no status is provided", () => {
    const messageWithoutStatus = { ...mockMessage };
    delete messageWithoutStatus.status;

    render(<MessageItem message={messageWithoutStatus} />);

    expect(screen.queryByTestId("message-status")).toBeNull();
  });
});
