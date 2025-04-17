import { Environment } from "./environment";

/**
 * Configuration file for production
 * Uses placeholders that will be replaced during the build
 * This file is used for production and should not be used in local development
 */

export const environment: Environment = {
  VITE_API_BASE_URL: "REPLACEME_VITE_API_BASE_URL",
  VITE_SOCKET_BASE_URL: "REPLACEME_VITE_SOCKET_BASE_URL",
  VITE_ERROR_TRACKING_ENABLED: true,
  VITE_ERROR_TRACKING_URL: "REPLACEME_VITE_ERROR_TRACKING_URL",
};
