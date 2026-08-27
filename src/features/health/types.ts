// Health Records Module - Types

export type HealthRecordType = 'lab_report' | 'prescription' | 'consultation' | 'vaccination' | 'allergy';

export type Attachment = {
  id: string;
  name: string;
  mimeType: 'image/jpeg' | 'image/png' | 'application/pdf';
  thumbnailUrl: string | undefined;
  uri: string | undefined;
  sizeBytes: number | undefined;
};

export type HealthRecord = {
  id: string;
  patientId: string;
  type: HealthRecordType;
  title: string;
  description: string | undefined;
  occurredAt: string;
  tags: string[];
  attachments: Attachment[];
  metadata: Record<string, string | number | boolean | null>;
};

export type RecordFilter = {
  searchQuery: string;
  types: HealthRecordType[];
  tags: string[];
  fromDate: string | null;
  toDate: string | null;
};

export const DEFAULT_RECORD_FILTER: RecordFilter = {
  searchQuery: '',
  types: [],
  tags: [],
  fromDate: null,
  toDate: null,
};

export const HEALTH_RECORD_TYPES: readonly HealthRecordType[] = [
  'lab_report',
  'prescription',
  'consultation',
  'vaccination',
  'allergy',
] as const;

export const RECORD_TYPE_LABELS: Record<HealthRecordType, string> = {
  lab_report: 'Lab Report',
  prescription: 'Prescription',
  consultation: 'Consultation',
  vaccination: 'Vaccination',
  allergy: 'Allergy',
};

export const RECORD_TYPE_COLORS: Record<HealthRecordType, { bg: string; text: string }> = {
  lab_report: { bg: '#E3F2FD', text: '#0D47A1' },
  prescription: { bg: '#E8F5E9', text: '#1B5E3A' },
  consultation: { bg: '#FFF8E1', text: '#F57F17' },
  vaccination: { bg: '#F3E5F5', text: '#6A1B9A' },
  allergy: { bg: '#FFEBEE', text: '#B71C1C' },
};

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};
