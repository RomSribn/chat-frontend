import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { MessageInput } from "#components/message-input/index";
import { useMessageInput } from "#components/message-input/hooks";

vi.mock("#components/message-input/hooks", () => ({
  useMessageInput: vi.fn(),
}));

vi.mock("#components/ui", () => ({
  Button: vi.fn(({ children, disabled, type, isLoading, onClick }) => (
    <button
      type={type}
      disabled={disabled}
      data-loading={isLoading ? "true" : "false"}
      onClick={onClick}
      data-testid="send-button"
    >
      {children}
    </button>
  )),
  Input: vi.fn(({ value, onChange, onKeyDown, disabled, placeholder }) => (
    <input
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      placeholder={placeholder}
      data-testid="message-input"
    />
  )),
}));

describe("MessageInput Component", () => {
  const mockOnSend = vi.fn();
  const mockSetMessage = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockHandleKeyDown = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMessageInput).mockReturnValue({
      message: "Test message",
      setMessage: mockSetMessage,
      isSubmittingMessage: false,
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
    });
  });

  it("should render input and button", () => {
    render(<MessageInput onSend={mockOnSend} />);

    expect(screen.getByTestId("message-input")).toBeTruthy();
    expect(screen.getByTestId("send-button")).toBeTruthy();
    expect(screen.getByTestId("send-button")).toHaveTextContent("Send");
  });

  it("should pass correct props to useMessageInput", () => {
    const isSubmitting = true;
    render(<MessageInput onSend={mockOnSend} isSubmitting={isSubmitting} />);

    expect(useMessageInput).toHaveBeenCalledWith({
      onSend: mockOnSend,
      isSubmitting,
    });
  });

  it("should call setMessage when input value changes", () => {
    render(<MessageInput onSend={mockOnSend} />);

    const input = screen.getByTestId("message-input");
    fireEvent.change(input, { target: { value: "New message" } });

    expect(mockSetMessage).toHaveBeenCalledWith("New message");
  });

  it("should call handleSubmit when form is submitted", () => {
    render(<MessageInput onSend={mockOnSend} />);

    const input = screen.getByTestId("message-input");
    const form = input.closest("form");

    if (form) {
      fireEvent.submit(form);
      expect(mockHandleSubmit).toHaveBeenCalled();
    } else {
      throw new Error("Form element not found");
    }
  });

  it("should disable input when submitting", () => {
    vi.mocked(useMessageInput).mockReturnValue({
      message: "Test message",
      setMessage: mockSetMessage,
      isSubmittingMessage: true,
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
    });

    render(<MessageInput onSend={mockOnSend} />);

    const input = screen.getByTestId("message-input");
    expect(input).toHaveAttribute("disabled");
  });

  it("should disable button when message is empty", () => {
    vi.mocked(useMessageInput).mockReturnValue({
      message: "",
      setMessage: mockSetMessage,
      isSubmittingMessage: false,
      handleSubmit: mockHandleSubmit,
      handleKeyDown: mockHandleKeyDown,
    });

    render(<MessageInput onSend={mockOnSend} />);

    const button = screen.getByTestId("send-button");
    expect(button).toHaveAttribute("disabled");
  });
});
