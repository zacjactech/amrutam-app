// Health Records Module - Data Generator

import { HealthRecord, Attachment, HealthRecordType, RecordFilter, HEALTH_RECORD_TYPES, RECORD_TYPE_LABELS } from './types';

const RECORD_TITLES: Record<HealthRecordType, string[]> = {
  lab_report: [
    'Complete Blood Count', 'Liver Function Test', 'Kidney Function Test',
    'Lipid Profile', 'Thyroid Profile', 'Vitamin D Levels',
    'Blood Sugar Fasting', 'HbA1c', 'Urine Routine', 'ECG Report',
  ],
  prescription: [
    'Ayurvedic Prescription', 'Herbal Formulation', 'Traditional Remedy',
    'Panchakarma Prescription', 'Herbal Decotion', 'Churna Prescription',
    'Oil Prescription', 'Ghee Based Formulation', 'Tablet Prescription',
  ],
  consultation: [
    'Initial Consultation', 'Follow-up Visit', 'Wellness Check',
    'Dosha Assessment', 'Annual Review', 'Specialist Consultation',
    'Video Consultation', 'In-Person Consultation', 'Telemedicine Session',
  ],
  vaccination: [
    'COVID-19 Booster', 'Hepatitis B', 'Influenza Vaccine',
    'Pneumococcal Vaccine', 'Typhoid Vaccine', 'MMR Booster',
    'Tetanus Toxoid', 'Rabies Pre-exposure', 'Japanese Encephalitis',
  ],
  allergy: [
    'Dust Allergy Test', 'Food Allergy Panel', 'Pollen Allergy',
    'Drug Allergy Test', 'Insect Sting Allergy', 'Mold Allergy',
    'Pet Dander Allergy', 'Latex Allergy', 'Nickel Allergy',
  ],
};

const TAG_POOL = [
  'annual', 'follow-up', 'urgent', 'routine', 'preventive',
  'chronic', 'acute', 'wellness', 'screening', 'monitoring',
  'ayurvedic', 'modern', 'integrated', 'digital', 'physical',
];

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function pickRandom<T>(arr: readonly T[], random: () => number): T {
  return arr[Math.floor(random() * arr.length)] as T;
}

function generateAttachment(index: number, random: () => number): Attachment {
  const mimeType = random() > 0.7 ? 'application/pdf' : 'image/png';
  const id = `att_${index.toString().padStart(5, '0')}`;
  const name = mimeType === 'application/pdf'
    ? `document_${index}.pdf`
    : `scan_${index}.png`;

  return {
    id,
    name,
    mimeType,
    thumbnailUrl: mimeType === 'image/png' ? `https://picsum.photos/seed/${index}/200/200` : undefined,
    uri: mimeType === 'application/pdf' ? `file:///documents/${name}` : undefined,
    sizeBytes: Math.floor(random() * 5000000) + 50000,
  } as Attachment;
}

export function generateHealthRecord(index: number, patientId: string = 'patient_001'): HealthRecord {
  const random = seededRandom(index + 1);
  const type = pickRandom(HEALTH_RECORD_TYPES, random);
  const titles = RECORD_TITLES[type]!;
  const title = pickRandom(titles, random);
  const daysAgo = Math.floor(random() * 1825);
  const occurredAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
  const numTags = 1 + Math.floor(random() * 3);
  const selectedTags: string[] = [];
  const availableTags = [...TAG_POOL];
  for (let i = 0; i < numTags && availableTags.length > 0; i++) {
    const idx = Math.floor(random() * availableTags.length);
    selectedTags.push(availableTags[idx]!);
    availableTags.splice(idx, 1);
  }
  const numAttachments = Math.floor(random() * 4);
  const attachments: Attachment[] = [];
  for (let i = 0; i < numAttachments; i++) {
    attachments.push(generateAttachment(index * 10 + i, random));
  }

  return {
    id: `rec_${index.toString().padStart(5, '0')}`,
    patientId,
    type,
    title: `${title} - ${RECORD_TYPE_LABELS[type]}`,
    description: `This is a ${RECORD_TYPE_LABELS[type]!.toLowerCase()} record. Generated for testing purposes.`,
    occurredAt,
    tags: selectedTags,
    attachments,
    metadata: {
      generated: true,
      recordIndex: index,
      source: 'mock',
    },
  } as HealthRecord;
}

export function generateHealthRecords(count: number, patientId?: string): HealthRecord[] {
  const records: HealthRecord[] = [];
  for (let i = 0; i < count; i++) {
    const record = generateHealthRecord(i, patientId);
    records.push(record);
  }
  return records;
}

let healthRecordCache: HealthRecord[] | null = null;
let healthRecordCachePromise: Promise<HealthRecord[]> | null = null;

export function getHealthRecordCache(): HealthRecord[] {
  if (healthRecordCache === null) {
    healthRecordCache = generateHealthRecords(10000);
  }
  return healthRecordCache;
}

export async function getHealthRecordCacheAsync(): Promise<HealthRecord[]> {
  if (healthRecordCache !== null) {
    return healthRecordCache;
  }

  if (healthRecordCachePromise === null) {
    healthRecordCachePromise = new Promise((resolve) => {
      setTimeout(() => {
        healthRecordCache = generateHealthRecords(10000);
        resolve(healthRecordCache);
      }, 0);
    });
  }

  return healthRecordCachePromise;
}

export function applyRecordFilter(records: HealthRecord[], filter: RecordFilter): HealthRecord[] {
  return records.filter((record) => {
    if (filter.searchQuery.length > 0) {
      const query = filter.searchQuery.toLowerCase();
      const titleMatch = record.title.toLowerCase().includes(query);
      const descMatch = record.description?.toLowerCase().includes(query) ?? false;
      const tagMatch = record.tags.some((tag: string) => tag.toLowerCase().includes(query));
      if (!titleMatch && !descMatch && !tagMatch) {
        return false;
      }
    }

    if (filter.types.length > 0 && !filter.types.includes(record.type)) {
      return false;
    }

    if (filter.tags.length > 0 && !filter.tags.some((tag) => record.tags.includes(tag))) {
      return false;
    }

    if (filter.fromDate !== null && record.occurredAt < filter.fromDate) {
      return false;
    }

    if (filter.toDate !== null && record.occurredAt > filter.toDate) {
      return false;
    }

    return true;
  });
}

export function groupRecordsByMonth(records: HealthRecord[]): Map<string, HealthRecord[]> {
  const groups = new Map<string, HealthRecord[]>();
  const sorted = [...records].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  for (const record of sorted) {
    const date = new Date(record.occurredAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const existing = groups.get(key);
    if (existing !== undefined) {
      existing.push(record);
    } else {
      groups.set(key, [record]);
    }
  }
  return groups;
}
