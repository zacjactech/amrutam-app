// Consultation Module - Repository

import { Doctor, ConsultationSlot, Booking, DoctorFilter } from './types';
import { generateDoctor, generateSlotsForDoctor } from './generator';
import { generateIdempotencyKey } from '../../domain/businessLogic';
import { doctorSchema, bookingSchema } from './schemas';
import { shouldFail, createFailureError } from '../../infrastructure/testing/failureInjector';

const DOCTOR_CACHE_SIZE = 5000;

let doctorCache: Map<string, Doctor> | null = null;

function ensureCache(): Map<string, Doctor> {
  if (doctorCache === null) {
    doctorCache = new Map();
    for (let i = 0; i < DOCTOR_CACHE_SIZE; i++) {
      const doctor = generateDoctor(i);
      doctorCache.set(doctor.id, doctor);
    }
  }
  return doctorCache;
}

function applyFilter(doctors: Doctor[], filter: DoctorFilter): Doctor[] {
  return doctors.filter((doctor) => {
    if (filter.searchQuery.length > 0) {
      const query = filter.searchQuery.toLowerCase();
      const nameMatch = doctor.name.toLowerCase().includes(query);
      const specMatch = doctor.specialization.toLowerCase().includes(query);
      const clinicMatch = doctor.clinicName.toLowerCase().includes(query);
      if (!nameMatch && !specMatch && !clinicMatch) {
        return false;
      }
    }

    if (filter.specialization !== null && doctor.specialization !== filter.specialization) {
      return false;
    }

    if (filter.minExperience !== null && doctor.experience < filter.minExperience) {
      return false;
    }

    if (filter.maxFee !== null && doctor.consultationFee > filter.maxFee) {
      return false;
    }

    if (filter.minRating !== null && doctor.rating < filter.minRating) {
      return false;
    }

    if (filter.language !== null && !doctor.languages.includes(filter.language)) {
      return false;
    }

    if (filter.availableOnly && !doctor.availability.isAvailable) {
      return false;
    }

    return true;
  });
}

function sortDoctors(doctors: Doctor[], sortBy: 'rating' | 'experience' | 'fee' | 'name'): Doctor[] {
  const sorted = [...doctors];
  switch (sortBy) {
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'experience':
      sorted.sort((a, b) => b.experience - a.experience);
      break;
    case 'fee':
      sorted.sort((a, b) => a.consultationFee - b.consultationFee);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return sorted;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface BookingRequest {
  doctorId: string;
  patientId: string;
  slotId: string;
  consultationType: 'video' | 'audio' | 'chat' | 'in-person';
  notes?: string;
}

export const consultationRepository = {
  async getDoctors(
    filter: DoctorFilter,
    pagination: PaginationParams,
    sortBy: 'rating' | 'experience' | 'fee' | 'name' = 'rating',
  ): Promise<PaginatedResult<Doctor>> {
    const failure = shouldFail({ endpoint: '/doctors', method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const cache = ensureCache();
    const allDoctors = Array.from(cache.values());
    const filtered = applyFilter(allDoctors, filter);
    const sorted = sortDoctors(filtered, sortBy);

    const start = pagination.page * pagination.pageSize;
    const end = start + pagination.pageSize;
    const data = sorted.slice(start, end);

    return {
      data,
      total: sorted.length,
      page: pagination.page,
      pageSize: pagination.pageSize,
      hasMore: end < sorted.length,
    };
  },

  async getDoctorById(doctorId: string): Promise<Doctor | null> {
    const failure = shouldFail({ endpoint: `/doctors/${doctorId}`, method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const cache = ensureCache();
    const doctor = cache.get(doctorId);
    if (doctor === undefined) {
      return null;
    }
    return doctorSchema.parse(doctor);
  },

  async getDoctorSlots(doctorId: string): Promise<ConsultationSlot[]> {
    const failure = shouldFail({ endpoint: `/doctors/${doctorId}/slots`, method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    return generateSlotsForDoctor(doctorId);
  },

  async getAvailableSlots(doctorId: string): Promise<ConsultationSlot[]> {
    const failure = shouldFail({ endpoint: `/doctors/${doctorId}/slots/available`, method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const slots = await this.getDoctorSlots(doctorId);
    const now = new Date();
    return slots.filter(
      (slot) => !slot.isBooked && new Date(slot.startTime) > now,
    );
  },

  async createBooking(request: BookingRequest): Promise<Booking> {
    const failure = shouldFail({ endpoint: '/bookings', method: 'POST', body: request });
    if (failure) {
      throw createFailureError(failure);
    }

    const now = new Date().toISOString();
    const idempotencyKey = generateIdempotencyKey(request.patientId, request.slotId);

    const booking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      doctorId: request.doctorId,
      patientId: request.patientId,
      slotId: request.slotId,
      consultationType: request.consultationType,
      status: 'pending_sync' as const,
      createdAt: now,
      updatedAt: now,
      idempotencyKey,
      notes: request.notes,
    };

    return bookingSchema.parse(booking);
  },

  async getBookings(_patientId: string): Promise<Booking[]> {
    return [];
  },

  async getBookingById(_bookingId: string): Promise<Booking | null> {
    return null;
  },

  async cancelBooking(_bookingId: string): Promise<Booking | null> {
    return null;
  },
};
