import { AxiosRequestConfig } from "axios";
import { ChatMessage } from "#types/message";

export interface ApiServiceInterface {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T, D = Record<string, unknown>>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  fetchMessages(): Promise<ChatMessage[]>;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}
