-- Amrutam Database Schema
-- Migration: 20260827000000_initial_schema

-- gen_random_uuid() is built into PostgreSQL 13+

-- ─── Sequences (must exist before tables that use them) ──────────────────────
CREATE SEQUENCE doctors_id_seq START 1;
CREATE SEQUENCE products_id_seq START 1;
CREATE SEQUENCE health_records_id_seq START 1;

-- ─── Doctors ─────────────────────────────────────────────────────────────────

CREATE TABLE doctors (
  id TEXT PRIMARY KEY DEFAULT 'doc_' || lpad(nextval('doctors_id_seq')::text, 5, '0'),
  name TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience INTEGER NOT NULL CHECK (experience > 0),
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0,
  consultation_fee INTEGER NOT NULL,
  languages TEXT[] NOT NULL DEFAULT ARRAY['English'],
  availability JSONB NOT NULL DEFAULT '{"isAvailable": true, "nextAvailableSlot": null, "slotDuration": 30}',
  bio TEXT NOT NULL,
  clinic_name TEXT NOT NULL,
  clinic_address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Consultation Slots ──────────────────────────────────────────────────────

CREATE TABLE slots (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT FALSE,
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('video', 'audio', 'chat', 'in-person')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_slots_doctor_id ON slots(doctor_id);
CREATE INDEX idx_slots_start_time ON slots(start_time);
CREATE INDEX idx_slots_doctor_booked ON slots(doctor_id, is_booked);

-- ─── Bookings ────────────────────────────────────────────────────────────────

CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL REFERENCES doctors(id),
  patient_id TEXT NOT NULL,
  slot_id TEXT NOT NULL REFERENCES slots(id),
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('video', 'audio', 'chat', 'in-person')),
  status TEXT NOT NULL DEFAULT 'pending_sync' CHECK (status IN ('pending_sync', 'confirmed', 'cancelled', 'conflict', 'failed', 'pending_confirmation', 'completed', 'no_show')),
  idempotency_key TEXT NOT NULL UNIQUE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_patient ON bookings(patient_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_slot ON bookings(slot_id);

-- ─── Products ────────────────────────────────────────────────────────────────

CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT 'prod_' || lpad(nextval('products_id_seq')::text, 5, '0'),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  image_url TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_stock ON products(stock);

-- ─── Cart Items ──────────────────────────────────────────────────────────────

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_patient_product UNIQUE (patient_id, product_id)
);

CREATE INDEX idx_cart_patient ON cart_items(patient_id);

-- ─── Wishlist Items ──────────────────────────────────────────────────────────

CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_wishlist UNIQUE (patient_id, product_id)
);

CREATE INDEX idx_wishlist_patient ON wishlist_items(patient_id);

-- ─── Health Records ──────────────────────────────────────────────────────────

CREATE TABLE health_records (
  id TEXT PRIMARY KEY DEFAULT 'rec_' || lpad(nextval('health_records_id_seq')::text, 5, '0'),
  patient_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lab_report', 'prescription', 'consultation', 'vaccination', 'allergy')),
  title TEXT NOT NULL,
  description TEXT,
  occurred_at TIMESTAMPTZ NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  attachments JSONB NOT NULL DEFAULT '[]',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_health_records_patient ON health_records(patient_id);
CREATE INDEX idx_health_records_type ON health_records(type);
CREATE INDEX idx_health_records_occurred ON health_records(occurred_at DESC);

-- ─── Sync Operations ─────────────────────────────────────────────────────────

CREATE TABLE sync_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('CREATE_BOOKING', 'CANCEL_BOOKING')),
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'succeeded', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ,
  idempotency_key TEXT NOT NULL UNIQUE,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_status ON sync_operations(status);
CREATE INDEX idx_sync_next_attempt ON sync_operations(next_attempt_at) WHERE status IN ('queued', 'failed');

-- ─── Updated At Trigger ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sync_operations_updated_at BEFORE UPDATE ON sync_operations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
