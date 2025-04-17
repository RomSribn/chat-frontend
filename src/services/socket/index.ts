import { ChatMessage } from "#types/message";
import { socketService } from "./service";

export const sendMessage = (username: string, content: string): void => {
  socketService.sendMessage(username, content);
};

export const onNewMessage = (
  callback: (message: ChatMessage) => void,
): (() => void) => {
  return socketService.onNewMessage(callback);
};

export default socketService;
export * from "./types";
