import { apiService } from "./service";

export const fetchMessages = async (offset?: number, limit?: number) => {
  return apiService.fetchMessages(offset, limit);
};

export default apiService;
export * from "./types";
export * from "./endpoints";
