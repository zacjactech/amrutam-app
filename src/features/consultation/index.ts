// Consultation Module Index

export { DoctorCard } from './components/DoctorCard';
export { SlotPicker } from './components/SlotPicker';
export { FilterSortSheet } from './screens/FilterSortSheet';
export { ConsultationHomeScreen } from './screens/ConsultationHomeScreen';
export { DoctorListScreen } from './screens/DoctorListScreen';
export { DoctorSearchScreen } from './screens/DoctorSearchScreen';
export { DoctorDetailsScreen } from './screens/DoctorDetailsScreen';
export { SlotSelectionScreen } from './screens/SlotSelectionScreen';
export { BookingConfirmationScreen } from './screens/BookingConfirmationScreen';
export { BookingSuccessScreen } from './screens/BookingSuccessScreen';
export { UpcomingConsultationsScreen } from './screens/UpcomingConsultationsScreen';
export { ConsultationDetailsScreen } from './screens/ConsultationDetailsScreen';
export { BookingConflictModal } from './screens/BookingConflictModal';
export { SlotExpiredModal } from './screens/SlotExpiredModal';
export { CancelConsultationSheet } from './screens/CancelConsultationSheet';
export { CancellationSuccessScreen } from './screens/CancellationSuccessScreen';
export { RateDoctorModal } from './components/RateDoctorModal';
export { consultationRepository } from './repository';
export { reviewRepository } from './reviewRepository';
export {
  useDoctors,
  useDoctor,
  useDoctorSlots,
  useBookings,
  useBookConsultation,
  useCancelConsultation,
  consultationKeys,
  useDoctorReviews,
  useBookingReview,
  useHasReviewedBooking,
  useSubmitReview,
  reviewKeys,
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
  DoctorReview,
} from './types';
export type { BookingRequest, PaginationParams, PaginatedResult } from './repository';
export type { SubmitReviewRequest } from './reviewRepository';
