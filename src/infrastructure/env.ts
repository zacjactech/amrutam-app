// Environment Configuration Validation

import { z } from 'zod';
import { logger } from './logging/logger';

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
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

      // APP_ENV defaults to development; only fail hard for missing Supabase credentials
      const hasSupabaseUrl = !!process.env.EXPO_PUBLIC_SUPABASE_URL;
      const hasSupabaseKey = !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (!hasSupabaseUrl && !hasSupabaseKey) {
        // No Supabase configured — warn loudly
        logger.warn('Missing environment variables (using dev defaults)', { missingFields });
        cachedEnv = {
          APP_ENV: 'development',
          EXPO_PUBLIC_SUPABASE_URL: '',
          EXPO_PUBLIC_SUPABASE_ANON_KEY: '',
        };
        return cachedEnv;
      }

      throw new Error(`Invalid environment configuration:\n${missingFields}`);
    }
    throw error;
  }
}

export const env: Env = parseEnv();
