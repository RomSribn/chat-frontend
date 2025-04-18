import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { errorTrackingService } from "#services/error-tracking/service";
import { LogLevel } from "#services/error-tracking/types";

describe("ErrorTrackingService", () => {
  // Save original methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;
  const originalConsoleDebug = console.debug;
  const originalFetch = global.fetch;
  const originalAddEventListener = window.addEventListener;

  // Mock console methods
  beforeEach(() => {
    console.error = vi.fn();
    console.warn = vi.fn();
    console.info = vi.fn();
    console.debug = vi.fn();
    global.fetch = vi.fn();
    window.addEventListener = vi.fn();

    // Reset mocks
    vi.clearAllMocks();
  });

  // Restore original methods
  afterEach(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.info = originalConsoleInfo;
    console.debug = originalConsoleDebug;
    global.fetch = originalFetch;
    window.addEventListener = originalAddEventListener;
  });

  describe("getInstance", () => {
    it("should return the same instance when called multiple times", () => {
      const instance1 = errorTrackingService;
      const instance2 = errorTrackingService;

      expect(instance1).toBe(instance2);
    });
  });

  describe("init", () => {
    it("should set up error event listeners", () => {
      errorTrackingService.init();

      // Verify event listeners were added
      expect(window.addEventListener).toHaveBeenCalledTimes(2);
      expect(window.addEventListener).toHaveBeenCalledWith(
        "error",
        expect.any(Function),
      );
      expect(window.addEventListener).toHaveBeenCalledWith(
        "unhandledrejection",
        expect.any(Function),
      );

      // Verify console.info was called to log initialization
      expect(console.info).toHaveBeenCalledWith(
        "ErrorTrackingService initialized",
      );
    });

    it("should not set up listeners if already initialized", () => {
      errorTrackingService.init();
      vi.clearAllMocks();
      errorTrackingService.init();

      // Verify no event listeners were added on second call
      expect(window.addEventListener).not.toHaveBeenCalled();
    });
  });

  describe("setUser", () => {
    it("should set the user ID for error tracking", () => {
      errorTrackingService.setUser("test-user-123");
      errorTrackingService.log(LogLevel.ERROR, "Test error");

      expect(console.error).toHaveBeenCalledWith(
        "[ERROR] Test error",
        expect.any(Object),
      );
    });
  });

  describe("log", () => {
    it("should log errors to console with ERROR level", () => {
      const errorMessage = "Test error message";
      errorTrackingService.log(LogLevel.ERROR, errorMessage);

      expect(console.error).toHaveBeenCalledWith(
        "[ERROR] Test error message",
        expect.any(Object),
      );
    });

    it("should log warnings to console with WARN level", () => {
      errorTrackingService.log(LogLevel.WARN, "Test warning");

      expect(console.warn).toHaveBeenCalledWith(
        "[WARN] Test warning",
        expect.any(Object),
      );
    });

    it("should log info to console with INFO level", () => {
      errorTrackingService.log(LogLevel.INFO, "Test info");

      expect(console.info).toHaveBeenCalledWith(
        "[INFO] Test info",
        expect.any(Object),
      );
    });

    it("should log debug messages to console with DEBUG level", () => {
      errorTrackingService.log(LogLevel.DEBUG, "Test debug");

      expect(console.debug).toHaveBeenCalledWith(
        "[DEBUG] Test debug",
        expect.any(Object),
      );
    });

    it("should include metadata when provided", () => {
      const metadata = { userId: "123", page: "home" };
      errorTrackingService.log(LogLevel.ERROR, "Test with metadata", metadata);

      expect(console.error).toHaveBeenCalledWith(
        "[ERROR] Test with metadata",
        expect.any(Object),
      );
    });

    it("should handle Error objects and include stack trace", () => {
      const error = new Error("Test error object");
      errorTrackingService.log(LogLevel.ERROR, error);

      expect(console.error).toHaveBeenCalledWith(
        "[ERROR] Test error object",
        expect.any(Object),
      );
    });
  });
});
