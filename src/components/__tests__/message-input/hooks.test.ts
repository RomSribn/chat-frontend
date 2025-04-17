import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMessageInput } from '../../../components/message-input/hooks';

describe('useMessageInput', () => {
  const mockOnSend = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty message and isSubmitting from props', () => {
    const { result } = renderHook(() => useMessageInput({ 
      onSend: mockOnSend, 
      isSubmitting: true 
    }));
    
    expect(result.current.message).toBe('');
    expect(result.current.isSubmittingMessage).toBe(true);
  });

  it('should update message when setMessage is called', () => {
    const { result } = renderHook(() => useMessageInput({ 
      onSend: mockOnSend 
    }));
    
    act(() => {
      result.current.setMessage('Hello, world!');
    });
    
    expect(result.current.message).toBe('Hello, world!');
  });

  it('should call onSend and clear message when handleSubmit is called with valid message', () => {
    const { result } = renderHook(() => useMessageInput({ 
      onSend: mockOnSend 
    }));
    
    // Set a message
    act(() => {
      result.current.setMessage('Hello, world!');
    });
    
    // Mock form event
    const mockEvent = {
      preventDefault: vi.fn()
    } as unknown as React.FormEvent<HTMLFormElement>;
    
    // Submit the form
    act(() => {
      result.current.handleSubmit(mockEvent);
    });
    
    // Check if preventDefault was called
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Check if onSend was called with the message
    expect(mockOnSend).toHaveBeenCalledWith('Hello, world!');
    
    // Check if message was cleared
    expect(result.current.message).toBe('');
    
    // Check if isSubmittingMessage was set to true
    expect(result.current.isSubmittingMessage).toBe(true);
    
    // Fast-forward timers to check if isSubmittingMessage is reset
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(result.current.isSubmittingMessage).toBe(false);
  });

  it('should not call onSend when handleSubmit is called with empty message', () => {
    const { result } = renderHook(() => useMessageInput({ 
      onSend: mockOnSend 
    }));
    
    // Mock form event
    const mockEvent = {
      preventDefault: vi.fn()
    } as unknown as React.FormEvent<HTMLFormElement>;
    
    // Submit the form with empty message
    act(() => {
      result.current.handleSubmit(mockEvent);
    });
    
    // Check if preventDefault was called
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Check if onSend was not called
    expect(mockOnSend).not.toHaveBeenCalled();
    
    // Check if isSubmittingMessage is still false
    expect(result.current.isSubmittingMessage).toBe(false);
  });

  it('should not call onSend when handleSubmit is called while already submitting', () => {
    const { result } = renderHook(() => useMessageInput({ 
      onSend: mockOnSend,
      isSubmitting: true
    }));
    
    // Set a message
    act(() => {
      result.current.setMessage('Hello, world!');
    });
    
    // Mock form event
    const mockEvent = {
      preventDefault: vi.fn()
    } as unknown as React.FormEvent<HTMLFormElement>;
    
    // Submit the form
    act(() => {
      result.current.handleSubmit(mockEvent);
    });
    
    // Check if preventDefault was called
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Check if onSend was not called
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('should handle Enter key press to submit the form', () => {
    const { result } = renderHook(() => useMessageInput({ 
      onSend: mockOnSend 
    }));
    
    // Create a mock form
    const mockForm = {
      dispatchEvent: vi.fn()
    };
    
    // Create a mock keyboard event
    const mockEvent = {
      key: 'Enter',
      shiftKey: false,
      preventDefault: vi.fn(),
      currentTarget: {
        form: mockForm
      }
    } as unknown as React.KeyboardEvent<HTMLInputElement>;
    
    // Call handleKeyDown
    act(() => {
      result.current.handleKeyDown(mockEvent);
    });
    
    // Check if preventDefault was called
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Check if form.dispatchEvent was called
    expect(mockForm.dispatchEvent).toHaveBeenCalled();
  });

  it('should not submit form on Enter key press with Shift key', () => {
    const { result } = renderHook(() => useMessageInput({ 
      onSend: mockOnSend 
    }));
    
    // Create a mock form
    const mockForm = {
      dispatchEvent: vi.fn()
    };
    
    // Create a mock keyboard event with Shift key
    const mockEvent = {
      key: 'Enter',
      shiftKey: true,
      preventDefault: vi.fn(),
      currentTarget: {
        form: mockForm
      }
    } as unknown as React.KeyboardEvent<HTMLInputElement>;
    
    // Call handleKeyDown
    act(() => {
      result.current.handleKeyDown(mockEvent);
    });
    
    // Check if preventDefault was not called
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    
    // Check if form.dispatchEvent was not called
    expect(mockForm.dispatchEvent).not.toHaveBeenCalled();
  });

  it('should not submit form on non-Enter key press', () => {
    const { result } = renderHook(() => useMessageInput({ 
      onSend: mockOnSend 
    }));
    
    // Create a mock form
    const mockForm = {
      dispatchEvent: vi.fn()
    };
    
    // Create a mock keyboard event with a different key
    const mockEvent = {
      key: 'A',
      shiftKey: false,
      preventDefault: vi.fn(),
      currentTarget: {
        form: mockForm
      }
    } as unknown as React.KeyboardEvent<HTMLInputElement>;
    
    // Call handleKeyDown
    act(() => {
      result.current.handleKeyDown(mockEvent);
    });
    
    // Check if preventDefault was not called
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    
    // Check if form.dispatchEvent was not called
    expect(mockForm.dispatchEvent).not.toHaveBeenCalled();
  });
});
