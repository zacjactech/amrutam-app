// Consultation Module - Types

import type {
  Booking,
  BookingStatus,
  ConsultationType,
  Doctor,
  DoctorAvailability,
  ConsultationSlot,
  DoctorReview,
} from '../../shared/types';

export type {
  Booking,
  BookingStatus,
  ConsultationType,
  Doctor,
  DoctorAvailability,
  ConsultationSlot,
  DoctorReview,
};

export interface DoctorFilter {
  searchQuery: string;
  specialization: string | null;
  minExperience: number | null;
  maxFee: number | null;
  minRating: number | null;
  language: string | null;
  availableOnly: boolean;
}

export const DEFAULT_DOCTOR_FILTER: DoctorFilter = {
  searchQuery: '',
  specialization: null,
  minExperience: null,
  maxFee: null,
  minRating: null,
  language: null,
  availableOnly: false,
};

export const SPECIALIZATIONS = [
  'General Ayurveda',
  'Panchakarma',
  'Skin & Hair',
  'Digestive Health',
  'Mental Wellness',
  'Women\'s Health',
  'Child Care',
  'Joint & Spine',
  'Weight Management',
  'Respiratory Health',
] as const;

export const LANGUAGES = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi',
] as const;
