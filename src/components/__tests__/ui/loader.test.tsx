import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Loader } from "#components/ui/loader";

describe("Loader Component", () => {
  it("should render with default props", () => {
    render(<Loader />);

    const loader = document.querySelector("svg");
    expect(loader).toBeTruthy();
    expect(loader).toHaveClass("animate-spin");
    expect(loader).toHaveClass("h-8 w-8"); // Default medium size
    expect(loader).toHaveClass("text-blue-600"); // Default primary color

    // Should have a screen reader text
    expect(screen.getByText("Loading...")).toBeTruthy();
    expect(screen.getByText("Loading...").className).toContain("sr-only");
  });

  it("should render with small size", () => {
    render(<Loader size="sm" />);

    const loader = document.querySelector("svg");
    expect(loader).toHaveClass("h-4 w-4");
  });

  it("should render with medium size", () => {
    render(<Loader size="md" />);

    const loader = document.querySelector("svg");
    expect(loader).toHaveClass("h-8 w-8");
  });

  it("should render with large size", () => {
    render(<Loader size="lg" />);

    const loader = document.querySelector("svg");
    expect(loader).toHaveClass("h-12 w-12");
  });

  it("should render with primary color", () => {
    render(<Loader color="primary" />);

    const loader = document.querySelector("svg");
    expect(loader).toHaveClass("text-blue-600");
  });

  it("should render with secondary color", () => {
    render(<Loader color="secondary" />);

    const loader = document.querySelector("svg");
    expect(loader).toHaveClass("text-gray-600");
  });

  it("should render with white color", () => {
    render(<Loader color="white" />);

    const loader = document.querySelector("svg");
    expect(loader).toHaveClass("text-white");
  });

  it("should render with custom className", () => {
    render(<Loader className="custom-class" />);

    const container = document.querySelector(".flex.flex-col");
    expect(container).toHaveClass("custom-class");
  });

  it("should render with label", () => {
    render(<Loader label="Loading data..." />);

    // Should show the label instead of sr-only text
    expect(screen.getByText("Loading data...")).toBeTruthy();
    expect(
      screen.queryByText("Loading...", { selector: ".sr-only" }),
    ).toBeNull();

    // Label should have the same color as the loader
    const labelElement = screen.getByText("Loading data...");
    expect(labelElement).toHaveClass("text-blue-600");
  });

  it("should render label with correct color", () => {
    const { rerender } = render(<Loader label="Loading..." color="primary" />);
    expect(screen.getByText("Loading...")).toHaveClass("text-blue-600");

    rerender(<Loader label="Loading..." color="secondary" />);
    expect(screen.getByText("Loading...")).toHaveClass("text-gray-600");

    rerender(<Loader label="Loading..." color="white" />);
    expect(screen.getByText("Loading...")).toHaveClass("text-white");
  });

  it("should have correct accessibility attributes", () => {
    render(<Loader />);

    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("should render with correct structure", () => {
    render(<Loader />);

    // Should have a circle and a path inside the SVG
    const circle = document.querySelector("circle");
    const path = document.querySelector("path");

    expect(circle).toBeTruthy();
    expect(path).toBeTruthy();

    // Circle should have opacity class
    expect(circle).toHaveClass("opacity-25");

    // Path should have opacity class
    expect(path).toHaveClass("opacity-75");
  });
});
