import { apiService } from "./service";

export const fetchMessages = async () => {
  return apiService.fetchMessages();
};

export default apiService;
export * from "./types";
export * from "./endpoints";
