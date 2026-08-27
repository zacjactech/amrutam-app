// Consultation Module - Zod Validation Schemas

import { z } from 'zod';
import { SPECIALIZATIONS, LANGUAGES } from './types';

export const consultationTypeSchema = z.enum(['video', 'audio', 'chat', 'in-person']);

export const bookingStatusSchema = z.enum([
  'pending_confirmation',
  'confirmed',
  'pending_sync',
  'cancelled',
  'completed',
  'no_show',
]);

export const doctorAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
  nextAvailableSlot: z.string().nullable(),
  slotDuration: z.number().int().positive(),
});

export const doctorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  photoUrl: z.string().url(),
  specialization: z.enum(SPECIALIZATIONS),
  experience: z.number().int().min(0).max(60),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  consultationFee: z.number().int().min(0),
  languages: z.array(z.enum(LANGUAGES)).min(1),
  availability: doctorAvailabilitySchema,
  bio: z.string().max(1000),
  clinicName: z.string().min(1),
  clinicAddress: z.string().min(1),
});

export const consultationSlotSchema = z.object({
  id: z.string().min(1),
  doctorId: z.string().min(1),
  startTime: z.string(),
  endTime: z.string(),
  isBooked: z.boolean(),
  consultationType: consultationTypeSchema,
});

export const bookingSchema = z.object({
  id: z.string().min(1),
  doctorId: z.string().min(1),
  patientId: z.string().min(1),
  slotId: z.string().min(1),
  consultationType: consultationTypeSchema,
  status: bookingStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  idempotencyKey: z.string().min(1),
  notes: z.union([z.string().max(500), z.undefined()]),
});

export const doctorFilterSchema = z.object({
  searchQuery: z.string().max(100),
  specialization: z.enum(SPECIALIZATIONS).nullable(),
  minExperience: z.number().int().min(0).max(60).nullable(),
  maxFee: z.number().int().min(0).nullable(),
  minRating: z.number().min(0).max(5).nullable(),
  language: z.enum(LANGUAGES).nullable(),
  availableOnly: z.boolean(),
});

export const bookingRequestSchema = z.object({
  doctorId: z.string().min(1),
  patientId: z.string().min(1),
  slotId: z.string().min(1),
  consultationType: consultationTypeSchema,
  notes: z.string().max(500).optional(),
});

export type Doctor = z.infer<typeof doctorSchema>;
export type ConsultationSlot = z.infer<typeof consultationSlotSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type DoctorFilter = z.infer<typeof doctorFilterSchema>;
export type BookingRequest = z.infer<typeof bookingRequestSchema>;
