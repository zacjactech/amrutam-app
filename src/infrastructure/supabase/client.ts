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

// createClient throws if url is empty — guard against missing env vars
// The real fix is eas.json "environment": "staging" so .env.staging is read at build time
const url = env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const key = env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient<Database>(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: ExpoSecureStoreAdapter,
  },
});
