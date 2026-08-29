// Health Records Module - Types

import type { HealthRecordType, Attachment, HealthRecord } from '../../shared/types';

export type { HealthRecordType, Attachment, HealthRecord };

export interface RecordFilter {
  searchQuery: string;
  types: HealthRecordType[];
  tags: string[];
  fromDate: string | null;
  toDate: string | null;
}

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

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};
