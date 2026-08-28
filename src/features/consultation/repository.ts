// Consultation Module - Repository (Supabase)

import { Doctor, ConsultationSlot, Booking, DoctorFilter } from './types';
import { generateIdempotencyKey } from '../../domain/businessLogic';
import { supabase } from '../../infrastructure/supabase/client';
import { Database } from '../../infrastructure/supabase/database.types';

type DoctorRow = Database['public']['Tables']['doctors']['Row'];
type SlotRow = Database['public']['Tables']['slots']['Row'];
type BookingRow = Database['public']['Tables']['bookings']['Row'];

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface BookingRequest {
  doctorId: string;
  patientId: string;
  slotId: string;
  consultationType: 'video' | 'audio' | 'chat' | 'in-person';
  notes?: string;
}

function mapDoctorRowToDoctor(row: DoctorRow): Doctor {
  const availability = row.availability as { isAvailable: boolean; nextAvailableSlot: string | null; slotDuration: number };
  return {
    id: row.id,
    name: row.name,
    photoUrl: row.photo_url,
    specialization: row.specialization,
    experience: row.experience,
    rating: row.rating,
    reviewCount: row.review_count,
    consultationFee: row.consultation_fee,
    languages: row.languages,
    availability: {
      isAvailable: availability.isAvailable,
      nextAvailableSlot: availability.nextAvailableSlot,
      slotDuration: availability.slotDuration,
    },
    bio: row.bio,
    clinicName: row.clinic_name,
    clinicAddress: row.clinic_address,
  };
}

function mapSlotRowToSlot(row: SlotRow): ConsultationSlot {
  return {
    id: row.id,
    doctorId: row.doctor_id,
    startTime: row.start_time,
    endTime: row.end_time,
    isBooked: row.is_booked,
    consultationType: row.consultation_type as ConsultationSlot['consultationType'],
  };
}

function mapBookingRowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    doctorId: row.doctor_id,
    patientId: row.patient_id,
    slotId: row.slot_id,
    consultationType: row.consultation_type as Booking['consultationType'],
    status: row.status as Booking['status'],
    idempotencyKey: row.idempotency_key,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const consultationRepository = {
  async getDoctors(
    filter: DoctorFilter,
    pagination: PaginationParams,
    sortBy: 'rating' | 'experience' | 'fee' | 'name' = 'rating',
  ): Promise<PaginatedResult<Doctor>> {
    const sortColumn = sortBy === 'fee' ? 'consultation_fee' : sortBy;

    let query = supabase
      .from('doctors')
      .select('*', { count: 'exact' });

    if (filter.searchQuery) {
      query = query.or(`name.ilike.%${filter.searchQuery}%,specialization.ilike.%${filter.searchQuery}%,clinic_name.ilike.%${filter.searchQuery}%`);
    }

    if (filter.specialization) {
      query = query.eq('specialization', filter.specialization);
    }

    if (filter.minExperience !== null) {
      query = query.gte('experience', filter.minExperience);
    }

    if (filter.maxFee !== null) {
      query = query.lte('consultation_fee', filter.maxFee);
    }

    if (filter.minRating !== null) {
      query = query.gte('rating', filter.minRating);
    }

    if (filter.language) {
      query = query.contains('languages', [filter.language]);
    }

    if (filter.availableOnly) {
      query = query.eq('availability->isAvailable', true);
    }

    const from = pagination.page * pagination.pageSize;
    const to = from + pagination.pageSize - 1;

    const { data, count, error } = await query
      .order(sortColumn, { ascending: sortBy === 'name' })
      .range(from, to);

    if (error) throw error;

    const doctors = (data || []).map(mapDoctorRowToDoctor);
    const total = count || 0;

    return {
      data: doctors,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      hasMore: total > (pagination.page + 1) * pagination.pageSize,
    };
  },

  async getDoctorById(doctorId: string): Promise<Doctor | null> {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return mapDoctorRowToDoctor(data);
  },

  async getDoctorSlots(doctorId: string): Promise<ConsultationSlot[]> {
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('start_time', { ascending: true });

    if (error) throw error;

    return (data || []).map(mapSlotRowToSlot);
  },

  async getAvailableSlots(doctorId: string): Promise<ConsultationSlot[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('is_booked', false)
      .gte('start_time', now)
      .order('start_time', { ascending: true });

    if (error) throw error;

    return (data || []).map(mapSlotRowToSlot);
  },

  async createBooking(request: BookingRequest): Promise<Booking> {
    const idempotencyKey = generateIdempotencyKey(request.patientId, request.slotId);
    const bookingId = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        id: bookingId,
        doctor_id: request.doctorId,
        patient_id: request.patientId,
        slot_id: request.slotId,
        consultation_type: request.consultationType,
        status: 'pending_sync',
        idempotency_key: idempotencyKey,
        notes: request.notes ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    return mapBookingRowToBooking(data);
  },

  async getBookings(patientId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(mapBookingRowToBooking);
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return mapBookingRowToBooking(data);
  },

  async cancelBooking(bookingId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return mapBookingRowToBooking(data);
  },
};
