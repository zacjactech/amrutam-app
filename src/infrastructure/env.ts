// Environment Configuration Validation

import { z } from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  API_BASE_URL: z.string().url(),
  API_TIMEOUT_MS: z.coerce.number().int().positive().max(30000),
  ENABLE_MOCK_FAILURES: z.coerce.boolean(),
  ENABLE_PERFORMANCE_LOGGING: z.coerce.boolean(),
  MOCK_DATASET_SIZE: z.enum(['small', 'full']),
  ENCRYPTION_KEY: z.string().min(16),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  try {
    return envSchema.parse(process.env);
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

export const isDevelopment = env.APP_ENV === 'development';
export const isStaging = env.APP_ENV === 'staging';
export const isProduction = env.APP_ENV === 'production';
