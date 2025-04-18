import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UsernameForm } from "#components/username-form";
import * as hooks from "#components/username-form/hooks";

// Mock the hooks
vi.mock("#components/username-form/hooks", async () => {
  const actual = await vi.importActual("#components/username-form/hooks");
  return {
    ...actual,
    useUsernameForm: vi.fn(),
  };
});

// Mock UI components
vi.mock("#components/ui", () => ({
  Button: vi.fn(({ children, disabled, isLoading, type, onClick }) => (
    <button
      type={type}
      disabled={disabled}
      data-loading={isLoading ? "true" : "false"}
      onClick={onClick}
      data-testid="button"
    >
      {children}
    </button>
  )),
  Input: vi.fn(
    ({ id, type, value, onChange, onBlur, error, disabled, placeholder }) => (
      <div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          data-testid="input"
          aria-invalid={!!error}
        />
        {error && <div data-testid="input-error">{error}</div>}
      </div>
    ),
  ),
  Alert: vi.fn(({ variant, message }) => (
    <div data-testid="alert" data-variant={variant}>
      {message}
    </div>
  )),
}));

describe("UsernameForm Component", () => {
  const mockHandleChange = vi.fn();
  const mockHandleBlur = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockGetErrorMessage = vi.fn((error) => `Error: ${error}`);

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    vi.mocked(hooks.useUsernameForm).mockReturnValue({
      input: "",
      error: null,
      isSubmitting: false,
      handleChange: mockHandleChange,
      handleBlur: mockHandleBlur,
      handleSubmit: mockHandleSubmit,
      getErrorMessage: mockGetErrorMessage,
    });
  });

  it("should render the form with input and submit button", () => {
    render(<UsernameForm />);

    expect(screen.getByLabelText(/user name/i)).toBeTruthy();
    expect(screen.getByTestId("input")).toBeTruthy();
    expect(screen.getByTestId("button")).toBeTruthy();
    expect(screen.getByText(/enter the chat/i)).toBeTruthy();
  });

  it("should call handleChange when input value changes", () => {
    render(<UsernameForm />);

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "testuser" } });

    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("should call handleBlur when input loses focus", () => {
    render(<UsernameForm />);

    const input = screen.getByTestId("input");
    fireEvent.blur(input);

    expect(mockHandleBlur).toHaveBeenCalled();
  });

  it("should call handleSubmit when form is submitted", () => {
    render(<UsernameForm />);

    // Get the form by tag name instead of role
    const form = document.querySelector("form");
    if (!form) throw new Error("Form not found");

    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("should display error message when error exists", () => {
    // Mock the actual error message that would be returned
    mockGetErrorMessage.mockReturnValue(
      "The user name must contain at least 3 symbol",
    );

    vi.mocked(hooks.useUsernameForm).mockReturnValue({
      input: "a",
      error: "too_short",
      isSubmitting: false,
      handleChange: mockHandleChange,
      handleBlur: mockHandleBlur,
      handleSubmit: mockHandleSubmit,
      getErrorMessage: mockGetErrorMessage,
    });

    render(<UsernameForm />);

    expect(screen.getByTestId("alert")).toBeTruthy();
    expect(screen.getByTestId("alert")).toHaveTextContent(
      "The user name must contain at least 3 symbol",
    );
    expect(screen.getByTestId("alert").getAttribute("data-variant")).toBe(
      "error",
    );
  });

  it("should disable button when form is submitting", () => {
    vi.mocked(hooks.useUsernameForm).mockReturnValue({
      input: "validuser",
      error: null,
      isSubmitting: true,
      handleChange: mockHandleChange,
      handleBlur: mockHandleBlur,
      handleSubmit: mockHandleSubmit,
      getErrorMessage: mockGetErrorMessage,
    });

    render(<UsernameForm />);

    const button = screen.getByTestId("button");
    expect(button).toBeDisabled();
    expect(button.getAttribute("data-loading")).toBe("true");
  });

  it("should disable button when there is an error", () => {
    vi.mocked(hooks.useUsernameForm).mockReturnValue({
      input: "a",
      error: "too_short",
      isSubmitting: false,
      handleChange: mockHandleChange,
      handleBlur: mockHandleBlur,
      handleSubmit: mockHandleSubmit,
      getErrorMessage: mockGetErrorMessage,
    });

    render(<UsernameForm />);

    const button = screen.getByTestId("button");
    expect(button).toBeDisabled();
  });

  it("should enable button when input is valid and not submitting", () => {
    vi.mocked(hooks.useUsernameForm).mockReturnValue({
      input: "validuser",
      error: null,
      isSubmitting: false,
      handleChange: mockHandleChange,
      handleBlur: mockHandleBlur,
      handleSubmit: mockHandleSubmit,
      getErrorMessage: mockGetErrorMessage,
    });

    render(<UsernameForm />);

    const button = screen.getByTestId("button");
    expect(button).not.toBeDisabled();
    expect(button.getAttribute("data-loading")).toBe("false");
  });

  it("should disable input when form is submitting", () => {
    vi.mocked(hooks.useUsernameForm).mockReturnValue({
      input: "validuser",
      error: null,
      isSubmitting: true,
      handleChange: mockHandleChange,
      handleBlur: mockHandleBlur,
      handleSubmit: mockHandleSubmit,
      getErrorMessage: mockGetErrorMessage,
    });

    render(<UsernameForm />);

    const input = screen.getByTestId("input");
    expect(input).toBeDisabled();
  });
});
