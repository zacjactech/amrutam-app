// Health Record Filtering Tests
// Tests filter logic: by type, by multiple types, empty filter, search by title

import { HealthRecord, RecordFilter, DEFAULT_RECORD_FILTER } from '../types';

const mockRecords: HealthRecord[] = [
  {
    id: 'rec_001',
    patientId: 'patient_001',
    type: 'lab_report',
    title: 'Blood Test Results',
    description: 'Complete blood count report',
    occurredAt: '2024-06-01T10:00:00Z',
    tags: ['blood', 'routine'],
    attachments: [],
    metadata: {},
  },
  {
    id: 'rec_002',
    patientId: 'patient_001',
    type: 'prescription',
    title: 'Ashwagandha Prescription',
    description: 'Stress relief medication',
    occurredAt: '2024-06-15T14:00:00Z',
    tags: ['stress', 'medication'],
    attachments: [],
    metadata: {},
  },
  {
    id: 'rec_003',
    patientId: 'patient_001',
    type: 'consultation',
    title: 'Dr. Sharma Consultation',
    description: 'Follow-up consultation',
    occurredAt: '2024-07-01T09:00:00Z',
    tags: ['follow-up'],
    attachments: [],
    metadata: {},
  },
  {
    id: 'rec_004',
    patientId: 'patient_001',
    type: 'lab_report',
    title: 'Cholesterol Panel',
    description: 'Lipid profile test',
    occurredAt: '2024-07-10T11:00:00Z',
    tags: ['cholesterol'],
    attachments: [],
    metadata: {},
  },
  {
    id: 'rec_005',
    patientId: 'patient_001',
    type: 'vaccination',
    title: 'Flu Vaccine',
    description: 'Annual flu vaccination',
    occurredAt: '2024-08-01T08:00:00Z',
    tags: ['flu', 'prevention'],
    attachments: [],
    metadata: {},
  },
  {
    id: 'rec_006',
    patientId: 'patient_001',
    type: 'allergy',
    title: 'Peanut Allergy',
    description: 'Severe peanut allergy documented',
    occurredAt: '2024-08-15T10:00:00Z',
    tags: ['allergy', 'peanut'],
    attachments: [],
    metadata: {},
  },
];

function filterRecords(records: HealthRecord[], filter: RecordFilter): HealthRecord[] {
  let result = records;

  if (filter.types.length > 0) {
    result = result.filter((r) => filter.types.includes(r.type));
  }

  if (filter.searchQuery) {
    const query = filter.searchQuery.toLowerCase();
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        (r.description?.toLowerCase().includes(query) ?? false),
    );
  }

  if (filter.tags.length > 0) {
    result = result.filter((r) => filter.tags.some((t) => r.tags.includes(t)));
  }

  if (filter.fromDate) {
    result = result.filter((r) => r.occurredAt >= filter.fromDate!);
  }

  if (filter.toDate) {
    result = result.filter((r) => r.occurredAt <= filter.toDate!);
  }

  return result;
}

describe('Health Record Filtering', () => {
  describe('Filter by single type returns only that type', () => {
    it('filters lab_report records', () => {
      const filter: RecordFilter = { ...DEFAULT_RECORD_FILTER, types: ['lab_report'] };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(2);
      results.forEach((r) => expect(r.type).toBe('lab_report'));
    });

    it('filters prescription records', () => {
      const filter: RecordFilter = { ...DEFAULT_RECORD_FILTER, types: ['prescription'] };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(1);
      expect(results[0]!.type).toBe('prescription');
    });

    it('filters vaccination records', () => {
      const filter: RecordFilter = { ...DEFAULT_RECORD_FILTER, types: ['vaccination'] };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(1);
      expect(results[0]!.type).toBe('vaccination');
    });
  });

  describe('Filter by multiple types returns union', () => {
    it('returns lab_report and prescription union', () => {
      const filter: RecordFilter = {
        ...DEFAULT_RECORD_FILTER,
        types: ['lab_report', 'prescription'],
      };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(3);
      const types = results.map((r) => r.type);
      expect(types).toContain('lab_report');
      expect(types).toContain('prescription');
    });

    it('returns all types when all are selected', () => {
      const filter: RecordFilter = {
        ...DEFAULT_RECORD_FILTER,
        types: ['lab_report', 'prescription', 'consultation', 'vaccination', 'allergy'],
      };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(6);
    });
  });

  describe('Empty filter returns all records', () => {
    it('returns all records with default filter', () => {
      const results = filterRecords(mockRecords, DEFAULT_RECORD_FILTER);
      expect(results).toHaveLength(6);
    });

    it('returns all records when types array is empty', () => {
      const filter: RecordFilter = { ...DEFAULT_RECORD_FILTER, types: [] };
      const results = filterRecords(mockRecords, filter);
      expect(results).toHaveLength(6);
    });
  });

  describe('Search filters by title', () => {
    it('finds records by title substring', () => {
      const filter: RecordFilter = { ...DEFAULT_RECORD_FILTER, searchQuery: 'Blood' };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(1);
      expect(results[0]!.title).toBe('Blood Test Results');
    });

    it('search is case-insensitive', () => {
      const filter: RecordFilter = { ...DEFAULT_RECORD_FILTER, searchQuery: 'blood' };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(1);
      expect(results[0]!.title).toBe('Blood Test Results');
    });

    it('search also matches description', () => {
      const filter: RecordFilter = { ...DEFAULT_RECORD_FILTER, searchQuery: 'cholesterol' };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(1);
      expect(results[0]!.title).toBe('Cholesterol Panel');
    });

    it('empty search returns all records', () => {
      const filter: RecordFilter = { ...DEFAULT_RECORD_FILTER, searchQuery: '' };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(6);
    });

    it('search with no matches returns empty', () => {
      const filter: RecordFilter = { ...DEFAULT_RECORD_FILTER, searchQuery: 'XYZ123' };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(0);
    });
  });

  describe('Combined filters', () => {
    it('filters by type AND search query', () => {
      const filter: RecordFilter = {
        ...DEFAULT_RECORD_FILTER,
        types: ['lab_report'],
        searchQuery: 'Cholesterol',
      };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(1);
      expect(results[0]!.title).toBe('Cholesterol Panel');
      expect(results[0]!.type).toBe('lab_report');
    });

    it('filters by tags', () => {
      const filter: RecordFilter = { ...DEFAULT_RECORD_FILTER, tags: ['flu'] };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(1);
      expect(results[0]!.title).toBe('Flu Vaccine');
    });

    it('filters by date range', () => {
      const filter: RecordFilter = {
        ...DEFAULT_RECORD_FILTER,
        fromDate: '2024-07-01T00:00:00Z',
        toDate: '2024-07-31T23:59:59Z',
      };
      const results = filterRecords(mockRecords, filter);

      expect(results).toHaveLength(2);
      results.forEach((r) => {
        expect(r.occurredAt >= '2024-07-01T00:00:00Z').toBe(true);
        expect(r.occurredAt <= '2024-07-31T23:59:59Z').toBe(true);
      });
    });
  });
});
