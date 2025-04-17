
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MessageWithStatus, MessageStatus } from '#types/message';
import { MessageList } from '#components/message-list/index';
import MessageItem from '#components/message-list/message-item';

// Mock the MessageItem component
vi.mock('#components/message-list/message-item', () => {
  return {
    default: vi.fn(() => <div data-testid="message-item" />)
  };
});

// Mock the useEffect hook to prevent scrollIntoView error
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useEffect: vi.fn((callback) => callback()),
    useRef: vi.fn(() => ({ current: null }))
  };
});

describe('MessageList Component', () => {
  const mockMessages: MessageWithStatus[] = [
    {
      id: '1',
      username: 'user1',
      content: 'Hello',
      timestamp: 1672567200000, // 2023-01-01T10:00:00
      status: MessageStatus.SENT
    },
    {
      id: '2',
      username: 'user2',
      content: 'Hi there',
      timestamp: 1672567260000, // 2023-01-01T10:01:00
      status: MessageStatus.SENT
    },
    {
      id: '3',
      username: 'user1',
      content: 'How are you?',
      timestamp: 1672567320000, // 2023-01-01T10:02:00
      status: MessageStatus.SENT
    }
  ];

  const mockMessageStatuses = {
    '1': MessageStatus.SENT,
    '2': MessageStatus.SENT,
    '3': MessageStatus.SENT
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render empty state when no messages', () => {
    render(<MessageList messages={[]} />);
    
    expect(screen.getByText(/no messages/i)).toBeTruthy();
  });

  it('should render messages when provided', () => {
    render(<MessageList messages={mockMessages} />);
    
    const messageItems = screen.getAllByTestId('message-item');
    expect(messageItems.length).toBe(mockMessages.length);
  });

  it('should pass correct props to MessageItem', () => {
    render(<MessageList messages={mockMessages} messageStatuses={mockMessageStatuses} />);
    
    // Check that MessageItem was called the correct number of times
    expect(MessageItem).toHaveBeenCalledTimes(mockMessages.length);
    
    // Get all calls to MessageItem
    const calls = vi.mocked(MessageItem).mock.calls;
    
    // Check each call has the expected message and status
    expect(calls[0][0].message).toEqual(mockMessages[0]);
    expect(calls[0][0].status).toEqual(mockMessages[0].status);
    
    expect(calls[1][0].message).toEqual(mockMessages[1]);
    expect(calls[1][0].status).toEqual(mockMessages[1].status);
    
    expect(calls[2][0].message).toEqual(mockMessages[2]);
    expect(calls[2][0].status).toEqual(mockMessages[2].status);
  });

  it('should render container with correct styles', () => {
    render(<MessageList messages={mockMessages} />);
    
    // Get the container directly
    const container = screen.getAllByTestId('message-item')[0].parentElement;
    expect(container).toBeTruthy();
    expect(container?.className).toContain('space-y-2');
    expect(container?.className).toContain('max-h-[300px]');
    expect(container?.className).toContain('overflow-y-auto');
  });
});
