import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Alert } from "#components/ui/alert";

describe("Alert Component", () => {
  it("should render with default props", () => {
    render(<Alert message="Test message" />);

    expect(screen.getByText("Test message")).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveClass("bg-blue-100");
    expect(screen.getByRole("alert")).toHaveClass("border-blue-400");
    expect(screen.getByRole("alert")).toHaveClass("text-blue-700");
  });

  it("should render with info variant", () => {
    render(<Alert variant="info" message="Info message" />);

    expect(screen.getByText("Info message")).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveClass("bg-blue-100");
    expect(screen.getByRole("alert")).toHaveClass("border-blue-400");
    expect(screen.getByRole("alert")).toHaveClass("text-blue-700");
  });

  it("should render with success variant", () => {
    render(<Alert variant="success" message="Success message" />);

    expect(screen.getByText("Success message")).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveClass("bg-green-100");
    expect(screen.getByRole("alert")).toHaveClass("border-green-400");
    expect(screen.getByRole("alert")).toHaveClass("text-green-700");
  });

  it("should render with warning variant", () => {
    render(<Alert variant="warning" message="Warning message" />);

    expect(screen.getByText("Warning message")).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveClass("bg-yellow-100");
    expect(screen.getByRole("alert")).toHaveClass("border-yellow-400");
    expect(screen.getByRole("alert")).toHaveClass("text-yellow-700");
  });

  it("should render with error variant", () => {
    render(<Alert variant="error" message="Error message" />);

    expect(screen.getByText("Error message")).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveClass("bg-red-100");
    expect(screen.getByRole("alert")).toHaveClass("border-red-400");
    expect(screen.getByRole("alert")).toHaveClass("text-red-700");
  });

  it("should render with title", () => {
    render(<Alert title="Alert Title" message="Alert message" />);

    expect(screen.getByText("Alert Title")).toBeTruthy();
    expect(screen.getByText("Alert message")).toBeTruthy();
  });

  it("should render with custom className", () => {
    render(<Alert message="Test message" className="custom-class" />);

    expect(screen.getByRole("alert")).toHaveClass("custom-class");
  });

  it("should call onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<Alert message="Test message" onClose={handleClose} />);

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should not render close button when onClose is not provided", () => {
    render(<Alert message="Test message" />);

    expect(screen.queryByLabelText("Close")).toBeNull();
  });

  it("should render appropriate icon based on variant", () => {
    const { rerender } = render(
      <Alert variant="info" message="Info message" />,
    );
    expect(document.querySelector("svg")).toBeTruthy();

    rerender(<Alert variant="success" message="Success message" />);
    expect(document.querySelector("svg")).toBeTruthy();

    rerender(<Alert variant="warning" message="Warning message" />);
    expect(document.querySelector("svg")).toBeTruthy();

    rerender(<Alert variant="error" message="Error message" />);
    expect(document.querySelector("svg")).toBeTruthy();
  });
});
