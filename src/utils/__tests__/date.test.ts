import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatDateTime, formatTime, getRelativeTime } from "../date";

describe("Date Utils", () => {
  // Mock Date.now to return a fixed timestamp for consistent testing
  let originalDateNow: () => number;

  beforeEach(() => {
    originalDateNow = Date.now;
    // Mock current time to be 2025-04-17T15:00:00.000Z
    const mockNow = new Date("2025-04-17T15:00:00.000Z").getTime();
    Date.now = vi.fn(() => mockNow);
  });

  afterEach(() => {
    // Restore original Date.now
    Date.now = originalDateNow;
  });

  describe("formatDateTime", () => {
    it("should format timestamp to locale string", () => {
      // Create a timestamp for 2025-04-17T14:30:45.000Z
      const timestamp = new Date("2025-04-17T14:30:45.000Z").getTime();

      // We can't test the exact string since it depends on the locale of the test environment
      // Instead, we'll check that it returns a string and contains expected parts
      const result = formatDateTime(timestamp);
      expect(typeof result).toBe("string");

      // Create a date object with the same timestamp to compare
      const date = new Date(timestamp);

      // Check that the formatted string includes the year, month, and day
      expect(result).toContain(date.getFullYear().toString());

      // Check that it's a valid date string
      expect(new Date(result).toString()).not.toBe("Invalid Date");
    });
  });

  describe("formatTime", () => {
    it("should format timestamp to time string with hours and minutes", () => {
      // Create a timestamp for 2025-04-17T14:30:45.000Z
      const timestamp = new Date("2025-04-17T14:30:45.000Z").getTime();

      const result = formatTime(timestamp);
      expect(typeof result).toBe("string");

      // Check that the time format is correct (should contain a colon)
      expect(result).toContain(":");

      // Check that it doesn't include seconds (by default)
      const timeParts = result.split(":");
      expect(timeParts.length).toBe(2);

      // Check that it's a valid time format
      const [hours, minutes] = timeParts;
      expect(parseInt(hours)).toBeLessThanOrEqual(12);
      expect(parseInt(minutes)).toBeLessThanOrEqual(59);

      // Check that it includes AM/PM indicator
      expect(result).toMatch(/[AP]M/);
    });
  });

  describe("getRelativeTime", () => {
    it('should return "just now" for timestamps less than a minute ago', () => {
      // 30 seconds ago
      const timestamp = Date.now() - 30 * 1000;
      expect(getRelativeTime(timestamp)).toBe("just now");
    });

    it("should return minutes for timestamps less than an hour ago", () => {
      // 5 minutes ago
      const timestamp = Date.now() - 5 * 60 * 1000;
      expect(getRelativeTime(timestamp)).toBe("5 minutes ago");

      // 1 minute ago
      const oneMinuteAgo = Date.now() - 60 * 1000;
      expect(getRelativeTime(oneMinuteAgo)).toBe("1 minute ago");
    });

    it("should return hours for timestamps less than a day ago", () => {
      // 2 hours ago
      const timestamp = Date.now() - 2 * 60 * 60 * 1000;
      expect(getRelativeTime(timestamp)).toBe("2 hours ago");

      // 1 hour ago
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      expect(getRelativeTime(oneHourAgo)).toBe("1 hour ago");
    });

    it("should return formatted date for timestamps more than a day ago", () => {
      // 2 days ago
      const timestamp = Date.now() - 2 * 24 * 60 * 60 * 1000;

      // Should return the formatted date
      const result = getRelativeTime(timestamp);
      expect(result).toBe(formatDateTime(timestamp));
    });

    it("should handle future timestamps", () => {
      // 1 hour in the future
      const timestamp = Date.now() + 60 * 60 * 1000;

      // Should return the formatted date for future dates
      const result = getRelativeTime(timestamp);
      expect(result).toBe(formatDateTime(timestamp));
    });
  });
});
