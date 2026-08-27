// Health Records Module - Zod Schemas

import { z } from 'zod';

export const healthRecordTypeSchema = z.enum([
  'lab_report',
  'prescription',
  'consultation',
  'vaccination',
  'allergy',
]);

export const attachmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(500),
  mimeType: z.enum(['image/jpeg', 'image/png', 'application/pdf']),
  thumbnailUrl: z.string().url().optional(),
  uri: z.string().url().optional(),
  sizeBytes: z.number().int().nonnegative().optional(),
});

export const healthRecordSchema = z.object({
  id: z.string().min(1),
  patientId: z.string().min(1),
  type: healthRecordTypeSchema,
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  occurredAt: z.string().datetime(),
  tags: z.array(z.string().max(50)).max(10),
  attachments: z.array(attachmentSchema).max(20),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

export const recordFilterSchema = z.object({
  searchQuery: z.string().max(200).default(''),
  types: z.array(healthRecordTypeSchema).default([]),
  tags: z.array(z.string().max(50)).default([]),
  fromDate: z.string().datetime().nullable().default(null),
  toDate: z.string().datetime().nullable().default(null),
});
