// Consultation Module - Local Booking Repository (SQLite)

import { Booking, BookingStatus } from './types';
import { bookingSchema } from './schemas';
import { getDatabase } from '../../infrastructure/database/database';
import { logger } from '../../infrastructure/logging/logger';

export interface LocalBookingRepository {
  getAll(): Promise<Booking[]>;
  getById(id: string): Promise<Booking | null>;
  insert(booking: Booking): Promise<void>;
  updateStatus(id: string, status: BookingStatus, syncOperationId?: string): Promise<void>;
  updateSyncOperationId(id: string, syncOperationId: string): Promise<void>;
  delete(id: string): Promise<void>;
  clearAll(): Promise<void>;
}

export const localBookingRepository: LocalBookingRepository = {
  async getAll(): Promise<Booking[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<{
      id: string;
      doctor_id: string;
      slot_id: string;
      patient_id: string;
      status: string;
      created_at: string;
      updated_at: string;
      sync_operation_id: string | null;
      idempotency_key: string | null;
      notes: string | null;
    }>('SELECT * FROM bookings ORDER BY updated_at DESC');

    return result.map((row) =>
      bookingSchema.parse({
        id: row.id,
        doctorId: row.doctor_id,
        slotId: row.slot_id,
        patientId: row.patient_id,
        status: row.status as BookingStatus,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        syncOperationId: row.sync_operation_id ?? undefined,
        idempotencyKey: row.idempotency_key ?? undefined,
        notes: row.notes ?? undefined,
      }),
    );
  },

  async getById(id: string): Promise<Booking | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{
      id: string;
      doctor_id: string;
      slot_id: string;
      patient_id: string;
      status: string;
      created_at: string;
      updated_at: string;
      sync_operation_id: string | null;
      idempotency_key: string | null;
      notes: string | null;
    }>('SELECT * FROM bookings WHERE id = ?', [id]);

    if (result == null) return null;

    return bookingSchema.parse({
      id: result.id,
      doctorId: result.doctor_id,
      slotId: result.slot_id,
      patientId: result.patient_id,
      status: result.status as BookingStatus,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      idempotencyKey: result.idempotency_key ?? undefined,
      notes: result.notes ?? undefined,
    });
  },

  async insert(booking: Booking): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT OR REPLACE INTO bookings (id, doctor_id, slot_id, patient_id, status, created_at, updated_at, sync_operation_id, idempotency_key, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking.id,
        booking.doctorId,
        booking.slotId,
        booking.patientId,
        booking.status,
        booking.createdAt,
        now,
        null,
        booking.idempotencyKey ?? null,
        booking.notes ?? null,
      ],
    );
    logger.debug('Local booking inserted', { bookingId: booking.id });
  },

  async updateStatus(id: string, status: BookingStatus, syncOperationId?: string): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      `UPDATE bookings SET status = ?, updated_at = ?, sync_operation_id = ? WHERE id = ?`,
      [status, now, syncOperationId ?? null, id],
    );
    logger.debug('Local booking status updated', { bookingId: id, status });
  },

  async updateSyncOperationId(id: string, syncOperationId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE bookings SET sync_operation_id = ? WHERE id = ?',
      [syncOperationId, id],
    );
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM bookings WHERE id = ?', [id]);
    logger.debug('Local booking deleted', { bookingId: id });
  },

  async clearAll(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM bookings');
    logger.debug('Local bookings cleared');
  },
};
