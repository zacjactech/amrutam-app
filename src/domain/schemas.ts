// Zod Validation Schemas for Amrutam App

import { z } from 'zod';

// ============================================================================
// Consultation Schemas
// ============================================================================

export const slotStatusSchema = z.enum(['available', 'held', 'booked', 'expired']);

export const bookingStatusSchema = z.enum([
  'pending_sync',
  'confirmed',
  'cancelled',
  'conflict',
  'failed',
]);

export const doctorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  specialty: z.string().min(1).max(100),
  avatarUrl: z.string().url(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  experienceYears: z.number().int().nonnegative(),
  consultationFee: z.number().nonnegative(),
  currency: z.string().length(3),
  languages: z.array(z.string()),
  bio: z.string().max(2000),
  isAvailable: z.boolean(),
});

export const consultationSlotSchema = z.object({
  id: z.string().uuid(),
  doctorId: z.string().uuid(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  status: slotStatusSchema,
  version: z.number().int().nonnegative(),
});

export const bookingSchema = z.object({
  id: z.string().uuid(),
  doctorId: z.string().uuid(),
  slotId: z.string().uuid(),
  patientId: z.string().uuid(),
  status: bookingStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  syncOperationId: z.string().uuid().optional(),
});

export const createBookingRequestSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  slotId: z.string().uuid(),
  idempotencyKey: z.string().uuid(),
});

// ============================================================================
// Shop Schemas
// ============================================================================

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(500),
  description: z.string().max(5000),
  category: z.string().min(1).max(100),
  price: z.number().nonnegative(),
  currency: z.string().length(3),
  imageUrl: z.string().url(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  tags: z.array(z.string()),
});

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().max(100),
  unitPrice: z.number().nonnegative(),
  updatedAt: z.string().datetime(),
});

export const wishlistItemSchema = z.object({
  productId: z.string().uuid(),
  addedAt: z.string().datetime(),
});

// ============================================================================
// Health Records Schemas
// ============================================================================

export const healthRecordTypeSchema = z.enum([
  'lab_report',
  'prescription',
  'consultation',
  'vaccination',
  'allergy',
]);

export const attachmentMimeTypeSchema = z.enum(['image/jpeg', 'image/png', 'application/pdf']);

export const attachmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(500),
  mimeType: attachmentMimeTypeSchema,
  thumbnailUrl: z.string().url().optional(),
  uri: z.string().url().optional(),
  sizeBytes: z.number().int().positive().optional(),
});

export const healthRecordSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  type: healthRecordTypeSchema,
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  occurredAt: z.string().datetime(),
  tags: z.array(z.string()),
  attachments: z.array(attachmentSchema),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

// ============================================================================
// Sync Schemas
// ============================================================================

export const syncOperationTypeSchema = z.enum(['CREATE_BOOKING', 'CANCEL_BOOKING']);
export const syncOperationStatusSchema = z.enum(['queued', 'processing', 'succeeded', 'failed']);

export const syncOperationSchema = z.object({
  id: z.string().uuid(),
  type: syncOperationTypeSchema,
  payload: z.unknown(),
  status: syncOperationStatusSchema,
  attemptCount: z.number().int().nonnegative(),
  nextAttemptAt: z.string().datetime().optional(),
  idempotencyKey: z.string().uuid(),
  lastError: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================================================
// API Schemas
// ============================================================================

export const apiErrorCodeSchema = z.enum([
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'SLOT_EXPIRED',
  'SLOT_CONFLICT',
  'SESSION_EXPIRED',
  'TIMEOUT',
  'SERVER_ERROR',
  'INVALID_RESPONSE',
]);

export const apiErrorResponseSchema = z.object({
  error: z.object({
    code: apiErrorCodeSchema,
    message: z.string().min(1),
    requestId: z.string().uuid().optional(),
    details: z.unknown().optional(),
  }),
});

// ============================================================================
// Type Exports
// ============================================================================

export type ConsultationSlot = z.infer<typeof consultationSlotSchema>;
export type Booking = z.infer<typeof bookingSchema>;

