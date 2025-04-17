import { io, Socket } from "socket.io-client";
import { ChatMessage } from "#types/message";
import { environment } from "#environments/environment";
import { SocketServiceInterface } from "./types";

/**
 * Singleton class for managing a socket connection
 */
class SocketService implements SocketServiceInterface {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private messageListeners: Set<(message: ChatMessage) => void> = new Set();

  /**
   * Get the singleton instance of the service
   */
  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  /**
   * Initialize the socket connection
   */
  public connect(): Socket {
    if (!this.socket) {
      this.socket = io(environment.VITE_SOCKET_BASE_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
      });

      // Log connection state
      this.socket.on("connect", () => console.log("Socket connected"));
      this.socket.on("disconnect", () => console.log("Socket disconnected"));
      this.socket.on("connect_error", (error) =>
        console.error("Socket connection error:", error),
      );

      // Set up new message handler
      this.socket.on("new-message", (message: ChatMessage) => {
        this.messageListeners.forEach((listener) => {
          try {
            listener(message);
          } catch (error) {
            console.error("Error in message listener:", error);
          }
        });
      });
    }
    return this.socket;
  }

  /**
   * Send a message
   */
  public sendMessage(username: string, content: string): void {
    if (!this.socket) {
      this.connect();
    }

    try {
      this.socket?.emit("send-message", { username, content });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Subscribe to new messages
   */
  public onNewMessage(callback: (message: ChatMessage) => void): () => void {
    if (!this.socket) {
      this.connect();
    }

    // Add listener to the Set
    this.messageListeners.add(callback);

    // Return a function to unsubscribe
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  /**
   * Remove all message listeners
   */
  public offAllMessageListeners(): void {
    this.messageListeners.clear();
  }

  /**
   * Disconnect the socket
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.messageListeners.clear();
    }
  }

  /**
   * Get the current socket instance
   */
  public getSocket(): Socket | null {
    return this.socket;
  }
}

// Export the singleton instance
export const socketService = SocketService.getInstance();
