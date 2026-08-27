// Booking Business Rules Tests

import { generateIdempotencyKey } from '@/domain/businessLogic';
import { bookingSchema } from '../schemas';

describe('Booking Business Rules', () => {
  it('generates stable idempotency key', () => {
    const key1 = generateIdempotencyKey('patient_001', 'slot_123');
    const key2 = generateIdempotencyKey('patient_001', 'slot_123');
    expect(key1).toBe(key2);
  });

  it('generates different idempotency keys for different inputs', () => {
    const key1 = generateIdempotencyKey('patient_001', 'slot_123');
    const key2 = generateIdempotencyKey('patient_002', 'slot_123');
    const key3 = generateIdempotencyKey('patient_001', 'slot_456');
    expect(key1).not.toBe(key2);
    expect(key1).not.toBe(key3);
  });

  it('validates booking schema', () => {
    const booking = bookingSchema.parse({
      id: 'booking_001',
      doctorId: 'doctor_001',
      patientId: 'patient_001',
      slotId: 'slot_001',
      consultationType: 'video',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      idempotencyKey: 'key_001',
    });
    expect(booking.id).toBe('booking_001');
    expect(booking.status).toBe('confirmed');
  });

  it('rejects invalid consultation type', () => {
    expect(() =>
      bookingSchema.parse({
        id: 'booking_001',
        doctorId: 'doctor_001',
        patientId: 'patient_001',
        slotId: 'slot_001',
        consultationType: 'invalid',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        idempotencyKey: 'key_001',
      }),
    ).toThrow();
  });

  it('rejects invalid status', () => {
    expect(() =>
      bookingSchema.parse({
        id: 'booking_001',
        doctorId: 'doctor_001',
        patientId: 'patient_001',
        slotId: 'slot_001',
        consultationType: 'video',
        status: 'invalid_status',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        idempotencyKey: 'key_001',
      }),
    ).toThrow();
  });
});
