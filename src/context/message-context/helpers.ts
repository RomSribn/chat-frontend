import { MessageError, MessageStatus } from "#types/message";
import { MessageState } from "./types";

/**
 * Checks if a message already exists in the array based on ID or similar content.
 */
const isDuplicateMessage = (
  existing: MessageState["messages"][number],
  incoming: MessageState["messages"][number],
) => {
  return (
    existing.id === incoming.id ||
    (existing.content === incoming.content &&
      existing.username === incoming.username &&
      Math.abs(existing.timestamp - incoming.timestamp) < 5000)
  );
};

/**
 * Adds a new message to the array if it doesn't already exist
 * (based on id or same content/username/timestamp proximity).
 * @param messages Existing messages array
 * @param newMessage Message to add
 * @returns Updated messages array
 */
export const addUniqueMessage = (
  messages: MessageState["messages"],
  newMessage: MessageState["messages"][number],
) => {
  return messages.some((msg) => isDuplicateMessage(msg, newMessage))
    ? messages
    : [...messages, { ...newMessage }];
};

/**
 * Updates an existing message by ID or adds a new one if not found.
 * Forces status to SENT after update.
 * @param messages Existing messages array
 * @param updatedMessage Message with updated fields
 * @returns Updated messages array
 */
export const updateMessage = (
  messages: MessageState["messages"],
  updatedMessage: MessageState["messages"][number],
) => {
  let found = false;
  const updated = messages.map((msg) => {
    if (msg.id !== updatedMessage.id) return msg;
    found = true;
    return { ...msg, ...updatedMessage, status: MessageStatus.SENT };
  });

  return found ? updated : [...messages, { ...updatedMessage }];
};

/**
 * Updates the status (and optional error) for a message by ID.
 * @param messages Existing messages array
 * @param id ID of the message to update
 * @param status New status to set
 * @param error Optional error message
 * @returns Updated messages array
 */
export const updateMessageStatus = (
  messages: MessageState["messages"],
  id: string,
  status: MessageStatus,
  error?: MessageError,
) => {
  return messages.map((msg) =>
    msg.id === id
      ? {
          ...msg,
          status,
          ...(error && { error }),
        }
      : msg,
  );
};
