/**
 * Username validation
 */
export const validateUsername = (
  username: string,
  minLength = 3,
  maxLength = 20,
): { isValid: boolean; error?: string } => {
  if (!username) {
    return { isValid: false, error: "Username cannot be empty" };
  }

  if (username.length < minLength) {
    return {
      isValid: false,
      error: `Username must be at least ${minLength} characters long`,
    };
  }

  if (username.length > maxLength) {
    return {
      isValid: false,
      error: `Username must not exceed ${maxLength} characters`,
    };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      error:
        "Username can only contain letters, numbers, hyphens, and underscores",
    };
  }

  return { isValid: true };
};

/**
 * Message validation
 */
export const validateMessage = (
  message: string,
  maxLength = 1000,
): { isValid: boolean; error?: string } => {
  if (!message) {
    return { isValid: false, error: "Message cannot be empty" };
  }

  if (message.length > maxLength) {
    return {
      isValid: false,
      error: `Message must not exceed ${maxLength} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Email validation
 */
export const validateEmail = (
  email: string,
): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: "Email cannot be empty" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }

  return { isValid: true };
};
