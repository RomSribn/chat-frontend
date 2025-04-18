import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMessageInput } from "#components/message-input/hooks";

// Mock the error tracking service
vi.mock("#services/error-tracking", () => ({
  default: {
    log: vi.fn(),
  },
  LogLevel: {
    ERROR: "error",
  },
}));

describe("useMessageInput", () => {
  const mockOnSend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty message and not submitting", () => {
    const { result } = renderHook(() =>
      useMessageInput({ onSend: mockOnSend }),
    );

    expect(result.current.message).toBe("");
    expect(result.current.isSubmittingMessage).toBe(false);
  });

  it("should update message when setMessage is called", () => {
    const { result } = renderHook(() =>
      useMessageInput({ onSend: mockOnSend }),
    );

    act(() => {
      result.current.setMessage("New message");
    });

    expect(result.current.message).toBe("New message");
  });

  it("should call onSend and reset message when handleSubmit is called with non-empty message", () => {
    const { result } = renderHook(() =>
      useMessageInput({ onSend: mockOnSend }),
    );

    act(() => {
      result.current.setMessage("Test message");
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnSend).toHaveBeenCalledWith("Test message");
    expect(result.current.message).toBe("");
  });

  it("should not call onSend when handleSubmit is called with empty message", () => {
    const { result } = renderHook(() =>
      useMessageInput({ onSend: mockOnSend }),
    );

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("should call handleSubmit when Enter key is pressed and message is not empty", () => {
    const { result } = renderHook(() =>
      useMessageInput({ onSend: mockOnSend }),
    );

    // Mock handleSubmit to track calls
    const handleSubmitSpy = vi.fn();
    result.current.handleSubmit = handleSubmitSpy;

    act(() => {
      result.current.setMessage("Test message");
    });

    // Create a mock form element
    const mockForm = document.createElement("form");
    const mockDispatchEvent = vi.fn();
    mockForm.dispatchEvent = mockDispatchEvent;

    const mockEvent = {
      key: "Enter",
      preventDefault: vi.fn(),
      shiftKey: false,
      currentTarget: {
        form: mockForm,
      },
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockDispatchEvent).toHaveBeenCalled();
  });

  it("should not call onSend when Enter key is pressed with Shift", () => {
    const { result } = renderHook(() =>
      useMessageInput({ onSend: mockOnSend }),
    );

    act(() => {
      result.current.setMessage("Test message");
    });

    const mockEvent = {
      key: "Enter",
      preventDefault: vi.fn(),
      shiftKey: true,
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("should not call onSend when a key other than Enter is pressed", () => {
    const { result } = renderHook(() =>
      useMessageInput({ onSend: mockOnSend }),
    );

    act(() => {
      result.current.setMessage("Test message");
    });

    const mockEvent = {
      key: "A",
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handleKeyDown(mockEvent);
    });

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("should handle errors when onSend throws", () => {
    // Spy on console.error to verify it's called
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const error = new Error("Submit error");
    mockOnSend.mockImplementation(() => {
      throw error;
    });

    const { result } = renderHook(() =>
      useMessageInput({ onSend: mockOnSend }),
    );

    act(() => {
      result.current.setMessage("Test message");
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    // This should not throw an error
    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    // Verify that the error was handled properly
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnSend).toHaveBeenCalledWith("Test message");
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Clean up
    consoleErrorSpy.mockRestore();
  });
});
