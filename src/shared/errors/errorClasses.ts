// Error Classification - Map API errors to UI states

import { ApiErrorCode } from '../../domain/types';

export type ErrorCategory = 'retryable' | 'validation' | 'conflict' | 'session' | 'offline' | 'unknown';

export interface ClassifiedError {
  category: ErrorCategory;
  code: ApiErrorCode | string;
  message: string;
  retryable: boolean;
  title: string;
}

const RETRYABLE_CODES: ApiErrorCode[] = ['TIMEOUT', 'SERVER_ERROR', 'INVALID_RESPONSE'];
const VALIDATION_CODES: ApiErrorCode[] = ['VALIDATION_ERROR', 'NOT_FOUND'];
const CONFLICT_CODES: ApiErrorCode[] = ['SLOT_CONFLICT', 'SLOT_EXPIRED'];
const SESSION_CODES: ApiErrorCode[] = ['SESSION_EXPIRED'];

export function classifyApiError(error: unknown): ClassifiedError {
  if (error instanceof Error && error.name === 'NetworkError') {
    return {
      category: 'offline',
      code: 'NETWORK_ERROR',
      message: error.message,
      retryable: true,
      title: 'No internet connection',
    };
  }

  if (error instanceof Error && error.name === 'TimeoutError') {
    return {
      category: 'retryable',
      code: 'TIMEOUT',
      message: error.message,
      retryable: true,
      title: 'Request timed out',
    };
  }

  const apiError = error as { code?: string; message?: string } | null;
  const code = apiError?.code ?? 'UNKNOWN';

  if (RETRYABLE_CODES.includes(code as ApiErrorCode)) {
    return {
      category: 'retryable',
      code,
      message: apiError?.message ?? 'A temporary error occurred. Please try again.',
      retryable: true,
      title: 'Something went wrong',
    };
  }

  if (VALIDATION_CODES.includes(code as ApiErrorCode)) {
    return {
      category: 'validation',
      code,
      message: apiError?.message ?? 'Invalid request. Please check your input.',
      retryable: false,
      title: 'Invalid request',
    };
  }

  if (CONFLICT_CODES.includes(code as ApiErrorCode)) {
    return {
      category: 'conflict',
      code,
      message: apiError?.message ?? 'This resource has changed. Please refresh and try again.',
      retryable: false,
      title: 'Conflict detected',
    };
  }

  if (SESSION_CODES.includes(code as ApiErrorCode)) {
    return {
      category: 'session',
      code,
      message: apiError?.message ?? 'Your session has expired. Please log in again.',
      retryable: false,
      title: 'Session expired',
    };
  }

  return {
    category: 'unknown',
    code,
    message: apiError?.message ?? 'An unexpected error occurred.',
    retryable: false,
    title: 'Unexpected error',
  };
}
