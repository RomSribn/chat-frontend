/**
 * Logging levels
 */
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

/**
 * Metadata associated with an error
 */
export interface ErrorMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Detailed information about an error
 */
export interface ErrorInfo {
  message: string;
  stack?: string;
  code?: string;
  timestamp: number;
  level: LogLevel;
  metadata?: ErrorMetadata;
  context?: string;
  userId?: string;
}

/**
 * Interface for an error tracking and logging service
 */
export interface ErrorTrackingServiceInterface {
  /**
   * Initializes the service and sets up global error listeners.
   */
  init(): void;

  /**
   * Sets the current user ID for error tracking context.
   * @param userId User identifier
   */
  setUser(userId: string): void;

  /**
   * Logs a message at a specific log level (DEBUG, INFO, WARN, ERROR, FATAL).
   * @param level Log level
   * @param error Error object or message string
   * @param metadata Optional additional metadata
   */
  log(level: LogLevel, error: Error | string, metadata?: ErrorMetadata): void;
}
