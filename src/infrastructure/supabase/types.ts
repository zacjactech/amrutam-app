export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      doctors: {
        Row: {
          id: string;
          name: string;
          photo_url: string;
          specialization: string;
          experience: number;
          rating: number;
          review_count: number;
          consultation_fee: number;
          languages: string[];
          availability: Json;
          bio: string;
          clinic_name: string;
          clinic_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          photo_url: string;
          specialization: string;
          experience: number;
          rating: number;
          review_count?: number;
          consultation_fee: number;
          languages?: string[];
          availability?: Json;
          bio: string;
          clinic_name: string;
          clinic_address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          photo_url?: string;
          specialization?: string;
          experience?: number;
          rating?: number;
          review_count?: number;
          consultation_fee?: number;
          languages?: string[];
          availability?: Json;
          bio?: string;
          clinic_name?: string;
          clinic_address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      slots: {
        Row: {
          id: string;
          doctor_id: string;
          start_time: string;
          end_time: string;
          is_booked: boolean;
          consultation_type: string;
          created_at: string;
        };
        Insert: {
          id: string;
          doctor_id: string;
          start_time: string;
          end_time: string;
          is_booked?: boolean;
          consultation_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          doctor_id?: string;
          start_time?: string;
          end_time?: string;
          is_booked?: boolean;
          consultation_type?: string;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          doctor_id: string;
          patient_id: string;
          slot_id: string;
          consultation_type: string;
          status: 'pending_sync' | 'confirmed' | 'cancelled' | 'conflict' | 'failed' | 'pending_confirmation' | 'completed' | 'no_show';
          idempotency_key: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          doctor_id: string;
          patient_id: string;
          slot_id: string;
          consultation_type: string;
          status?: 'pending_sync' | 'confirmed' | 'cancelled' | 'conflict' | 'failed' | 'pending_confirmation' | 'completed' | 'no_show';
          idempotency_key: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          doctor_id?: string;
          patient_id?: string;
          slot_id?: string;
          consultation_type?: string;
          status?: 'pending_sync' | 'confirmed' | 'cancelled' | 'conflict' | 'failed' | 'pending_confirmation' | 'completed' | 'no_show';
          idempotency_key?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          price: number;
          currency: string;
          image_url: string;
          rating: number;
          review_count: number;
          stock: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          category: string;
          price: number;
          currency?: string;
          image_url: string;
          rating: number;
          review_count?: number;
          stock?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: string;
          price?: number;
          currency?: string;
          image_url?: string;
          rating?: number;
          review_count?: number;
          stock?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          patient_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          product_id: string;
          quantity?: number;
          unit_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          patient_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      health_records: {
        Row: {
          id: string;
          patient_id: string;
          type: string;
          title: string;
          description: string | null;
          occurred_at: string;
          tags: string[];
          attachments: Json;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          type: string;
          title: string;
          description?: string | null;
          occurred_at: string;
          tags?: string[];
          attachments?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          type?: string;
          title?: string;
          description?: string | null;
          occurred_at?: string;
          tags?: string[];
          attachments?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      sync_operations: {
        Row: {
          id: string;
          type: string;
          payload: Json;
          status: string;
          attempt_count: number;
          next_attempt_at: string | null;
          idempotency_key: string;
          last_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          payload: Json;
          status?: string;
          attempt_count?: number;
          next_attempt_at?: string | null;
          idempotency_key: string;
          last_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          payload?: Json;
          status?: string;
          attempt_count?: number;
          next_attempt_at?: string | null;
          idempotency_key?: string;
          last_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
