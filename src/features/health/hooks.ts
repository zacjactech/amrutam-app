// Health Records Module - Hooks

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { healthRecordRepository } from './repository';
import { RecordFilter, DEFAULT_RECORD_FILTER } from './types';

export const healthKeys = {
  all: ['health'] as const,
  records: (filter: RecordFilter) => [...healthKeys.all, 'records', filter] as const,
  record: (id: string) => [...healthKeys.all, 'record', id] as const,
  timeline: () => [...healthKeys.all, 'timeline'] as const,
};

const PAGE_SIZE = 40;

export function useHealthRecords(filter: RecordFilter = DEFAULT_RECORD_FILTER) {
  return useInfiniteQuery({
    queryKey: healthKeys.records(filter),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      healthRecordRepository.getRecords(filter, { page: pageParam, pageSize: PAGE_SIZE }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useHealthRecord(recordId: string) {
  return useQuery({
    queryKey: healthKeys.record(recordId),
    queryFn: () => healthRecordRepository.getRecordById(recordId),
    enabled: recordId.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecordTimeline(filter: RecordFilter = DEFAULT_RECORD_FILTER) {
  return useQuery({
    queryKey: healthKeys.timeline(),
    queryFn: async () => {
      const result = await healthRecordRepository.getRecords(filter, { page: 0, pageSize: 1000 });
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSearchRecords(query: string) {
  return useQuery({
    queryKey: [...healthKeys.all, 'search', query],
    queryFn: () => healthRecordRepository.searchRecords(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
