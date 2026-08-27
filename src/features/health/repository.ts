// Health Records Module - Repository

import { z } from 'zod';
import { HealthRecord, RecordFilter, PaginatedResult, Attachment } from './types';
import { shouldFail, createFailureError } from '../../infrastructure/testing/failureInjector';
import { apiRequest } from '../../infrastructure/api/apiClient';
import { healthRecordSchema } from '../../domain/schemas';

export interface HealthRecordRepository {
  getRecords(
    filter: RecordFilter,
    pagination: { page: number; pageSize: number },
  ): Promise<PaginatedResult<HealthRecord>>;
  getRecordById(recordId: string): Promise<HealthRecord | null>;
  searchRecords(query: string): Promise<HealthRecord[]>;
}

function normalizeRecord(record: z.infer<typeof healthRecordSchema>): HealthRecord {
  return {
    ...record,
    description: record.description ?? '',
    attachments: record.attachments.map((a): Attachment => ({
      id: a.id,
      name: a.name,
      mimeType: a.mimeType,
      thumbnailUrl: a.thumbnailUrl ?? undefined,
      uri: a.uri ?? undefined,
      sizeBytes: a.sizeBytes ?? undefined,
    })),
  };
}

export class MockHealthRecordRepository implements HealthRecordRepository {
  async getRecords(
    filter: RecordFilter,
    pagination: { page: number; pageSize: number },
  ): Promise<PaginatedResult<HealthRecord>> {
    const failure = shouldFail({ endpoint: '/health-records', method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const params = new URLSearchParams({
      _page: String(pagination.page + 1),
      _limit: String(pagination.pageSize),
    });

    if (filter.searchQuery) {
      params.set('q', filter.searchQuery);
    }

    const records = await apiRequest(
      { method: 'GET', endpoint: `/healthRecords?${params.toString()}` },
      z.array(healthRecordSchema),
    );

    const filtered = records.filter((record) => {
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

    const total = filtered.length;
    const hasMore = total > pagination.pageSize;

    return {
      data: filtered.map(normalizeRecord),
      page: pagination.page,
      pageSize: pagination.pageSize,
      total,
      hasMore,
    };
  }

  async getRecordById(recordId: string): Promise<HealthRecord | null> {
    const failure = shouldFail({ endpoint: `/health-records/${recordId}`, method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    try {
      const record = await apiRequest(
        { method: 'GET', endpoint: `/healthRecords/${recordId}` },
        healthRecordSchema,
      );
      return normalizeRecord(record);
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') {
        return null;
      }
      throw error;
    }
  }

  async searchRecords(query: string): Promise<HealthRecord[]> {
    const failure = shouldFail({ endpoint: '/health-records/search', method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const records = await apiRequest(
      { method: 'GET', endpoint: `/healthRecords?q=${encodeURIComponent(query)}` },
      z.array(healthRecordSchema),
    );

    return records.map(normalizeRecord);
  }
}

export const healthRecordRepository = new MockHealthRecordRepository();
