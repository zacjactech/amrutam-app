// Domain Types for Amrutam App

// ============================================================================
// Consultation Module Types
// ============================================================================

export type SlotStatus = 'available' | 'held' | 'booked' | 'expired';

export type BookingStatus =
  | 'pending_sync'
  | 'confirmed'
  | 'cancelled'
  | 'conflict'
  | 'failed';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  consultationFee: number;
  currency: string;
  languages: string[];
  bio: string;
  isAvailable: boolean;
}

export interface ConsultationSlot {
  id: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  status: SlotStatus;
  version: number;
}

export interface Booking {
  id: string;
  doctorId: string;
  slotId: string;
  patientId: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  syncOperationId?: string;
}

// ============================================================================
// Shop Module Types
// ============================================================================

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

// ============================================================================
// Health Records Module Types
// ============================================================================

export type HealthRecordType =
  | 'lab_report'
  | 'prescription'
  | 'consultation'
  | 'vaccination'
  | 'allergy';

export type AttachmentMimeType = 'image/jpeg' | 'image/png' | 'application/pdf';

export interface Attachment {
  id: string;
  name: string;
  mimeType: AttachmentMimeType;
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

// ============================================================================
// Sync Module Types
// ============================================================================

export type SyncOperationType = 'CREATE_BOOKING' | 'CANCEL_BOOKING';
export type SyncOperationStatus = 'queued' | 'processing' | 'succeeded' | 'failed';

export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  payload: unknown;
  status: SyncOperationStatus;
  attemptCount: number;
  nextAttemptAt?: string;
  idempotencyKey: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API Types
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNextPage?: boolean;
    requestId?: string;
  };
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'SLOT_EXPIRED'
  | 'SLOT_CONFLICT'
  | 'SESSION_EXPIRED'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'INVALID_RESPONSE';

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    requestId?: string;
    details?: unknown;
  };
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}
