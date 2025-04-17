import { ButtonHTMLAttributes, memo } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const getVariantClasses = (variant: ButtonVariant): string => {
  switch (variant) {
    case "primary":
      return "bg-blue-600 hover:bg-blue-700 text-white";
    case "secondary":
      return "bg-gray-200 hover:bg-gray-300 text-gray-800";
    case "danger":
      return "bg-red-600 hover:bg-red-700 text-white";
    case "success":
      return "bg-green-600 hover:bg-green-700 text-white";
    default:
      return "bg-blue-600 hover:bg-blue-700 text-white";
  }
};

const getSizeClasses = (size: ButtonSize): string => {
  switch (size) {
    case "sm":
      return "px-2 py-1 text-sm";
    case "md":
      return "px-4 py-2";
    case "lg":
      return "px-6 py-3 text-lg";
    default:
      return "px-4 py-2";
  }
};

const Button = memo(
  ({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    fullWidth = false,
    disabled,
    className = "",
    ...props
  }: ButtonProps) => {
    const baseClasses =
      "rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    const widthClasses = fullWidth ? "w-full" : "";
    const disabledClasses =
      disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";

    return (
      <button
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${disabledClasses} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
