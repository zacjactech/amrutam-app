// Environment Configuration Validation

import { z } from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  API_TIMEOUT_MS: z.coerce.number().int().positive().max(30000),
  ENABLE_MOCK_FAILURES: z.coerce.boolean(),
  ENABLE_PERFORMANCE_LOGGING: z.coerce.boolean(),
  MOCK_DATASET_SIZE: z.enum(['small', 'full']),
  ENCRYPTION_KEY: z.string().min(16),
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

      const isDev = process.env.APP_ENV === 'development' || !process.env.APP_ENV;
      if (isDev) {
        // In development, warn but provide fallback defaults so the app can still run
        console.warn(`[env] Missing environment variables (using dev defaults):\n${missingFields}`);
        cachedEnv = {
          APP_ENV: (process.env.APP_ENV as Env['APP_ENV']) ?? 'development',
          API_TIMEOUT_MS: Number(process.env.API_TIMEOUT_MS) || 10000,
          ENABLE_MOCK_FAILURES: process.env.ENABLE_MOCK_FAILURES !== 'false',
          ENABLE_PERFORMANCE_LOGGING: process.env.ENABLE_PERFORMANCE_LOGGING !== 'false',
          MOCK_DATASET_SIZE: (process.env.MOCK_DATASET_SIZE as Env['MOCK_DATASET_SIZE']) ?? 'small',
          ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? 'dev-only-key-change-in-production',
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

export const isDevelopment = env.APP_ENV === 'development';
export const isStaging = env.APP_ENV === 'staging';
export const isProduction = env.APP_ENV === 'production';
