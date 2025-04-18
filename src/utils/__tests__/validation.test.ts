import { describe, it, expect } from "vitest";
import {
  validateUsername,
  validateMessage,
  validateEmail,
} from "../validation";

describe("Validation Utils", () => {
  describe("validateUsername", () => {
    it("should validate a valid username", () => {
      const result = validateUsername("validuser");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should validate usernames with numbers", () => {
      const result = validateUsername("user123");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should validate usernames with underscores and hyphens", () => {
      const result1 = validateUsername("valid_user");
      expect(result1.isValid).toBe(true);
      expect(result1.error).toBeUndefined();

      const result2 = validateUsername("valid-user");
      expect(result2.isValid).toBe(true);
      expect(result2.error).toBeUndefined();
    });

    it("should reject empty usernames", () => {
      const result = validateUsername("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Username cannot be empty");
    });

    it("should reject usernames shorter than minimum length", () => {
      const result = validateUsername("ab", 3);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Username must be at least 3 characters long");
    });

    it("should reject usernames longer than maximum length", () => {
      const longUsername = "a".repeat(21);
      const result = validateUsername(longUsername, 3, 20);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Username must not exceed 20 characters");
    });

    it("should reject usernames with invalid characters", () => {
      const result1 = validateUsername("user@name");
      expect(result1.isValid).toBe(false);
      expect(result1.error).toBe(
        "Username can only contain letters, numbers, hyphens, and underscores",
      );

      const result2 = validateUsername("user name");
      expect(result2.isValid).toBe(false);
      expect(result2.error).toBe(
        "Username can only contain letters, numbers, hyphens, and underscores",
      );

      const result3 = validateUsername("user#name");
      expect(result3.isValid).toBe(false);
      expect(result3.error).toBe(
        "Username can only contain letters, numbers, hyphens, and underscores",
      );
    });

    it("should use custom minimum and maximum length", () => {
      // Valid with custom min/max
      const result1 = validateUsername("ab", 2, 10);
      expect(result1.isValid).toBe(true);
      expect(result1.error).toBeUndefined();

      // Too short with custom min
      const result2 = validateUsername("a", 2, 10);
      expect(result2.isValid).toBe(false);
      expect(result2.error).toBe("Username must be at least 2 characters long");

      // Too long with custom max
      const longUsername = "a".repeat(11);
      const result3 = validateUsername(longUsername, 2, 10);
      expect(result3.isValid).toBe(false);
      expect(result3.error).toBe("Username must not exceed 10 characters");
    });
  });

  describe("validateMessage", () => {
    it("should validate a valid message", () => {
      const result = validateMessage("This is a valid message");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should reject empty messages", () => {
      const result = validateMessage("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Message cannot be empty");
    });

    it("should reject messages longer than maximum length", () => {
      const longMessage = "a".repeat(1001);
      const result = validateMessage(longMessage);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Message must not exceed 1000 characters");
    });

    it("should use custom maximum length", () => {
      // Valid with custom max
      const result1 = validateMessage("Short message", 100);
      expect(result1.isValid).toBe(true);
      expect(result1.error).toBeUndefined();

      // Too long with custom max
      const longMessage = "a".repeat(101);
      const result2 = validateMessage(longMessage, 100);
      expect(result2.isValid).toBe(false);
      expect(result2.error).toBe("Message must not exceed 100 characters");
    });
  });

  describe("validateEmail", () => {
    it("should validate a valid email", () => {
      const result = validateEmail("user@example.com");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should validate emails with subdomains", () => {
      const result = validateEmail("user@sub.example.com");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should validate emails with numbers and special characters", () => {
      const result1 = validateEmail("user123@example.com");
      expect(result1.isValid).toBe(true);
      expect(result1.error).toBeUndefined();

      const result2 = validateEmail("user.name+tag@example.com");
      expect(result2.isValid).toBe(true);
      expect(result2.error).toBeUndefined();
    });

    it("should reject empty emails", () => {
      const result = validateEmail("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Email cannot be empty");
    });

    it("should reject emails without @ symbol", () => {
      const result = validateEmail("userexample.com");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid email format");
    });

    it("should reject emails without domain", () => {
      const result = validateEmail("user@");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid email format");
    });

    it("should reject emails without username", () => {
      const result = validateEmail("@example.com");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid email format");
    });

    it("should reject emails with spaces", () => {
      const result = validateEmail("user @example.com");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid email format");
    });

    it("should reject emails without top-level domain", () => {
      const result = validateEmail("user@example");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid email format");
    });
  });
});
