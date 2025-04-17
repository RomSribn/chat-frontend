import { memo } from "react";
import { useUsernameForm, getErrorMessage } from "./hooks";
import { Button, Input } from "#components/ui";
import { Alert } from "#components/ui";

const UsernameForm = memo(() => {
  const { input, error, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useUsernameForm();

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          User name
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Enter the user's name"
          value={input}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error ? getErrorMessage(error) : undefined}
          disabled={isSubmitting}
          aria-invalid={!!error}
          aria-describedby={error ? "username-error" : undefined}
          fullWidth
        />
        {error && (
          <Alert
            variant="error"
            message={getErrorMessage(error)}
            className="mt-2"
          />
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={isSubmitting || !!error}
        isLoading={isSubmitting}
      >
        Enter the chat
      </Button>
    </form>
  );
});

UsernameForm.displayName = "UsernameForm";

export { UsernameForm };
