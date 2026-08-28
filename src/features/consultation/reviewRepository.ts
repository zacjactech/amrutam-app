// Consultation Module - Review Repository (Supabase)

import { DoctorReview } from './types';
import { supabase } from '../../infrastructure/supabase/client';
import { Database } from '../../infrastructure/supabase/database.types';

type ReviewRow = Database['public']['Tables']['doctor_reviews']['Row'];

function mapReviewRowToReview(row: ReviewRow): DoctorReview {
  return {
    id: row.id,
    bookingId: row.booking_id,
    doctorId: row.doctor_id,
    patientId: row.patient_id,
    rating: row.rating,
    comment: row.comment ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface SubmitReviewRequest {
  bookingId: string;
  doctorId: string;
  patientId: string;
  rating: number;
  comment?: string;
}

export const reviewRepository = {
  async submitReview(request: SubmitReviewRequest): Promise<DoctorReview> {
    const reviewId = `rv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const { data, error } = await supabase
      .from('doctor_reviews')
      .insert({
        id: reviewId,
        booking_id: request.bookingId,
        doctor_id: request.doctorId,
        patient_id: request.patientId,
        rating: request.rating,
        comment: request.comment ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    // Update doctor's aggregate rating
    await this.updateDoctorRating(request.doctorId);

    return mapReviewRowToReview(data);
  },

  async getReviewsByDoctor(doctorId: string): Promise<DoctorReview[]> {
    const { data, error } = await supabase
      .from('doctor_reviews')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(mapReviewRowToReview);
  },

  async getReviewByBooking(bookingId: string): Promise<DoctorReview | null> {
    const { data, error } = await supabase
      .from('doctor_reviews')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return mapReviewRowToReview(data);
  },

  async hasPatientReviewedBooking(patientId: string, bookingId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('doctor_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patientId)
      .eq('booking_id', bookingId);

    if (error) throw error;

    return (count ?? 0) > 0;
  },

  async updateDoctorRating(doctorId: string): Promise<void> {
    // Fetch all reviews for this doctor
    const { data: reviews, error: fetchError } = await supabase
      .from('doctor_reviews')
      .select('rating')
      .eq('doctor_id', doctorId);

    if (fetchError) throw fetchError;

    if (!reviews || reviews.length === 0) return;

    // Calculate new average
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;
    const roundedRating = Math.round(avgRating * 10) / 10;

    // Update doctor record
    const { error: updateError } = await supabase
      .from('doctors')
      .update({
        rating: roundedRating,
        review_count: reviews.length,
        updated_at: new Date().toISOString(),
      })
      .eq('id', doctorId);

    if (updateError) throw updateError;
  },
};
