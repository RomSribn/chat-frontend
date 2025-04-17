import { environment as localEnv } from "./environment.local";
import { environment as prodEnv } from "./environment.prod";

/**
 * Environment configuration file
 */

export interface Environment {
  VITE_API_BASE_URL: string;
  VITE_SOCKET_BASE_URL: string;
  VITE_ERROR_TRACKING_ENABLED?: boolean;
  VITE_ERROR_TRACKING_URL?: string;
}

export const environment: Environment =
  import.meta.env.MODE === "development" ? localEnv : prodEnv;
