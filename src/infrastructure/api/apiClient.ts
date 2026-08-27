// API Client with validation and error handling

import { z } from 'zod';
import { logger } from '../logging/logger';
import { apiErrorResponseSchema } from '../../domain/schemas';

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly requestId: string | undefined;

  constructor(code: string, message: string, status: number, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  body?: unknown;
  timeoutMs?: number;
  baseUrl?: string;
}

const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_BASE_URL = 'http://localhost:3000';

export async function apiRequest<T extends z.ZodType>(
  config: RequestConfig,
  responseSchema: T,
): Promise<z.infer<T>> {
  const {
    method,
    endpoint,
    body,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    baseUrl = DEFAULT_BASE_URL,
  } = config;
  const url = `${baseUrl}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  logger.debug('API Request', { method, endpoint });

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    const data = await response.json();
    const validated = responseSchema.parse(data);

    logger.debug('API Response', { method, endpoint, status: response.status });
    return validated;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof z.ZodError) {
      logger.error('Response validation failed', { endpoint, errors: error.errors });
      throw new ApiError('INVALID_RESPONSE', 'Invalid response format', 0);
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        logger.error('Request timeout', { endpoint, timeoutMs });
        throw new TimeoutError(`Request timed out after ${timeoutMs}ms`);
      }
      logger.error('Network error', { endpoint, error: error.message });
      throw new NetworkError(error.message);
    }

    throw new NetworkError('Unknown network error');
  }
}

async function handleErrorResponse(response: Response): Promise<void> {
  const requestId = response.headers.get('x-request-id') ?? undefined;

  try {
    const errorData = await response.json();
    const parsed = apiErrorResponseSchema.safeParse(errorData);

    if (parsed.success) {
      throw new ApiError(
        parsed.data.error.code,
        parsed.data.error.message,
        response.status,
        requestId,
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // If parsing fails, throw generic error
  }

  throw new ApiError(
    'SERVER_ERROR',
    `HTTP ${response.status}: ${response.statusText}`,
    response.status,
    requestId,
  );
}
