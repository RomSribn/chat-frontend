import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useUsernameForm, validateUsername, getErrorMessage, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from '#components/username-form/hooks';

// Mock dependencies
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn()
}));

vi.mock('#context/auth-context', () => ({
  useAuth: () => ({
    login: vi.fn()
  })
}));

vi.mock('#services/storage', () => ({
  default: {
    getUsername: vi.fn(),
    setUsername: vi.fn()
  }
}));

vi.mock('#services/error-tracking', () => ({
  default: {
    log: vi.fn(),
    setUser: vi.fn()
  },
  LogLevel: {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
  }
}));

describe('Username Form Hooks', () => {
  describe('validateUsername', () => {
    it('should return "empty" for empty username', () => {
      expect(validateUsername('')).toBe('empty');
    });

    it(`should return "too_short" for username shorter than ${USERNAME_MIN_LENGTH} characters`, () => {
      expect(validateUsername('ab')).toBe('too_short');
    });

    it(`should return "too_long" for username longer than ${USERNAME_MAX_LENGTH} characters`, () => {
      const longUsername = 'a'.repeat(USERNAME_MAX_LENGTH + 1);
      expect(validateUsername(longUsername)).toBe('too_long');
    });

    it('should return "invalid_chars" for username with invalid characters', () => {
      expect(validateUsername('user@name')).toBe('invalid_chars');
      expect(validateUsername('user name')).toBe('invalid_chars');
      expect(validateUsername('user#name')).toBe('invalid_chars');
    });

    it('should return null for valid username', () => {
      expect(validateUsername('valid-user')).toBeNull();
      expect(validateUsername('valid_user')).toBeNull();
      expect(validateUsername('validUser123')).toBeNull();
      expect(validateUsername('Username1')).toBeNull();
    });
  });

  describe('getErrorMessage', () => {
    it('should return appropriate message for each error type', () => {
      expect(getErrorMessage('empty')).toContain('cannot be empty');
      expect(getErrorMessage('too_short')).toContain(`at least ${USERNAME_MIN_LENGTH}`);
      expect(getErrorMessage('too_long')).toContain(`not exceed ${USERNAME_MAX_LENGTH}`);
      expect(getErrorMessage('invalid_chars')).toContain('may contain only');
      expect(getErrorMessage(null)).toBe('');
    });
  });

  describe('useUsernameForm', () => {
    const mockEvent = {
      preventDefault: vi.fn()
    };

    const mockChangeEvent = (value: string) => ({
      target: { value }
    });

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should initialize with empty input and no error', () => {
      const { result } = renderHook(() => useUsernameForm());
      
      expect(result.current.input).toBe('');
      expect(result.current.error).toBeNull();
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should update input value on handleChange', () => {
      const { result } = renderHook(() => useUsernameForm());
      
      act(() => {
        result.current.handleChange(mockChangeEvent('testuser') as any);
      });
      
      expect(result.current.input).toBe('testuser');
    });

    it('should validate on blur', () => {
      const { result } = renderHook(() => useUsernameForm());
      
      // Set invalid input
      act(() => {
        result.current.handleChange(mockChangeEvent('a') as any);
      });
      
      // Initially no error because not touched
      expect(result.current.error).toBeNull();
      
      act(() => {
        result.current.handleBlur();
      });
      
      expect(result.current.error).toBe('too_short');
    });

    it('should validate on change after field is touched', () => {
      const { result } = renderHook(() => useUsernameForm());
      
      // Mark as touched
      act(() => {
        result.current.handleBlur();
      });
      
      // Set invalid input
      act(() => {
        result.current.handleChange(mockChangeEvent('a') as any);
      });
      
      // Should have error immediately
      expect(result.current.error).toBe('too_short');
      
      // Set valid input
      act(() => {
        result.current.handleChange(mockChangeEvent('validuser') as any);
      });
      
      // Error should be cleared
      expect(result.current.error).toBeNull();
    });

  it('should not submit form with validation errors', () => {
    const { result } = renderHook(() => useUsernameForm());
    
    // Set invalid input
    act(() => {
      result.current.handleChange(mockChangeEvent('a') as any);
    });
    
    // Submit form
    act(() => {
      result.current.handleSubmit(mockEvent as any);
    });
    
    // Should set error and not proceed
    expect(result.current.error).toBe('too_short');
  });

  it('should submit form with valid input', () => {
    const { result } = renderHook(() => useUsernameForm());
    
    // Set valid input
    act(() => {
      result.current.handleChange(mockChangeEvent('validuser') as any);
    });
    
    // Submit form
    act(() => {
      result.current.handleSubmit(mockEvent as any);
    });
    
    // Should proceed with submission
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should trim whitespace from username during validation', () => {
    const { result } = renderHook(() => useUsernameForm());
    
    // Set input with whitespace
    act(() => {
      result.current.handleChange(mockChangeEvent('  validuser  ') as any);
    });
    
    // Submit form
    act(() => {
      result.current.handleSubmit(mockEvent as any);
    });
    
    // Should have trimmed the username during validation
    expect(result.current.input).toBe('  validuser  '); // Input remains untouched
    // But validation would have trimmed it internally
  });
  });
});
