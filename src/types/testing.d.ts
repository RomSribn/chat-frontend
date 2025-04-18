/// <reference types="vitest" />
import "@testing-library/jest-dom";

declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): void;
      toContainElement(element: HTMLElement | null): void;
      toHaveClass(className: string): void;
      toHaveTextContent(text: string): void;
      toHaveAttribute(name: string, value?: string): void;
      toHaveRole(role: string): void;
    }
  }
}
