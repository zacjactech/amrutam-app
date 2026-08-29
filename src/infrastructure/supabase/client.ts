import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { env } from '../env';
import { Database } from './database.types';

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

export const supabase = createClient<Database>(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: ExpoSecureStoreAdapter,
    },
  },
);
