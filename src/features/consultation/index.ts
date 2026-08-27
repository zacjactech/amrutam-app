// Consultation Module Index

export { DoctorCard } from './components/DoctorCard';
export { SlotPicker } from './components/SlotPicker';
export { DoctorListScreen } from './screens/DoctorListScreen';
export { DoctorDetailsScreen } from './screens/DoctorDetailsScreen';
export { BookingConfirmationScreen } from './screens/BookingConfirmationScreen';
export { UpcomingConsultationsScreen } from './screens/UpcomingConsultationsScreen';
export { consultationRepository } from './repository';
export {
  useDoctors,
  useDoctor,
  useDoctorSlots,
  useBookings,
  useBookConsultation,
  useCancelConsultation,
  consultationKeys,
} from './hooks';
export { generateDoctor, generateDoctors, generateSlotsForDoctor } from './generator';
export {
  SPECIALIZATIONS,
  LANGUAGES,
  DEFAULT_DOCTOR_FILTER,
} from './types';
export type {
  Doctor,
  ConsultationSlot,
  ConsultationType,
  Booking,
  BookingStatus,
  DoctorFilter,
  DoctorAvailability,
} from './types';
export type { BookingRequest, PaginationParams, PaginatedResult } from './repository';
