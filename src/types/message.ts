export interface ChatMessage {
  id: string;
  username: string;
  content: string;
  timestamp: number;
}

export interface MessageError {
  message: string;
  code?: string;
}

export enum MessageStatus {
  SENDING = "sending",
  SENT = "sent",
  ERROR = "error",
}

export interface MessageWithStatus extends ChatMessage {
  status?: MessageStatus;
  error?: MessageError;
}
