// Sync Worker - Process pending sync operations

import { logger } from '../logging/logger';
import { getDatabase } from '../database/database';

type SyncOperationType = 'booking' | 'cart_update' | 'wishlist_update';

type SyncOperationStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'conflict';

type SyncOperation = {
  id: string;
  type: SyncOperationType;
  payload: string;
  status: SyncOperationStatus;
  attemptCount: number;
  nextAttemptAt: string | null;
  idempotencyKey: string;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

type SyncResult = {
  success: boolean;
  operationId: string;
  error?: string;
  conflict?: boolean;
};

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

function calculateBackoff(attemptCount: number): number {
  const delay = BASE_DELAY_MS * Math.pow(2, attemptCount);
  const jitter = Math.random() * 500;
  return Math.min(delay + jitter, 30000);
}

function generateIdempotencyKey(type: SyncOperationType, patientId: string, resourceId: string): string {
  return `${type}:${patientId}:${resourceId}`;
}

async function enqueueOperation(
  type: SyncOperationType,
  payload: unknown,
  idempotencyKey: string,
): Promise<string> {
  const db = await getDatabase();
  const id = `sync_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT OR IGNORE INTO sync_operations (id, type, payload, status, attempt_count, next_attempt_at, idempotency_key, last_error, created_at, updated_at)
     VALUES (?, ?, ?, 'pending', 0, ?, ?, NULL, ?, ?)`,
    [id, type, JSON.stringify(payload), now, idempotencyKey, now, now],
  );

  logger.debug('Sync operation enqueued', { id, type, idempotencyKey });
  return id;
}

async function fetchNextPendingOperation(): Promise<SyncOperation | null> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const result = await db.getFirstAsync<SyncOperation>(
    `SELECT * FROM sync_operations
     WHERE status = 'pending' AND next_attempt_at <= ?
     ORDER BY created_at ASC
     LIMIT 1`,
    [now],
  );

  return result ?? null;
}

async function markOperationProcessing(operationId: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE sync_operations SET status = 'processing', updated_at = ? WHERE id = ?`,
    [now, operationId],
  );
}

async function markOperationSucceeded(operationId: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE sync_operations SET status = 'succeeded', updated_at = ? WHERE id = ?`,
    [now, operationId],
  );

  logger.debug('Sync operation succeeded', { operationId });
}

async function markOperationFailed(operationId: string, error: string, shouldRetry: boolean): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const operation = await db.getFirstAsync<SyncOperation>(
    'SELECT * FROM sync_operations WHERE id = ?',
    [operationId],
  );

  if (!operation) {
    return;
  }

  const newAttemptCount = operation.attemptCount + 1;
  const status: SyncOperationStatus = shouldRetry ? 'pending' : 'failed';
  const nextAttemptAt = shouldRetry
    ? new Date(Date.now() + calculateBackoff(newAttemptCount)).toISOString()
    : null;

  await db.runAsync(
    `UPDATE sync_operations
     SET status = ?, attempt_count = ?, next_attempt_at = ?, last_error = ?, updated_at = ?
     WHERE id = ?`,
    [status, newAttemptCount, nextAttemptAt, error, now, operationId],
  );

  logger.warn('Sync operation failed', { operationId, error, attemptCount: newAttemptCount });
}

async function markOperationConflict(operationId: string, error: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE sync_operations SET status = 'conflict', last_error = ?, updated_at = ? WHERE id = ?`,
    [error, now, operationId],
  );

  logger.warn('Sync operation conflict', { operationId, error });
}

async function processOperation(operation: SyncOperation): Promise<SyncResult> {
  logger.info('Processing sync operation', { operationId: operation.id, type: operation.type });

  try {
    const payload = JSON.parse(operation.payload);

    switch (operation.type) {
      case 'booking':
        return await processBookingSync(payload);
      case 'cart_update':
        return await processCartSync(payload);
      case 'wishlist_update':
        return await processWishlistSync(payload);
      default:
        return { success: false, operationId: operation.id, error: `Unknown operation type: ${operation.type}` };
    }
  } catch (error) {
    return {
      success: false,
      operationId: operation.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function processBookingSync(_payload: unknown): Promise<SyncResult> {
  // Placeholder: integrate with actual API client when available
  return { success: true, operationId: '' };
}

async function processCartSync(_payload: unknown): Promise<SyncResult> {
  // Placeholder: integrate with actual API client when available
  return { success: true, operationId: '' };
}

async function processWishlistSync(_payload: unknown): Promise<SyncResult> {
  // Placeholder: integrate with actual API client when available
  return { success: true, operationId: '' };
}

export async function enqueueBookingSync(
  bookingData: { doctorId: string; slotId: string; patientId: string },
): Promise<string> {
  const idempotencyKey = generateIdempotencyKey('booking', bookingData.patientId, bookingData.slotId);
  return enqueueOperation('booking', bookingData, idempotencyKey);
}

export async function enqueueCartSync(cartData: unknown): Promise<string> {
  const idempotencyKey = generateIdempotencyKey('cart_update', 'patient_001', 'cart');
  return enqueueOperation('cart_update', cartData, idempotencyKey);
}

export async function enqueueWishlistSync(wishlistData: unknown): Promise<string> {
  const idempotencyKey = generateIdempotencyKey('wishlist_update', 'patient_001', 'wishlist');
  return enqueueOperation('wishlist_update', wishlistData, idempotencyKey);
}

export async function processSyncQueue(): Promise<{ processed: number; succeeded: number; failed: number; conflicts: number }> {
  const result = { processed: 0, succeeded: 0, failed: 0, conflicts: 0 };

  logger.info('Starting sync queue processing');

  while (true) {
    const operation = await fetchNextPendingOperation();

    if (!operation) {
      break;
    }

    result.processed++;

    await markOperationProcessing(operation.id);
    const syncResult = await processOperation(operation);

    if (syncResult.success) {
      await markOperationSucceeded(operation.id);
      result.succeeded++;
    } else if (syncResult.conflict) {
      await markOperationConflict(operation.id, syncResult.error ?? 'Conflict');
      result.conflicts++;
    } else if (operation.attemptCount + 1 >= MAX_RETRIES) {
      await markOperationFailed(operation.id, syncResult.error ?? 'Max retries exceeded', false);
      result.failed++;
    } else {
      await markOperationFailed(operation.id, syncResult.error ?? 'Unknown error', true);
      result.failed++;
    }
  }

  logger.info('Sync queue processing completed', result);
  return result;
}

export async function getPendingSyncCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM sync_operations WHERE status IN ('pending', 'processing')`,
  );

  return result?.count ?? 0;
}

export async function getFailedSyncOperations(): Promise<SyncOperation[]> {
  const db = await getDatabase();
  return db.getAllAsync<SyncOperation>(
    `SELECT * FROM sync_operations WHERE status IN ('failed', 'conflict') ORDER BY updated_at DESC`,
  );
}

export async function retryFailedOperation(operationId: string): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE sync_operations SET status = 'pending', attempt_count = 0, next_attempt_at = ?, last_error = NULL, updated_at = ? WHERE id = ?`,
    [now, now, operationId],
  );

  logger.info('Retrying failed operation', { operationId });
}

export async function clearCompletedSyncOperations(olderThanDays: number = 7): Promise<void> {
  const db = await getDatabase();
  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();

  await db.runAsync(
    `DELETE FROM sync_operations WHERE status = 'succeeded' AND updated_at < ?`,
    [cutoff],
  );

  logger.debug('Cleared completed sync operations', { olderThanDays });
}
