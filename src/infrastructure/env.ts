// Environment Configuration Validation

import { z } from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

function parseEnv(): Env {
  if (cachedEnv) return cachedEnv;

  try {
    cachedEnv = envSchema.parse(process.env);
    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingFields = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n');

      // In development, check for specifically Supabase credentials
      const isDev = process.env.APP_ENV === 'development' || !process.env.APP_ENV;
      const hasSupabaseUrl = !!process.env.EXPO_PUBLIC_SUPABASE_URL;
      const hasSupabaseKey = !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (isDev && !hasSupabaseUrl && !hasSupabaseKey) {
        // No Supabase configured at all — use empty defaults but warn loudly
        console.warn(`[env] Missing environment variables (using dev defaults):\n${missingFields}`);
        console.warn(`[env] Supabase features will not work without valid credentials.`);
        cachedEnv = {
          APP_ENV: (process.env.APP_ENV as Env['APP_ENV']) ?? 'development',
          EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
          EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
        };
        return cachedEnv;
      }

      throw new Error(`Invalid environment configuration:\n${missingFields}`);
    }
    throw error;
  }
}

export const env: Env = parseEnv();
