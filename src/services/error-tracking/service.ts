import {
  ErrorTrackingServiceInterface,
  ErrorMetadata,
  LogLevel,
  ErrorInfo,
} from "./types";
import { environment } from "#environments/environment";

/**
 * Service for logging, tracking, and reporting errors.
 *
 * Supports console logging and optional server-side error reporting.
 * Follows singleton pattern.
 */
class ErrorTrackingService implements ErrorTrackingServiceInterface {
  private static instance: ErrorTrackingService;
  private isInitialized = false;
  private userId: string | null = null;
  private errorQueue: ErrorInfo[] = [];
  private readonly maxQueueSize = 100;
  private readonly consoleEnabled = true;
  private readonly serverEnabled =
    environment.VITE_ERROR_TRACKING_ENABLED || false;
  private readonly serverUrl = environment.VITE_ERROR_TRACKING_URL || "";

  /**
   * Returns the singleton instance of the service.
   */
  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  /**
   * Initializes error listeners for uncaught errors and unhandled promise rejections.
   * Should be called once during app startup.
   */
  public init(): void {
    if (this.isInitialized) return;

    window.addEventListener("error", (event) => {
      this.log(LogLevel.ERROR, event.error || event.message);
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.log(LogLevel.ERROR, event.reason || "Unhandled Promise Rejection");
    });

    this.isInitialized = true;
    console.info("ErrorTrackingService initialized");
  }

  /**
   * Sets the current user ID for error tracking context.
   * @param userId User identifier
   */
  public setUser(userId: string): void {
    this.userId = userId;
  }

  /**
   * Logs an error, warning, info, or debug message.
   * Also handles server queueing if enabled.
   * @param level Log level (DEBUG, INFO, WARN, ERROR, FATAL)
   * @param error Error instance or message string
   * @param metadata Optional additional context
   */
  public log(
    level: LogLevel,
    error: Error | string,
    metadata?: ErrorMetadata,
  ): void {
    const errorInfo = this.createErrorInfo(level, error, metadata);
    this.processError(errorInfo);
  }

  /**
   * Creates a standardized error object for internal processing.
   * @param level Log level
   * @param error Error instance or message string
   * @param metadata Optional metadata
   * @returns Formatted error information
   */
  private createErrorInfo(
    level: LogLevel,
    error: Error | string,
    metadata?: ErrorMetadata,
  ): ErrorInfo {
    const isError = error instanceof Error;
    return {
      message: isError ? error.message : error,
      stack: isError ? error.stack : undefined,
      timestamp: Date.now(),
      level,
      metadata,
      userId: this.userId || undefined,
      context: this.getContext(),
    };
  }

  /**
   * Processes the error: logs to console and/or queues for server reporting.
   * @param errorInfo Error details
   */
  private processError(errorInfo: ErrorInfo): void {
    if (this.consoleEnabled) {
      this.logToConsole(errorInfo);
    }

    if (this.serverEnabled) {
      this.addToQueue(errorInfo);
    }
  }

  /**
   * Logs error details to the browser console using appropriate log level.
   * @param errorInfo Error details
   */
  private logToConsole({ level, message, metadata, stack }: ErrorInfo): void {
    const consoleMethod = this.getConsoleMethod(level);
    const logMessage = `[${level.toUpperCase()}] ${message}`;

    if (metadata) {
      consoleMethod(logMessage, { metadata, stack });
    } else {
      consoleMethod(logMessage, { stack });
    }
  }

  /**
   * Maps the log level to the corresponding console method.
   * @param level Log level
   * @returns Console method
   */
  private getConsoleMethod(level: LogLevel): (...args: unknown[]) => void {
    const methodMap: Record<LogLevel, (...args: unknown[]) => void> = {
      [LogLevel.DEBUG]: console.debug,
      [LogLevel.INFO]: console.info,
      [LogLevel.WARN]: console.warn,
      [LogLevel.ERROR]: console.error,
      [LogLevel.FATAL]: console.error,
    };

    return methodMap[level] || console.log;
  }

  /**
   * Adds an error to the local queue for future server reporting.
   * Flushes immediately if max queue size reached or fatal error occurs.
   * @param errorInfo Error details
   */
  private addToQueue(errorInfo: ErrorInfo): void {
    this.errorQueue.push(errorInfo);

    if (
      this.errorQueue.length >= this.maxQueueSize ||
      errorInfo.level === LogLevel.FATAL
    ) {
      this.flushQueue();
    }
  }

  /**
   * Sends all queued errors to the server.
   * Automatically retries by preserving errors if the request fails.
   */
  private flushQueue(): void {
    if (!this.errorQueue.length || !this.serverUrl) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    fetch(this.serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ errors: errorsToSend }),
    }).catch((err) => {
      console.error("Failed to send errors to server:", err);
      // Return errors to the queue if sending fails
      this.errorQueue.unshift(...errorsToSend);
    });
  }

  /**
   * Gets the current context (URL) where the error occurred.
   * @returns Current window location
   */
  private getContext(): string {
    return window.location.href;
  }
}

// Export singleton instance
export const errorTrackingService = ErrorTrackingService.getInstance();
