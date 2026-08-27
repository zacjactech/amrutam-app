// Consultation Module - Doctor Types

export interface Doctor {
  id: string;
  name: string;
  photoUrl: string;
  specialization: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  languages: string[];
  availability: DoctorAvailability;
  bio: string;
  clinicName: string;
  clinicAddress: string;
}

export interface DoctorAvailability {
  isAvailable: boolean;
  nextAvailableSlot: string | null;
  slotDuration: number; // minutes
}

export interface ConsultationSlot {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  consultationType: ConsultationType;
}

export type ConsultationType = 'video' | 'audio' | 'chat' | 'in-person';

export interface Booking {
  id: string;
  doctorId: string;
  patientId: string;
  slotId: string;
  consultationType: ConsultationType;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  idempotencyKey: string;
  notes?: string | undefined;
}

export type BookingStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'pending_sync'
  | 'cancelled'
  | 'completed'
  | 'no_show';

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
