import { memo } from "react";

type LoaderSize = "sm" | "md" | "lg";
type LoaderColor = "primary" | "secondary" | "white";

interface LoaderProps {
  size?: LoaderSize;
  color?: LoaderColor;
  className?: string;
  label?: string;
}

const getSizeClasses = (size: LoaderSize): string => {
  switch (size) {
    case "sm":
      return "h-4 w-4";
    case "md":
      return "h-8 w-8";
    case "lg":
      return "h-12 w-12";
    default:
      return "h-8 w-8";
  }
};

const getColorClasses = (color: LoaderColor): string => {
  switch (color) {
    case "primary":
      return "text-blue-600";
    case "secondary":
      return "text-gray-600";
    case "white":
      return "text-white";
    default:
      return "text-blue-600";
  }
};

const Loader = memo(
  ({ size = "md", color = "primary", className = "", label }: LoaderProps) => {
    const sizeClasses = getSizeClasses(size);
    const colorClasses = getColorClasses(color);

    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <svg
          className={`animate-spin ${sizeClasses} ${colorClasses}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
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
        {label && (
          <span className={`mt-2 text-sm ${colorClasses}`}>{label}</span>
        )}
        {!label && <span className="sr-only">Loading...</span>}
      </div>
    );
  },
);

Loader.displayName = "Loader";

export { Loader };
