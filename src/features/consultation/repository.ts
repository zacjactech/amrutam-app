// Consultation Module - Repository

import { z } from 'zod';
import { Doctor, ConsultationSlot, Booking, DoctorFilter } from './types';
import { generateIdempotencyKey } from '../../domain/businessLogic';
import { doctorSchema, consultationSlotSchema, bookingSchema } from './schemas';
import { shouldFail, createFailureError } from '../../infrastructure/testing/failureInjector';
import { apiRequest } from '../../infrastructure/api/apiClient';

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

    const serverSortMap: Record<string, { sort: string; order: string }> = {
      rating: { sort: 'rating', order: 'desc' },
      experience: { sort: 'experience', order: 'desc' },
      fee: { sort: 'consultationFee', order: 'asc' },
      name: { sort: 'name', order: 'asc' },
    };

    const { sort, order } = serverSortMap[sortBy] ?? { sort: 'rating', order: 'desc' };
    const params = new URLSearchParams({
      _page: String(pagination.page + 1),
      _limit: String(pagination.pageSize),
      _sort: sort,
      _order: order,
    });

    if (filter.searchQuery) {
      params.set('q', filter.searchQuery);
    }

    const doctors = await apiRequest(
      { method: 'GET', endpoint: `/doctors?${params.toString()}` },
      z.array(doctorSchema),
    );

    const filtered = applyFilter(doctors, filter);
    const total = filtered.length;
    const hasMore = total > pagination.pageSize;

    return {
      data: filtered,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      hasMore,
    };
  },

  async getDoctorById(doctorId: string): Promise<Doctor | null> {
    const failure = shouldFail({ endpoint: `/doctors/${doctorId}`, method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    try {
      return await apiRequest(
        { method: 'GET', endpoint: `/doctors/${doctorId}` },
        doctorSchema,
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') {
        return null;
      }
      throw error;
    }
  },

  async getDoctorSlots(doctorId: string): Promise<ConsultationSlot[]> {
    const failure = shouldFail({ endpoint: `/doctors/${doctorId}/slots`, method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const slots = await apiRequest(
      { method: 'GET', endpoint: `/slots?doctorId=${doctorId}` },
      z.array(consultationSlotSchema),
    );

    return slots;
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

    const idempotencyKey = generateIdempotencyKey(request.patientId, request.slotId);

    const booking = await apiRequest(
      {
        method: 'POST',
        endpoint: '/bookings',
        body: {
          doctorId: request.doctorId,
          patientId: request.patientId,
          slotId: request.slotId,
          consultationType: request.consultationType,
          idempotencyKey,
          notes: request.notes,
        },
      },
      bookingSchema,
    );

    return booking;
  },

  async getBookings(_patientId: string): Promise<Booking[]> {
    const failure = shouldFail({ endpoint: '/bookings', method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const bookings = await apiRequest(
      { method: 'GET', endpoint: '/bookings' },
      z.array(bookingSchema),
    );

    return bookings;
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const failure = shouldFail({ endpoint: `/bookings/${bookingId}`, method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    try {
      return await apiRequest(
        { method: 'GET', endpoint: `/bookings/${bookingId}` },
        bookingSchema,
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') {
        return null;
      }
      throw error;
    }
  },

  async cancelBooking(bookingId: string): Promise<Booking | null> {
    const failure = shouldFail({ endpoint: `/bookings/${bookingId}/cancel`, method: 'POST' });
    if (failure) {
      throw createFailureError(failure);
    }

    try {
      return await apiRequest(
        { method: 'POST', endpoint: `/bookings/${bookingId}/cancel` },
        bookingSchema,
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') {
        return null;
      }
      throw error;
    }
  },
};
