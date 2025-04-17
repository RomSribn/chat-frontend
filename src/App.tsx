import { RouterProvider } from "react-router";
import { useEffect } from "react";
import router from "#router/index";
import { MessageProvider } from "#context/message-context";
import { AuthProvider } from "#context/auth-context";
import errorTrackingService, { LogLevel } from "#services/error-tracking";
import storageService from "#services/storage";
import socketService from "#services/socket";

function App() {
  // Services initialization
  useEffect(() => {
    errorTrackingService.init();

    try {
      const socket = socketService.connect();
      console.log("Socket initialized:", socket.id);

      // Logging the events of the coke for debugging
      socket.on("connect", () => {
        console.log("Socket connected successfully");
        errorTrackingService.log(
          LogLevel.INFO,
          "Socket connected successfully",
        );
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        errorTrackingService.log(LogLevel.ERROR, "Socket connection error", {
          error: String(error),
        });
      });
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      errorTrackingService.log(LogLevel.ERROR, "Failed to initialize socket", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    const savedUsername = storageService.getUsername();
    if (savedUsername) {
      errorTrackingService.setUser(savedUsername);
    }

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <AuthProvider>
      <MessageProvider>
        <RouterProvider router={router} />
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
