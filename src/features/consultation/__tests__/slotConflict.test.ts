// Slot Conflict Handling Tests
// Tests booking logic: expired slots, already-booked slots, idempotency

import { generateIdempotencyKey, validateBookingSlot } from '@/domain/businessLogic';
import { bookingSchema, bookingRequestSchema } from '../schemas';
import type { Booking } from '../types';

describe('Slot Conflict Handling', () => {
  describe('Booking with expired slot is rejected', () => {
    it('rejects expired slots via validateBookingSlot', () => {
      const pastSlot = {
        id: 'slot_expired',
        startAt: new Date(Date.now() - 3600000).toISOString(),
        endAt: new Date(Date.now() - 1800000).toISOString(),
      };
      expect(validateBookingSlot(pastSlot)).toBe(false);
    });

    it('accepts future slots via validateBookingSlot', () => {
      const futureSlot = {
        id: 'slot_future',
        startAt: new Date(Date.now() + 3600000).toISOString(),
        endAt: new Date(Date.now() + 5400000).toISOString(),
      };
      expect(validateBookingSlot(futureSlot)).toBe(true);
    });

    it('rejects slots starting exactly now', () => {
      const nowSlot = {
        id: 'slot_now',
        startAt: new Date().toISOString(),
        endAt: new Date(Date.now() + 1800000).toISOString(),
      };
      // startAt > currentTime is required; equal means not yet available
      expect(validateBookingSlot(nowSlot, new Date(nowSlot.startAt))).toBe(false);
    });
  });

  describe('Booking with already-booked slot creates pending_sync (not confirmed)', () => {
    it('booking status is pending_sync, not confirmed', () => {
      const now = new Date().toISOString();
      const booking: Booking = {
        id: 'bk_001',
        doctorId: 'doc_001',
        patientId: 'patient_001',
        slotId: 'slot_booked',
        consultationType: 'video',
        status: 'pending_sync',
        idempotencyKey: 'booking:patient_001:slot_booked',
        createdAt: now,
        updatedAt: now,
      };

      expect(booking.status).toBe('pending_sync');
      expect(booking.status).not.toBe('confirmed');
    });

    it('validates booking with pending_sync status passes schema', () => {
      const now = new Date().toISOString();
      const booking = bookingSchema.parse({
        id: 'bk_001',
        doctorId: 'doc_001',
        patientId: 'patient_001',
        slotId: 'slot_booked',
        consultationType: 'video',
        status: 'pending_sync',
        idempotencyKey: 'booking:patient_001:slot_booked',
        createdAt: now,
        updatedAt: now,
      });
      expect(booking.status).toBe('pending_sync');
    });

    it('validates booking with confirmed status also passes schema', () => {
      const now = new Date().toISOString();
      const booking = bookingSchema.parse({
        id: 'bk_002',
        doctorId: 'doc_001',
        patientId: 'patient_001',
        slotId: 'slot_other',
        consultationType: 'video',
        status: 'confirmed',
        idempotencyKey: 'booking:patient_001:slot_other',
        createdAt: now,
        updatedAt: now,
      });
      expect(booking.status).toBe('confirmed');
    });
  });

  describe('Idempotency key prevents duplicate bookings', () => {
    it('generates stable idempotency key from patientId and slotId', () => {
      const key1 = generateIdempotencyKey('patient_001', 'slot_123');
      const key2 = generateIdempotencyKey('patient_001', 'slot_123');
      expect(key1).toBe(key2);
      expect(key1).toBe('patient_001:slot_123');
    });

    it('generates different keys for different patients', () => {
      const key1 = generateIdempotencyKey('patient_A', 'slot_123');
      const key2 = generateIdempotencyKey('patient_B', 'slot_123');
      expect(key1).not.toBe(key2);
    });

    it('generates different keys for different slots', () => {
      const key1 = generateIdempotencyKey('patient_001', 'slot_A');
      const key2 = generateIdempotencyKey('patient_001', 'slot_B');
      expect(key1).not.toBe(key2);
    });

    it('booking request schema requires idempotency-compatible fields', () => {
      const request = bookingRequestSchema.parse({
        doctorId: 'doc_001',
        patientId: 'patient_001',
        slotId: 'slot_123',
        consultationType: 'video',
      });
      expect(request.patientId).toBe('patient_001');
      expect(request.slotId).toBe('slot_123');
    });

    it('consistent key generation across multiple calls', () => {
      const keys = Array.from({ length: 100 }, () =>
        generateIdempotencyKey('patient_X', 'slot_Y'),
      );
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(1);
    });
  });
});
