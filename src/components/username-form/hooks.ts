import {
  useState,
  FormEvent,
  useCallback,
  useEffect,
  ChangeEvent,
} from "react";
import { useNavigate } from "react-router";

import { useAuth } from "#context/auth-context";
import { RouteNames } from "#router/utils";
import storageService from "#services/storage";
import errorTrackingService, { LogLevel } from "#services/error-tracking";

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_PATTERN = /^[a-zA-Zа-яА-Я0-9_-]+$/;

export type ValidationError =
  | "empty"
  | "too_short"
  | "too_long"
  | "invalid_chars"
  | null;

export const validateUsername = (username: string): ValidationError => {
  if (!username) return "empty";
  if (username.length < USERNAME_MIN_LENGTH) return "too_short";
  if (username.length > USERNAME_MAX_LENGTH) return "too_long";
  if (!USERNAME_PATTERN.test(username)) return "invalid_chars";
  return null;
};

export const getErrorMessage = (error: ValidationError): string => {
  switch (error) {
    case "empty":
      return "The user name cannot be empty";
    case "too_short":
      return `The user name must contain at least ${USERNAME_MIN_LENGTH} symbol`;
    case "too_long":
      return `The user name should not exceed ${USERNAME_MAX_LENGTH} symbols`;
    case "invalid_chars":
      return "The user name may contain only letters, numbers, hyphen and emphasizing";
    default:
      return "";
  }
};

export const useUsernameForm = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<ValidationError>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = storageService.getUsername();
    if (savedUsername) {
      setInput(savedUsername);
    }
  }, []);

  const validateInput = useCallback((value: string): ValidationError => {
    const trimmed = value.trim();
    return validateUsername(trimmed);
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInput(newValue);

      if (isTouched) {
        setError(validateInput(newValue));
      }
    },
    [isTouched, validateInput],
  );

  const handleBlur = useCallback(() => {
    setIsTouched(true);
    setError(validateInput(input));
  }, [input, validateInput]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();

      const trimmed = input.trim();
      const validationError = validateUsername(trimmed);

      setIsTouched(true);
      setError(validationError);

      if (validationError) {
        errorTrackingService.log(
          LogLevel.WARN,
          `Validation error: ${getErrorMessage(validationError)}`,
          {
            username: trimmed,
            validationError,
          },
        );
        return;
      }

      setIsSubmitting(true);

      try {
        storageService.setUsername(trimmed);
        login(trimmed);
        errorTrackingService.setUser(trimmed);

        errorTrackingService.log(
          LogLevel.INFO,
          `User ${trimmed} entered the chat`,
        );

        navigate(RouteNames.HOME);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        errorTrackingService.log(
          LogLevel.ERROR,
          `Error when setting user name: ${errorMessage}`,
          { username: trimmed },
        );
        console.error("Error when setting user name:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [input, navigate, login],
  );

  return {
    input,
    error,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    getErrorMessage,
  };
};
