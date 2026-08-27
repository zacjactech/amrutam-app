// Secure Storage Wrapper

import * as SecureStore from 'expo-secure-store';
import { logger } from '../../infrastructure/logging/logger';

export interface SecureStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export const secureStorage: SecureStorage = {
  async get(key: string): Promise<string | null> {
    try {
      const value = await SecureStore.getItemAsync(key);
      logger.debug('SecureStorage: get', { key, found: value !== null });
      return value;
    } catch (error) {
      logger.error('SecureStorage: get failed', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
      logger.debug('SecureStorage: set', { key });
    } catch (error) {
      logger.error('SecureStorage: set failed', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
      logger.debug('SecureStorage: remove', { key });
    } catch (error) {
      logger.error('SecureStorage: remove failed', {
        key,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  },
};
