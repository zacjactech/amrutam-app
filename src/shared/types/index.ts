// Shared Types - Canonical type definitions used across modules

export type BookingStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'pending_sync'
  | 'cancelled'
  | 'completed'
  | 'no_show';

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
  idempotencyKey?: string;
  notes?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  updatedAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

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
  slotDuration: number;
}

export interface ConsultationSlot {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  consultationType: ConsultationType;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
}

export type HealthRecordType = 'lab_report' | 'prescription' | 'consultation' | 'vaccination' | 'allergy';

export interface Attachment {
  id: string;
  name: string;
  mimeType: 'image/jpeg' | 'image/png' | 'application/pdf';
  thumbnailUrl?: string;
  uri?: string;
  sizeBytes?: number;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  type: HealthRecordType;
  title: string;
  description?: string;
  occurredAt: string;
  tags: string[];
  attachments: Attachment[];
  metadata: Record<string, string | number | boolean | null>;
}

export interface DoctorReview {
  id: string;
  bookingId: string;
  doctorId: string;
  patientId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}
