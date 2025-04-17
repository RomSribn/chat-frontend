export interface StorageServiceInterface {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

export enum StorageKeys {
  USERNAME = "chat_username",
}
