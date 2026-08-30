import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { env } from '../env';
import { Database } from './database.types';
import { logger } from '../logging/logger';

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

const hasValidCredentials =
  env.EXPO_PUBLIC_SUPABASE_URL.length > 0 &&
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY.length > 0;

if (!hasValidCredentials) {
  logger.warn('Supabase: no valid credentials — features will be unavailable');
}

export const supabase = createClient<Database>(
  env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: ExpoSecureStoreAdapter,
    },
  },
);
