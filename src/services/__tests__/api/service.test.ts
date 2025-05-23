import { describe, it, expect, vi, beforeEach, Mocked } from "vitest";
import axios, { AxiosInstance } from "axios";

import { apiService } from "#services/api/service";
import { API_ENDPOINTS } from "#services/api/endpoints";
import { ChatMessage } from "#types/message";

interface MockAxiosError extends Error {
  response?: {
    status: number;
    data: { message: string };
  };
  request?: object;
}

vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
    AxiosError: Error,
  };
});

describe("ApiService", () => {
  let mockAxiosInstance: Mocked<AxiosInstance>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAxiosInstance = axios.create() as Mocked<AxiosInstance>;
    mockAxiosInstance.get.mockReset();
    mockAxiosInstance.post.mockReset();
  });

  describe("getInstance", () => {
    it("should return the same instance when called multiple times", () => {
      const instance1 = apiService;
      const instance2 = apiService;

      expect(instance1).toBe(instance2);
    });
  });

  describe("get", () => {
    it("should make a GET request and return data", async () => {
      const mockData = { id: "1", name: "Test" };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      const result = await apiService.get("/test");

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/test", undefined);
      expect(result).toEqual(mockData);
    });

    it("should handle errors in GET requests", async () => {
      const mockError: MockAxiosError = new Error("Not found");
      mockError.response = {
        status: 404,
        data: { message: "Not found" },
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(apiService.get("/test")).rejects.toEqual({
        message: "Server error: 404",
        code: "ERR_404",
      });
    });

    it("should handle network errors in GET requests", async () => {
      const mockError: MockAxiosError = new Error("Network Error");
      mockError.request = {};
      mockError.response = undefined;
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(apiService.get("/test")).rejects.toEqual({
        message: "No response from server",
        code: "ERR_NO_RESPONSE",
      });
    });

    it("should handle other errors in GET requests", async () => {
      const mockError: MockAxiosError = new Error("Something went wrong");
      mockError.response = undefined;
      mockError.request = undefined;
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(apiService.get("/test")).rejects.toEqual({
        message: "Request error: Something went wrong",
        code: "ERR_REQUEST",
      });
    });
  });

  describe("post", () => {
    it("should make a POST request with data and return response data", async () => {
      const requestData = { name: "Test" };
      const mockResponseData = { id: "1", name: "Test" };
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponseData });

      const result = await apiService.post("/test", requestData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/test",
        requestData,
        undefined,
      );
      expect(result).toEqual(mockResponseData);
    });

    it("should handle errors in POST requests", async () => {
      const mockError: MockAxiosError = new Error("Bad request");
      mockError.response = {
        status: 400,
        data: { message: "Bad request" },
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(apiService.post("/test", {})).rejects.toEqual({
        message: "Server error: 400",
        code: "ERR_400",
      });
    });
  });

  describe("fetchMessages", () => {
    it("should call get with the correct endpoint and return messages", async () => {
      const mockMessages: ChatMessage[] = [
        {
          id: "1",
          username: "user1",
          content: "Hello",
          timestamp: 1650000000000,
        },
        {
          id: "2",
          username: "user2",
          content: "Hi there",
          timestamp: 1650000060000,
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: { messages: mockMessages },
      });

      const { messages } = await apiService.fetchMessages();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        API_ENDPOINTS.MESSAGES,
        {
          params: {
            offset: 0,
            limit: 6,
          },
        },
      );

      expect(messages).toEqual(mockMessages);
      expect(messages.length).toBe(2);
      expect(messages[0].id).toBe("1");
      expect(messages[1].username).toBe("user2");
    });
  });
});
