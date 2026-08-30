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

  const hasSupabaseUrl = !!process.env.EXPO_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasSupabaseUrl || !hasSupabaseKey) {
    logger.warn('Missing Supabase environment variables (using defaults)', {
      missingFields: [
        !hasSupabaseUrl ? 'EXPO_PUBLIC_SUPABASE_URL' : null,
        !hasSupabaseKey ? 'EXPO_PUBLIC_SUPABASE_ANON_KEY' : null,
      ].filter(Boolean).join(', '),
    });
    cachedEnv = {
      APP_ENV: 'development',
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    };
    return cachedEnv;
  }

  try {
    cachedEnv = envSchema.parse(process.env);
    return cachedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingFields = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n');
      throw new Error(`Invalid environment configuration:\n${missingFields}`);
    }
    throw error;
  }
}

export const env: Env = parseEnv();
