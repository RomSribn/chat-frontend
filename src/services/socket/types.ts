import { Socket } from "socket.io-client";
import { ChatMessage } from "#types/message";

export interface SocketServiceInterface {
  connect(): Socket;
  sendMessage(username: string, content: string): void;
  onNewMessage(callback: (message: ChatMessage) => void): () => void;
  offAllMessageListeners(): void;
  disconnect(): void;
  getSocket(): Socket | null;
}
