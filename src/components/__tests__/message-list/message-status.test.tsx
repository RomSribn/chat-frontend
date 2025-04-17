import { describe, it, expect} from 'vitest';
import { render, screen } from '@testing-library/react';

import MessageStatusIndicator from '#components/message-list/message-status';
import { MessageStatus } from '#types/message';

describe('MessageStatusIndicator Component', () => {
  const mockError = {
    message: 'Failed to send message',
    code: 'ERROR_001'
  };

  it('should render sending status', () => {
    render(<MessageStatusIndicator status={MessageStatus.SENDING} />);
    
    const statusElement = screen.getByTestId('message-status');
    expect(statusElement).toBeTruthy();
    expect(statusElement.textContent).toContain('Sending');
    expect(statusElement.className).toContain('text-yellow-500');
  });

  it('should render sent status', () => {
    render(<MessageStatusIndicator status={MessageStatus.SENT} />);
    
    const statusElement = screen.getByTestId('message-status');
    expect(statusElement).toBeTruthy();
    expect(statusElement.textContent).toContain('Sent');
    expect(statusElement.className).toContain('text-green-500');
  });

  it('should render error status without error details', () => {
    render(<MessageStatusIndicator status={MessageStatus.ERROR} />);
    
    const statusElement = screen.getByTestId('message-status');
    expect(statusElement).toBeTruthy();
    expect(statusElement.textContent).toContain('Sending error');
    expect(statusElement.className).toContain('text-red-500');
    
    // Should not show error details when not provided
    expect(screen.queryByText(/failed to send/i)).toBeNull();
  });

  it('should render error status with error details', () => {
    render(
      <MessageStatusIndicator 
        status={MessageStatus.ERROR} 
        error={mockError} 
      />
    );
    
    const statusElement = screen.getByTestId('message-status');
    expect(statusElement).toBeTruthy();
    expect(statusElement.textContent).toContain('Sending error');
    expect(statusElement.className).toContain('text-red-500');
    
    // Should show error details when provided
    const errorElements = screen.getAllByText(/Failed to send message/i);
    expect(errorElements.length).toBeGreaterThan(0);
  });

  it('should not render anything for unknown status', () => {
    // @ts-ignore - Testing invalid status
    render(<MessageStatusIndicator status="UNKNOWN_STATUS" />);
    
    expect(screen.queryByTestId('message-status')).toBeNull();
  });
});
