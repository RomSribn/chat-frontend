import { InputHTMLAttributes, forwardRef, memo } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, fullWidth = false, className = "", ...props }, ref) => {
      const inputClasses = `
        p-2 border rounded 
        ${error ? "border-red-500" : "border-gray-300"} 
        ${fullWidth ? "w-full" : ""} 
        focus:outline-none focus:ring-2 focus:ring-blue-300
        ${props.disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        ${className}
      `;

      return (
        <div className={fullWidth ? "w-full" : ""}>
          {label && (
            <label
              htmlFor={props.id}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {label}
            </label>
          )}
          <input
            ref={ref}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={
              error && props.id ? `${props.id}-error` : undefined
            }
            {...props}
          />
          {error && (
            <p
              id={props.id ? `${props.id}-error` : undefined}
              className="mt-1 text-sm text-red-600"
            >
              {error}
            </p>
          )}
        </div>
      );
    },
  ),
);

Input.displayName = "Input";

export { Input };
