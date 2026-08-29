// Health Records Module - Hooks

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { healthRecordRepository } from './repository';
import { RecordFilter, DEFAULT_RECORD_FILTER } from './types';
import { useAuthContext } from '../../infrastructure/auth/AuthContext';

export const healthKeys = {
  all: ['health'] as const,
  records: (filter: RecordFilter) => [...healthKeys.all, 'records', filter] as const,
  record: (id: string) => [...healthKeys.all, 'record', id] as const,
  timeline: () => [...healthKeys.all, 'timeline'] as const,
};

const PAGE_SIZE = 40;

export function useHealthRecords(filter: RecordFilter = DEFAULT_RECORD_FILTER) {
  const { patientId, isAuthenticated } = useAuthContext();

  return useInfiniteQuery({
    queryKey: [...healthKeys.records(filter), patientId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      healthRecordRepository.getRecords(filter, { page: pageParam, pageSize: PAGE_SIZE }, patientId!),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: isAuthenticated && patientId !== null,
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
  const { patientId, isAuthenticated } = useAuthContext();

  return useInfiniteQuery({
    queryKey: [...healthKeys.timeline(), patientId, filter],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      healthRecordRepository.getRecords(filter, { page: pageParam, pageSize: PAGE_SIZE }, patientId!),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: isAuthenticated && patientId !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSearchRecords(query: string) {
  const { patientId, isAuthenticated } = useAuthContext();

  return useQuery({
    queryKey: [...healthKeys.all, 'search', query, patientId],
    queryFn: () => healthRecordRepository.searchRecords(query, patientId!),
    enabled: isAuthenticated && query.length > 0 && patientId !== null,
    staleTime: 5 * 60 * 1000,
  });
}
