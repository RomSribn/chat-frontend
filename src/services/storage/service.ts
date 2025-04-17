import { StorageServiceInterface, StorageKeys } from "./types";

/**
 * Service for interacting with browser storage (localStorage/sessionStorage).
 *
 * Provides typed get/set methods with error handling.
 * Implements Singleton pattern separately for localStorage and sessionStorage.
 */
class StorageService implements StorageServiceInterface {
  private static localStorageInstance: StorageService | null = null;
  private static sessionStorageInstance: StorageService | null = null;
  private readonly storage: Storage;

  private constructor(useSessionStorage: boolean) {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
  }

  /**
   * Returns the singleton instance of the service.
   * @param useSessionStorage If true, uses sessionStorage; otherwise localStorage.
   */
  public static getInstance(useSessionStorage = false): StorageService {
    if (useSessionStorage) {
      if (!StorageService.sessionStorageInstance) {
        StorageService.sessionStorageInstance = new StorageService(true);
      }
      return StorageService.sessionStorageInstance;
    } else {
      if (!StorageService.localStorageInstance) {
        StorageService.localStorageInstance = new StorageService(false);
      }
      return StorageService.localStorageInstance;
    }
  }

  /**
   * Retrieves a value from storage by key.
   * @param key Storage key
   * @returns Parsed value or null if not found or failed to parse
   */
  public get<T>(key: string): T | null {
    const item = this.storage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing item with key "${key}":`, error);
      return null;
    }
  }

  /**
   * Stores a value under the specified key.
   * @param key Storage key
   * @param value Value to store
   */
  public set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item with key "${key}":`, error);
    }
  }

  /**
   * Removes a value from storage by key.
   * @param key Storage key
   */
  public remove(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * Clears all values from the storage.
   */
  public clear(): void {
    this.storage.clear();
  }

  /**
   * Retrieves the stored username, if any.
   * @returns Username or null
   */
  public getUsername(): string | null {
    return this.get<string>(StorageKeys.USERNAME);
  }

  /**
   * Stores the username.
   * @param username Username to store
   */
  public setUsername(username: string): void {
    this.set(StorageKeys.USERNAME, username);
  }
}

// Export default localStorage instance
export const storageService = StorageService.getInstance();
