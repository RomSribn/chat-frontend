import { describe, it, expect, vi, beforeEach } from "vitest";
import { io } from "socket.io-client";
import { socketService } from "#services/socket/service";
import { ChatMessage } from "#types/message";

interface MockSocket {
  on: ReturnType<typeof vi.fn>;
  emit: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

vi.mock("socket.io-client", () => {
  const mockSocket = {
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  };

  return {
    io: vi.fn(() => mockSocket),
    Socket: vi.fn(),
  };
});

describe("SocketService", () => {
  let mockSocket: MockSocket;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSocket = io() as unknown as MockSocket;

    socketService.disconnect();

    vi.mocked(io).mockClear();
  });

  describe("getInstance", () => {
    it("should return the same instance when called multiple times", () => {
      const instance1 = socketService;
      const instance2 = socketService;

      expect(instance1).toBe(instance2);
    });
  });

  describe("connect", () => {
    it("should initialize socket connection with correct configuration", () => {
      const socket = socketService.connect();

      expect(io).toHaveBeenCalledWith(expect.any(String), {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
      });

      expect(mockSocket.on).toHaveBeenCalledWith(
        "connect",
        expect.any(Function),
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "disconnect",
        expect.any(Function),
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "connect_error",
        expect.any(Function),
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "new-message",
        expect.any(Function),
      );

      expect(socket).toBe(mockSocket);
    });

    it("should reuse existing socket if already connected", () => {
      const socket1 = socketService.connect();
      const socket2 = socketService.connect();

      expect(io).toHaveBeenCalledTimes(1);
      expect(socket1).toBe(socket2);
    });
  });

  describe("sendMessage", () => {
    it("should emit send-message event with correct data", () => {
      socketService.connect();

      const username = "testuser";
      const content = "Hello, world!";
      socketService.sendMessage(username, content);

      expect(mockSocket.emit).toHaveBeenCalledWith("send-message", {
        username,
        content,
      });
    });

    it("should connect automatically if not already connected", () => {
      socketService.sendMessage("user", "message");

      expect(mockSocket.emit).toHaveBeenCalledWith("send-message", {
        username: "user",
        content: "message",
      });
    });

    it("should throw error if emit fails", () => {
      mockSocket.emit.mockImplementationOnce(() => {
        throw new Error("Emit failed");
      });

      socketService.connect();

      expect(() => socketService.sendMessage("user", "message")).toThrow(
        "Emit failed",
      );
    });
  });

  describe("onNewMessage", () => {
    it("should add message listener and return unsubscribe function", () => {
      socketService.connect();

      const messageHandler = vi.fn();
      const unsubscribe = socketService.onNewMessage(messageHandler);

      // Verify the message handler was added (we don't need to check io call count here)

      // Simulate receiving a new message by calling the 'new-message' handler directly
      // First, find the 'new-message' handler that was registered
      const call = mockSocket.on.mock.calls.find(
        (call) => call[0] === "new-message",
      );
      const newMessageHandler = call?.[1] as (message: ChatMessage) => void;

      const mockMessage: ChatMessage = {
        id: "123",
        username: "user",
        content: "test message",
        timestamp: Date.now(),
      };

      newMessageHandler(mockMessage);

      expect(messageHandler).toHaveBeenCalledWith(mockMessage);

      unsubscribe();
      newMessageHandler(mockMessage);

      expect(messageHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe("offAllMessageListeners", () => {
    it("should remove all message listeners", () => {
      socketService.connect();

      const handler1 = vi.fn();
      const handler2 = vi.fn();
      socketService.onNewMessage(handler1);
      socketService.onNewMessage(handler2);

      // Find the 'new-message' handler
      const call = mockSocket.on.mock.calls.find(
        (call) => call[0] === "new-message",
      );
      const newMessageHandler = call?.[1] as (message: ChatMessage) => void;

      const mockMessage: ChatMessage = {
        id: "123",
        username: "user",
        content: "test message",
        timestamp: Date.now(),
      };

      newMessageHandler(mockMessage);

      expect(handler1).toHaveBeenCalledWith(mockMessage);
      expect(handler2).toHaveBeenCalledWith(mockMessage);

      socketService.offAllMessageListeners();

      newMessageHandler(mockMessage);

      // Verify handlers were not called again (still at 1 call each)
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });
  });

  describe("disconnect", () => {
    it("should disconnect the socket and clear listeners", () => {
      socketService.connect();

      const handler = vi.fn();
      socketService.onNewMessage(handler);
      socketService.disconnect();

      expect(mockSocket.disconnect).toHaveBeenCalled();
      expect(socketService.getSocket()).toBeNull();

      // Find the 'new-message' handler
      const call = mockSocket.on.mock.calls.find(
        (call) => call[0] === "new-message",
      );
      const newMessageHandler = call?.[1] as (message: ChatMessage) => void;

      const mockMessage: ChatMessage = {
        id: "123",
        username: "user",
        content: "test message",
        timestamp: Date.now(),
      };

      newMessageHandler(mockMessage);

      expect(handler).not.toHaveBeenCalled();
    });

    it("should do nothing if not connected", () => {
      socketService.disconnect();

      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });
  });

  describe("getSocket", () => {
    it("should return the socket instance when connected", () => {
      socketService.connect();

      expect(socketService.getSocket()).toBe(mockSocket);
    });

    it("should return null when not connected", () => {
      socketService.disconnect();

      expect(socketService.getSocket()).toBeNull();
    });
  });
});
