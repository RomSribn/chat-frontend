/**
 * Formats a date in local time
 */
export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString("en-US");
};

/**
 * Formats a time
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Returns a relative time (e.g., "5 minutes ago")
 */
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60 * 1000) {
    return "just now";
  }

  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  return formatDateTime(timestamp);
};
