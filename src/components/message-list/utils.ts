import { MessageStatus } from "#types/message";
import { formatTime, getRelativeTime } from "#utils/index";

export const formatMessageTime = (timestamp: number): string => {
  return formatTime(timestamp);
};

export const getMessageRelativeTime = (timestamp: number): string => {
  return getRelativeTime(timestamp);
};

export const getStatusClass = (status?: MessageStatus): string => {
  switch (status) {
    case MessageStatus.SENDING:
      return "text-yellow-500";
    case MessageStatus.SENT:
      return "text-green-500";
    case MessageStatus.ERROR:
      return "text-red-500";
    default:
      return "";
  }
};

export const getStatusText = (status?: MessageStatus): string => {
  switch (status) {
    case MessageStatus.SENDING:
      return "Sending...";
    case MessageStatus.SENT:
      return "Sent";
    case MessageStatus.ERROR:
      return "Sending error";
    default:
      return "";
  }
};
