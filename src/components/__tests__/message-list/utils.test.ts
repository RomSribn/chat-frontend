import { describe, it, expect, vi } from 'vitest';

import {
  formatMessageTime,
  getMessageRelativeTime,
  getStatusClass,
  getStatusText
} from '#components/message-list/utils';
import { formatTime, getRelativeTime} from '#utils/index';
import { MessageStatus } from '#types/message';

// Mock the date utils
vi.mock('#utils/index', () => ({
  formatTime: vi.fn((timestamp) => `mocked-time-${timestamp}`),
  getRelativeTime: vi.fn((timestamp) => `mocked-relative-${timestamp}`)
}));

describe('Message List Utils', () => {
  describe('formatMessageTime', () => {
    it('should call formatTime with the timestamp', () => {
      const timestamp = 1650000000000;
      const result = formatMessageTime(timestamp);
      
      expect(formatTime).toHaveBeenCalledWith(timestamp);
      expect(result).toBe(`mocked-time-${timestamp}`);
    });
  });

  describe('getMessageRelativeTime', () => {
    it('should call getRelativeTime with the timestamp', () => {
      const timestamp = 1650000000000;
      const result = getMessageRelativeTime(timestamp);
      
      expect(getRelativeTime).toHaveBeenCalledWith(timestamp);
      expect(result).toBe(`mocked-relative-${timestamp}`);
    });
  });

  describe('getStatusClass', () => {
    it('should return the correct class for SENDING status', () => {
      const result = getStatusClass(MessageStatus.SENDING);
      expect(result).toBe('text-yellow-500');
    });

    it('should return the correct class for SENT status', () => {
      const result = getStatusClass(MessageStatus.SENT);
      expect(result).toBe('text-green-500');
    });

    it('should return the correct class for ERROR status', () => {
      const result = getStatusClass(MessageStatus.ERROR);
      expect(result).toBe('text-red-500');
    });

    it('should return an empty string for undefined status', () => {
      const result = getStatusClass(undefined);
      expect(result).toBe('');
    });
  });

  describe('getStatusText', () => {
    it('should return the correct text for SENDING status', () => {
      const result = getStatusText(MessageStatus.SENDING);
      expect(result).toBe('Sending...');
    });

    it('should return the correct text for SENT status', () => {
      const result = getStatusText(MessageStatus.SENT);
      expect(result).toBe('Sent');
    });

    it('should return the correct text for ERROR status', () => {
      const result = getStatusText(MessageStatus.ERROR);
      expect(result).toBe('Sending error');
    });

    it('should return an empty string for undefined status', () => {
      const result = getStatusText(undefined);
      expect(result).toBe('');
    });
  });
});
