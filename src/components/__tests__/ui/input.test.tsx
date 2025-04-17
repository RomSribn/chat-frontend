import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '#components/ui/input';
import React from 'react';

describe('Input Component', () => {
  it('should render with default props', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeTruthy();
    expect(input).toHaveClass('border-gray-300');
    expect(input).not.toHaveClass('w-full');
    expect(input).not.toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('should render with label', () => {
    render(<Input label="Username" id="username" />);
    
    const label = screen.getByText('Username');
    expect(label).toBeTruthy();
    expect(label).toHaveAttribute('for', 'username');
    expect(label).toHaveClass('text-gray-700');
  });

  it('should render with error state', () => {
    render(<Input error="This field is required" id="test-input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage).toHaveClass('text-red-600');
    expect(errorMessage).toHaveAttribute('id', 'test-input-error');
  });

  it('should render with full width', () => {
    render(<Input fullWidth />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('w-full');
    
    // The container should also have full width
    const container = input.parentElement;
    expect(container).toHaveClass('w-full');
  });

  it('should render as disabled', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-gray-100');
    expect(input).toHaveClass('cursor-not-allowed');
  });

  it('should render with custom className', () => {
    render(<Input className="custom-class" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('should call onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should call onBlur when input loses focus', () => {
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.blur(input);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should pass additional HTML attributes to the input element', () => {
    render(
      <Input 
        type="email" 
        placeholder="Enter email" 
        maxLength={50} 
        data-testid="test-input" 
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toHaveAttribute('maxLength', '50');
    expect(input).toHaveAttribute('data-testid', 'test-input');
  });

  it('should forward ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('should connect label, input and error message with correct aria attributes', () => {
    render(
      <Input 
        id="test-field" 
        label="Test Field" 
        error="Invalid input" 
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-field');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-field-error');
    
    const errorMessage = screen.getByText('Invalid input');
    expect(errorMessage).toHaveAttribute('id', 'test-field-error');
    
    const label = screen.getByText('Test Field');
    expect(label).toHaveAttribute('for', 'test-field');
  });
});
