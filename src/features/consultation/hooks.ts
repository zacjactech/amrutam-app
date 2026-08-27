// Consultation Module - Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationRepository, BookingRequest } from './repository';
import { DoctorFilter, DEFAULT_DOCTOR_FILTER } from './types';
import { enqueueBookingSync } from '../../infrastructure/sync/syncWorker';
import { useConnectionStatus } from '../../infrastructure/connectivity/connectionManager';
import { classifyApiError } from '../../shared/errors/errorClasses';

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

export function useBookings(patientId: string) {
  return useQuery({
    queryKey: consultationKeys.bookings(),
    queryFn: () => consultationRepository.getBookings(patientId),
    enabled: patientId.length > 0,
  });
}

export function useBookConsultation() {
  const queryClient = useQueryClient();
  const { isConnected } = useConnectionStatus();

  return useMutation({
    mutationFn: async (request: BookingRequest) => {
      if (!isConnected) {
        await enqueueBookingSync({
          doctorId: request.doctorId,
          slotId: request.slotId,
          patientId: request.patientId,
        });
        return consultationRepository.createBooking(request);
      }

      try {
        return await consultationRepository.createBooking(request);
      } catch (error) {
        const classified = classifyApiError(error);
        if (classified.category === 'offline' || classified.category === 'retryable') {
          await enqueueBookingSync({
            doctorId: request.doctorId,
            slotId: request.slotId,
            patientId: request.patientId,
          });
          return consultationRepository.createBooking(request);
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
