import { Environment } from "./environment";

/**
 * Configuration file for local development
 * Uses import.meta.env values that will be substituted by Vite
 * This file is used for local development and should not be used in production
 */

export const environment: Environment = {
  VITE_API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
  VITE_SOCKET_BASE_URL:
    import.meta.env.VITE_SOCKET_BASE_URL || "http://localhost:4000",
  VITE_ERROR_TRACKING_ENABLED:
    import.meta.env.VITE_ERROR_TRACKING_ENABLED === "true",
  VITE_ERROR_TRACKING_URL:
    import.meta.env.VITE_ERROR_TRACKING_URL || "http://localhost:4000/errors",
};
