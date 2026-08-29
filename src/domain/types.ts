// Domain Types - Re-exports canonical types from shared/types and adds domain-specific types

export type {
  Booking,
  BookingStatus,
  ConsultationType,
  CartItem,
  WishlistItem,
  Doctor,
  DoctorAvailability,
  ConsultationSlot,
  Product,
  HealthRecordType,
  Attachment,
  HealthRecord,
  DoctorReview,
} from '../shared/types';

export type SlotStatus = 'available' | 'held' | 'booked' | 'expired';

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'SLOT_EXPIRED'
  | 'SLOT_CONFLICT'
  | 'SESSION_EXPIRED'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'INVALID_RESPONSE'
  | 'NETWORK_ERROR';

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
