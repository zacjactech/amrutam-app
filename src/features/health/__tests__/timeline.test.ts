// Health Records Timeline Tests

import { generateHealthRecord, generateHealthRecords, applyRecordFilter, groupRecordsByMonth } from '@/features/health/generator';

describe('Health Records Generator', () => {
  it('generates deterministic records', () => {
    const record1 = generateHealthRecord(1);
    const record2 = generateHealthRecord(1);
    expect(record1.id).toBe(record2.id);
    expect(record1.title).toBe(record2.title);
  });

  it('generates unique records for different indices', () => {
    const record1 = generateHealthRecord(1);
    const record2 = generateHealthRecord(2);
    expect(record1.id).not.toBe(record2.id);
  });

  it('generates 10,000 records without error', () => {
    const records = generateHealthRecords(10000);
    expect(records).toHaveLength(10000);
  });

  it('generates records with valid types', () => {
    const records = generateHealthRecords(100);
    const validTypes = ['lab_report', 'prescription', 'consultation', 'vaccination', 'allergy'] as const;
    for (const record of records) {
      expect(validTypes).toContain(record.type);
    }
  });
});

describe('Record Filter', () => {
  const records = [
    {
      id: 'rec_1',
      type: 'lab_report' as const,
      title: 'Blood Test',
      description: 'Full blood count',
      tags: ['annual'],
      occurredAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'rec_2',
      type: 'prescription' as const,
      title: 'Herbal Medicine',
      description: 'Ayurvedic prescription',
      tags: ['routine'],
      occurredAt: '2024-02-20T10:00:00Z',
    },
    {
      id: 'rec_3',
      type: 'lab_report' as const,
      title: 'Sugar Test',
      description: 'Blood sugar levels',
      tags: ['monitoring'],
      occurredAt: '2024-03-10T10:00:00Z',
    },
  ];

  it('filters by search query', () => {
    const filtered = applyRecordFilter(records as any, { searchQuery: 'blood', types: [], tags: [], fromDate: null, toDate: null });
    expect(filtered.length).toBeGreaterThanOrEqual(1);
  });

  it('filters by type', () => {
    const filtered = applyRecordFilter(records as any, { searchQuery: '', types: ['lab_report'], tags: [], fromDate: null, toDate: null });
    expect(filtered.length).toBe(2);
  });

  it('filters by tag', () => {
    const filtered = applyRecordFilter(records as any, { searchQuery: '', types: [], tags: ['annual'], fromDate: null, toDate: null });
    expect(filtered.length).toBe(1);
    expect(filtered[0]!.id).toBe('rec_1');
  });

  it('filters by date range', () => {
    const filtered = applyRecordFilter(records as any, {
      searchQuery: '',
      types: [],
      tags: [],
      fromDate: '2024-02-01T00:00:00Z',
      toDate: '2024-02-28T23:59:59Z',
    });
    expect(filtered.length).toBe(1);
    expect(filtered[0]!.id).toBe('rec_2');
  });
});

describe('Record Timeline Grouping', () => {
  it('groups records by month', () => {
    const records = [
      { occurredAt: '2024-01-15T10:00:00Z', id: '1' },
      { occurredAt: '2024-01-20T10:00:00Z', id: '2' },
      { occurredAt: '2024-02-10T10:00:00Z', id: '3' },
    ] as any;

    const groups = groupRecordsByMonth(records);
    expect(groups.size).toBe(2);
    expect(groups.get('2024-01')).toHaveLength(2);
    expect(groups.get('2024-02')).toHaveLength(1);
  });

  it('sorts records within groups by date descending', () => {
    const records = [
      { occurredAt: '2024-01-10T10:00:00Z', id: '1' },
      { occurredAt: '2024-01-15T10:00:00Z', id: '2' },
      { occurredAt: '2024-01-05T10:00:00Z', id: '3' },
    ] as any;

    const groups = groupRecordsByMonth(records);
    const janRecords = groups.get('2024-01');
    expect(janRecords && janRecords[0]!.id).toBe('2');
    expect(janRecords && janRecords[1]!.id).toBe('1');
    expect(janRecords && janRecords[2]!.id).toBe('3');
  });
});
