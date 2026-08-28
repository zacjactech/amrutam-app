// Sync Worker - Process pending sync operations with real Supabase API calls

import { logger } from '../logging/logger';
import { getDatabase } from '../database/database';
import { supabase } from '../supabase/client';

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

// ─── Real Supabase Sync Processors ──────────────────────────────────────────

interface BookingPayload {
  doctorId: string;
  slotId: string;
  patientId: string;
  consultationType?: string;
  notes?: string;
}

async function processBookingSync(payload: BookingPayload): Promise<SyncResult> {
  const bookingId = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const idempotencyKey = generateIdempotencyKey('booking', payload.patientId, payload.slotId);

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      id: bookingId,
      doctor_id: payload.doctorId,
      patient_id: payload.patientId,
      slot_id: payload.slotId,
      consultation_type: payload.consultationType ?? 'video',
      status: 'pending_sync',
      idempotency_key: idempotencyKey,
      notes: payload.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    // Check for conflict (slot already booked)
    if (error.code === '23505' || error.message?.includes('unique')) {
      return { success: false, operationId: '', error: 'Slot already booked', conflict: true };
    }
    return { success: false, operationId: '', error: error.message };
  }

  // Also mark the slot as booked
  const { error: slotError } = await supabase
    .from('slots')
    .update({ is_booked: true })
    .eq('id', payload.slotId);

  if (slotError) {
    logger.warn('Failed to mark slot as booked', { slotId: payload.slotId, error: slotError.message });
  }

  logger.info('Booking synced to Supabase', { bookingId: data.id });
  return { success: true, operationId: data.id };
}

interface CartSyncPayload {
  patientId: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
}

async function processCartSync(payload: CartSyncPayload): Promise<SyncResult> {
  const { patientId, items } = payload;

  // Upsert all cart items to Supabase
  const upserts = items.map((item) => ({
    patient_id: patientId,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }));

  const { error } = await supabase
    .from('cart_items')
    .upsert(upserts, { onConflict: 'patient_id,product_id' });

  if (error) {
    return { success: false, operationId: '', error: error.message };
  }

  logger.info('Cart synced to Supabase', { patientId, itemCount: items.length });
  return { success: true, operationId: `cart_${patientId}` };
}

interface WishlistSyncPayload {
  patientId: string;
  items: Array<{ productId: string }>;
}

async function processWishlistSync(payload: WishlistSyncPayload): Promise<SyncResult> {
  const { patientId, items } = payload;

  // Delete existing wishlist items for this patient and re-insert
  const { error: deleteError } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('patient_id', patientId);

  if (deleteError) {
    return { success: false, operationId: '', error: deleteError.message };
  }

  if (items.length > 0) {
    const inserts = items.map((item) => ({
      patient_id: patientId,
      product_id: item.productId,
    }));

    const { error: insertError } = await supabase
      .from('wishlist_items')
      .insert(inserts);

    if (insertError) {
      return { success: false, operationId: '', error: insertError.message };
    }
  }

  logger.info('Wishlist synced to Supabase', { patientId, itemCount: items.length });
  return { success: true, operationId: `wishlist_${patientId}` };
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function enqueueBookingSync(
  bookingData: { doctorId: string; slotId: string; patientId: string },
): Promise<string> {
  const idempotencyKey = generateIdempotencyKey('booking', bookingData.patientId, bookingData.slotId);
  return enqueueOperation('booking', bookingData, idempotencyKey);
}

export async function enqueueCartSync(cartData: CartSyncPayload): Promise<string> {
  const idempotencyKey = generateIdempotencyKey('cart_update', cartData.patientId, 'cart');
  return enqueueOperation('cart_update', cartData, idempotencyKey);
}

export async function enqueueWishlistSync(wishlistData: WishlistSyncPayload): Promise<string> {
  const idempotencyKey = generateIdempotencyKey('wishlist_update', wishlistData.patientId, 'wishlist');
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
