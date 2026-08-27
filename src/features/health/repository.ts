// Health Records Module - Repository

import { HealthRecord, RecordFilter, PaginatedResult } from './types';
import { getHealthRecordCache, applyRecordFilter } from './generator';
import { shouldFail, createFailureError } from '../../infrastructure/testing/failureInjector';

export interface HealthRecordRepository {
  getRecords(
    filter: RecordFilter,
    pagination: { page: number; pageSize: number },
  ): Promise<PaginatedResult<HealthRecord>>;
  getRecordById(recordId: string): Promise<HealthRecord | null>;
  searchRecords(query: string): Promise<HealthRecord[]>;
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

    const all = getHealthRecordCache();
    const filtered = applyRecordFilter(all, filter);
    const start = pagination.page * pagination.pageSize;
    const end = start + pagination.pageSize;
    const page = filtered.slice(start, end);
    return {
      data: page,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: filtered.length,
      hasMore: end < filtered.length,
    };
  }

  async getRecordById(recordId: string): Promise<HealthRecord | null> {
    const failure = shouldFail({ endpoint: `/health-records/${recordId}`, method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const all = getHealthRecordCache();
    return all.find((record) => record.id === recordId) ?? null;
  }

  async searchRecords(query: string): Promise<HealthRecord[]> {
    const failure = shouldFail({ endpoint: '/health-records/search', method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const all = getHealthRecordCache();
    const lower = query.toLowerCase();
    return all.filter((record) => {
      const titleMatch = record.title.toLowerCase().includes(lower);
      const descMatch = record.description?.toLowerCase().includes(lower) ?? false;
      const tagMatch = record.tags.some((tag) => tag.toLowerCase().includes(lower));
      return titleMatch || descMatch || tagMatch;
    });
  }
}

export const healthRecordRepository = new MockHealthRecordRepository();
