import { memo } from "react";
import { UsernameForm } from "#components/index";

const LoginPage = memo(() => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Welcome to the chat
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Please enter your username to start chatting
      </p>
      <UsernameForm />
      <div className="mt-4 text-xs text-gray-500 text-center">
        Your name will be visible to other chat participants.
      </div>
    </div>
  );
});

LoginPage.displayName = "LoginPage";

export default LoginPage;
