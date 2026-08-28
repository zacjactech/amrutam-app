// Consultation Module - Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationRepository, BookingRequest } from './repository';
import { DoctorFilter, DEFAULT_DOCTOR_FILTER } from './types';
import { enqueueBookingSync } from '../../infrastructure/sync/syncWorker';
import { useConnectionStatus } from '../../infrastructure/connectivity/connectionManager';
import { classifyApiError } from '../../shared/errors/errorClasses';
import { useAuthContext } from '../../infrastructure/auth/AuthContext';

export const consultationKeys = {
  all: ['consultations'] as const,
  doctors: (filter: DoctorFilter) => [...consultationKeys.all, 'doctors', filter] as const,
  doctor: (id: string) => [...consultationKeys.all, 'doctor', id] as const,
  slots: (doctorId: string) => [...consultationKeys.all, 'slots', doctorId] as const,
  bookings: () => [...consultationKeys.all, 'bookings'] as const,
  booking: (id: string) => [...consultationKeys.all, 'booking', id] as const,
};

const PAGE_SIZE = 20;

export function useDoctors(
  filter: DoctorFilter = DEFAULT_DOCTOR_FILTER,
  sortBy: 'rating' | 'experience' | 'fee' | 'name' = 'rating',
) {
  return useQuery({
    queryKey: consultationKeys.doctors(filter),
    queryFn: () =>
      consultationRepository.getDoctors(
        filter,
        { page: 0, pageSize: PAGE_SIZE },
        sortBy,
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useDoctor(doctorId: string) {
  return useQuery({
    queryKey: consultationKeys.doctor(doctorId),
    queryFn: () => consultationRepository.getDoctorById(doctorId),
    enabled: doctorId.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDoctorSlots(doctorId: string) {
  return useQuery({
    queryKey: consultationKeys.slots(doctorId),
    queryFn: () => consultationRepository.getAvailableSlots(doctorId),
    enabled: doctorId.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useBookings(patientId?: string) {
  const { patientId: authPatientId, isAuthenticated } = useAuthContext();
  const effectivePatientId = patientId ?? authPatientId;

  return useQuery({
    queryKey: consultationKeys.bookings(),
    queryFn: () => consultationRepository.getBookings(effectivePatientId!),
    enabled: isAuthenticated && effectivePatientId !== null && effectivePatientId.length > 0,
  });
}

export function useBookConsultation() {
  const queryClient = useQueryClient();
  const { isConnected } = useConnectionStatus();
  const { patientId } = useAuthContext();

  return useMutation({
    mutationFn: async (request: BookingRequest) => {
      const effectivePatientId = request.patientId || patientId;
      if (!effectivePatientId) {
        throw new Error('Patient ID not available. Please sign in.');
      }

      const authenticatedRequest = { ...request, patientId: effectivePatientId };

      if (!isConnected) {
        await enqueueBookingSync({
          doctorId: authenticatedRequest.doctorId,
          slotId: authenticatedRequest.slotId,
          patientId: authenticatedRequest.patientId,
        });
        return consultationRepository.createBooking(authenticatedRequest);
      }

      try {
        return await consultationRepository.createBooking(authenticatedRequest);
      } catch (error) {
        const classified = classifyApiError(error);
        if (classified.category === 'offline' || classified.category === 'retryable') {
          await enqueueBookingSync({
            doctorId: authenticatedRequest.doctorId,
            slotId: authenticatedRequest.slotId,
            patientId: authenticatedRequest.patientId,
          });
          return consultationRepository.createBooking(authenticatedRequest);
        }
        throw error;
      }
    },
    onSuccess: (booking) => {
      void queryClient.invalidateQueries({ queryKey: consultationKeys.bookings() });
      void queryClient.invalidateQueries({
        queryKey: consultationKeys.slots(booking.doctorId),
      });
    },
  });
}

export function useCancelConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) =>
      consultationRepository.cancelBooking(bookingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: consultationKeys.bookings() });
    },
  });
}

// ─── Review Hooks ──────────────────────────────────────────────────────────

import { reviewRepository, SubmitReviewRequest } from './reviewRepository';

export const reviewKeys = {
  all: ['reviews'] as const,
  doctorReviews: (doctorId: string) => [...reviewKeys.all, 'doctor', doctorId] as const,
  bookingReview: (bookingId: string) => [...reviewKeys.all, 'booking', bookingId] as const,
  hasReviewed: (patientId: string, bookingId: string) => [...reviewKeys.all, 'hasReviewed', patientId, bookingId] as const,
};

export function useDoctorReviews(doctorId: string) {
  return useQuery({
    queryKey: reviewKeys.doctorReviews(doctorId),
    queryFn: () => reviewRepository.getReviewsByDoctor(doctorId),
    enabled: doctorId.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBookingReview(bookingId: string) {
  return useQuery({
    queryKey: reviewKeys.bookingReview(bookingId),
    queryFn: () => reviewRepository.getReviewByBooking(bookingId),
    enabled: bookingId.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useHasReviewedBooking(patientId: string | null, bookingId: string) {
  return useQuery({
    queryKey: reviewKeys.hasReviewed(patientId ?? '', bookingId),
    queryFn: () => reviewRepository.hasPatientReviewedBooking(patientId!, bookingId),
    enabled: patientId !== null && bookingId.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  const { patientId } = useAuthContext();

  return useMutation({
    mutationFn: async (request: Omit<SubmitReviewRequest, 'patientId'>) => {
      if (!patientId) {
        throw new Error('Patient ID not available. Please sign in.');
      }

      return reviewRepository.submitReview({
        ...request,
        patientId,
      });
    },
    onSuccess: (_review, variables) => {
      void queryClient.invalidateQueries({ queryKey: reviewKeys.doctorReviews(variables.doctorId) });
      void queryClient.invalidateQueries({ queryKey: reviewKeys.bookingReview(variables.bookingId) });
      void queryClient.invalidateQueries({ queryKey: consultationKeys.doctor(variables.doctorId) });
      void queryClient.invalidateQueries({ queryKey: consultationKeys.bookings() });
    },
  });
}
