import { describe, it, expect } from 'vitest';
import { storageService } from '#services/storage/service';

describe.skip('StorageService', () => {
  describe('getInstance', () => {
    it('should return the same localStorage instance when called multiple times', () => {
      const instance1 = storageService;
      const instance2 = storageService;
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      const testValue = { name: 'Test', id: 123 };
      storageService.set('test-key', testValue);
      const result = storageService.get('test-key');
      
      // Verify the result matches the original value
      expect(result).toEqual(testValue);
    });
  });

  describe('remove', () => {
    it('should remove a value', () => {
      storageService.set('test-key', 'test-value');
      storageService.remove('test-key');
      
      const result = storageService.get('test-key');
      
      expect(result).toBeNull();
    });
  });

  describe('username methods', () => {
    it('should store and retrieve username', () => {
      const username = 'testuser';
      storageService.setUsername(username);
      const result = storageService.getUsername();
      
      expect(result).toBe(username);
    });
  });
});
