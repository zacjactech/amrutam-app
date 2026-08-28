// Health Records Module - Repository (Supabase)

import { HealthRecord, RecordFilter, PaginatedResult } from './types';
import { supabase } from '../../infrastructure/supabase/client';
import { Database } from '../../infrastructure/supabase/database.types';

type HealthRecordRow = Database['public']['Tables']['health_records']['Row'];
type AttachmentJson = {
  id: string;
  name: string;
  mimeType: 'image/jpeg' | 'image/png' | 'application/pdf';
  thumbnailUrl?: string;
  uri?: string;
  sizeBytes?: number;
};

export interface HealthRecordRepository {
  getRecords(
    filter: RecordFilter,
    pagination: { page: number; pageSize: number },
    patientId?: string,
  ): Promise<PaginatedResult<HealthRecord>>;
  getRecordById(recordId: string): Promise<HealthRecord | null>;
  searchRecords(query: string, patientId?: string): Promise<HealthRecord[]>;
}

function mapRowToRecord(row: HealthRecordRow): HealthRecord {
  const attachments = (row.attachments as AttachmentJson[]) || [];
  return {
    id: row.id,
    patientId: row.patient_id,
    type: row.type as HealthRecord['type'],
    title: row.title,
    description: row.description ?? undefined,
    occurredAt: row.occurred_at,
    tags: row.tags,
    attachments: attachments.map((a) => ({
      id: a.id,
      name: a.name,
      mimeType: a.mimeType,
      thumbnailUrl: a.thumbnailUrl,
      uri: a.uri,
      sizeBytes: a.sizeBytes,
    })),
    metadata: row.metadata as Record<string, string | number | boolean | null>,
  };
}

export class HealthRecordRepositoryImpl implements HealthRecordRepository {
  async getRecords(
    filter: RecordFilter,
    pagination: { page: number; pageSize: number },
    patientId?: string,
  ): Promise<PaginatedResult<HealthRecord>> {
    let query = supabase
      .from('health_records')
      .select('*', { count: 'exact' });

    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    if (filter.searchQuery) {
      query = query.or(`title.ilike.%${filter.searchQuery}%,description.ilike.%${filter.searchQuery}%`);
    }

    if (filter.types.length > 0) {
      query = query.in('type', filter.types);
    }

    if (filter.tags.length > 0) {
      query = query.overlaps('tags', filter.tags);
    }

    if (filter.fromDate !== null) {
      query = query.gte('occurred_at', filter.fromDate);
    }

    if (filter.toDate !== null) {
      query = query.lte('occurred_at', filter.toDate);
    }

    const from = pagination.page * pagination.pageSize;
    const to = from + pagination.pageSize - 1;

    const { data, count, error } = await query
      .order('occurred_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const records = (data || []).map(mapRowToRecord);
    const total = count || 0;

    return {
      data: records,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total,
      hasMore: total > (pagination.page + 1) * pagination.pageSize,
    };
  }

  async getRecordById(recordId: string): Promise<HealthRecord | null> {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('id', recordId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return mapRowToRecord(data);
  }

  async searchRecords(query: string, patientId?: string): Promise<HealthRecord[]> {
    let queryBuilder = supabase
      .from('health_records')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (patientId) {
      queryBuilder = queryBuilder.eq('patient_id', patientId);
    }

    const { data, error } = await queryBuilder
      .order('occurred_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return (data || []).map(mapRowToRecord);
  }
}

export const healthRecordRepository = new HealthRecordRepositoryImpl();
