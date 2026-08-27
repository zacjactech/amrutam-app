// Offline Sync Queue Tests

import { classifyApiError } from '@/shared/errors/errorClasses';
import { enableFailure, disableFailure, shouldFail, createFailureError, isFailureEnabled } from '@/infrastructure/testing/failureInjector';

describe('Failure Injection', () => {
  it('returns null when no failure is enabled', () => {
    disableFailure();
    expect(shouldFail({ endpoint: '/test', method: 'GET' })).toBeNull();
    expect(isFailureEnabled()).toBe(false);
  });

  it('enables and returns failure type', () => {
    enableFailure({ type: 'timeout' });
    expect(shouldFail({ endpoint: '/test', method: 'GET' })).toBe('timeout');
    expect(isFailureEnabled()).toBe(true);
  });

  it('creates correct error for each failure type', () => {
    enableFailure({ type: 'timeout' });
    const error = createFailureError('timeout');
    expect(error.message).toBe('Request timed out');

    enableFailure({ type: 'server' });
    const serverError = createFailureError('server');
    expect(serverError.message).toBe('SERVER_ERROR: Internal server error');

    enableFailure({ type: 'session-expired' });
    const sessionError = createFailureError('session-expired');
    expect(sessionError.message).toBe('SESSION_EXPIRED: Session expired');
  });

  it('disables failure after disableFailure is called', () => {
    enableFailure({ type: 'server' });
    disableFailure();
    expect(shouldFail({ endpoint: '/test', method: 'GET' })).toBeNull();
    expect(isFailureEnabled()).toBe(false);
  });
});

describe('Error Classification', () => {
  it('classifies network errors as offline', () => {
    const error = new Error('No internet');
    error.name = 'NetworkError';
    const result = classifyApiError(error);
    expect(result.category).toBe('offline');
    expect(result.retryable).toBe(true);
    expect(result.title).toBe('No internet connection');
  });

  it('classifies timeout errors as retryable', () => {
    const error = new Error('Request timed out');
    error.name = 'TimeoutError';
    const result = classifyApiError(error);
    expect(result.category).toBe('retryable');
    expect(result.retryable).toBe(true);
    expect(result.title).toBe('Request timed out');
  });

  it('classifies API errors by code', () => {
    const retryable = classifyApiError({ code: 'TIMEOUT', message: 'Timed out' });
    expect(retryable.category).toBe('retryable');
    expect(retryable.retryable).toBe(true);

    const conflict = classifyApiError({ code: 'SLOT_CONFLICT', message: 'Slot taken' });
    expect(conflict.category).toBe('conflict');
    expect(conflict.retryable).toBe(false);

    const session = classifyApiError({ code: 'SESSION_EXPIRED', message: 'Login again' });
    expect(session.category).toBe('session');
    expect(session.retryable).toBe(false);

    const validation = classifyApiError({ code: 'VALIDATION_ERROR', message: 'Bad input' });
    expect(validation.category).toBe('validation');
    expect(validation.retryable).toBe(false);
  });

  it('classifies unknown errors as unknown', () => {
    const result = classifyApiError({ code: 'UNKNOWN_CODE', message: 'Something weird' });
    expect(result.category).toBe('unknown');
    expect(result.retryable).toBe(false);
  });
});
