import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ChatMessage, MessageError } from "#types/message";
import { environment } from "#environments/environment";
import { ApiServiceInterface } from "./types";
import { API_ENDPOINTS } from "./endpoints";

/**
 * Service class for working with API
 */
class ApiService implements ApiServiceInterface {
  private static instance: ApiService;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: environment.VITE_API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Get the singleton instance of ApiService
   */
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        // You can add authorization tokens here if needed
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      },
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleApiError(error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: AxiosError): void {
    if (error.response) {
      // Server responded with a status code
      console.error(
        `API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error("API Error: No response received", error.request);
    } else {
      // Something happened while setting up the request
      console.error("API Error:", error.message);
    }
  }

  /**
   * Generic method for making GET requests
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.formatError(error as AxiosError);
    }
  }

  /**
   * Generic method for making POST requests
   */
  public async post<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post<T>(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      throw this.formatError(error as AxiosError);
    }
  }

  /**
   * Format an error into a structured object
   */
  private formatError(error: AxiosError): MessageError {
    if (error.response) {
      return {
        message: `Server error: ${error.response.status}`,
        code: `ERR_${error.response.status}`,
      };
    } else if (error.request) {
      return {
        message: "No response from server",
        code: "ERR_NO_RESPONSE",
      };
    } else {
      return {
        message: `Request error: ${error.message}`,
        code: "ERR_REQUEST",
      };
    }
  }

  /**
   * Fetch the list of messages with pagination
   */
  public async fetchMessages(offset = 0, limit = 6): Promise<{messages: ChatMessage[]; total: number}> {
    return this.get<{messages: ChatMessage[]; total: number}>(
      API_ENDPOINTS.MESSAGES,
      { params: { offset, limit } }
    );
  }
}

export const apiService = ApiService.getInstance();
