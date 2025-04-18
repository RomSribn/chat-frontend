import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "#components/ui/button";

describe("Button Component", () => {
  it("should render with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeTruthy();
    expect(button).toHaveClass("bg-blue-600");
    expect(button).toHaveClass("text-white");
    expect(button).toHaveClass("px-4 py-2");
    expect(button).not.toHaveClass("w-full");
    expect(button).not.toBeDisabled();
  });

  it("should render with primary variant", () => {
    render(<Button variant="primary">Primary</Button>);

    const button = screen.getByRole("button", { name: "Primary" });
    expect(button).toHaveClass("bg-blue-600");
    expect(button).toHaveClass("hover:bg-blue-700");
    expect(button).toHaveClass("text-white");
  });

  it("should render with secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);

    const button = screen.getByRole("button", { name: "Secondary" });
    expect(button).toHaveClass("bg-gray-200");
    expect(button).toHaveClass("hover:bg-gray-300");
    expect(button).toHaveClass("text-gray-800");
  });

  it("should render with danger variant", () => {
    render(<Button variant="danger">Danger</Button>);

    const button = screen.getByRole("button", { name: "Danger" });
    expect(button).toHaveClass("bg-red-600");
    expect(button).toHaveClass("hover:bg-red-700");
    expect(button).toHaveClass("text-white");
  });

  it("should render with success variant", () => {
    render(<Button variant="success">Success</Button>);

    const button = screen.getByRole("button", { name: "Success" });
    expect(button).toHaveClass("bg-green-600");
    expect(button).toHaveClass("hover:bg-green-700");
    expect(button).toHaveClass("text-white");
  });

  it("should render with small size", () => {
    render(<Button size="sm">Small</Button>);

    const button = screen.getByRole("button", { name: "Small" });
    expect(button).toHaveClass("px-2 py-1");
    expect(button).toHaveClass("text-sm");
  });

  it("should render with medium size", () => {
    render(<Button size="md">Medium</Button>);

    const button = screen.getByRole("button", { name: "Medium" });
    expect(button).toHaveClass("px-4 py-2");
  });

  it("should render with large size", () => {
    render(<Button size="lg">Large</Button>);

    const button = screen.getByRole("button", { name: "Large" });
    expect(button).toHaveClass("px-6 py-3");
    expect(button).toHaveClass("text-lg");
  });

  it("should render with full width", () => {
    render(<Button fullWidth>Full Width</Button>);

    const button = screen.getByRole("button", { name: "Full Width" });
    expect(button).toHaveClass("w-full");
  });

  it("should render as disabled", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-70");
    expect(button).toHaveClass("cursor-not-allowed");
  });

  it("should render in loading state", () => {
    render(<Button isLoading>Loading</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-70");
    expect(button).toHaveClass("cursor-not-allowed");
    expect(screen.getByText("Loading...")).toBeTruthy();
    expect(document.querySelector("svg")).toBeTruthy(); // Loading spinner
  });

  it("should render with custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole("button", { name: "Custom" });
    expect(button).toHaveClass("custom-class");
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Click me" });
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should not call onClick when loading", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Click me
      </Button>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should pass additional HTML attributes to the button element", () => {
    render(
      <Button type="submit" data-testid="test-button">
        Submit
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("data-testid", "test-button");
  });
});
