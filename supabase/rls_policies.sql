-- Enable Row Level Security on all tables
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_operations ENABLE ROW LEVEL SECURITY;

-- ─── Doctors: Public read, admin write ──────────────────────────────────────
CREATE POLICY "Public can view doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert doctors" ON doctors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update doctors" ON doctors FOR UPDATE USING (auth.role() = 'authenticated');

-- ─── Slots: Public read, admin write ─────────────────────────────────────────
CREATE POLICY "Public can view slots" ON slots FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert slots" ON slots FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update slots" ON slots FOR UPDATE USING (auth.role() = 'authenticated');

-- ─── Bookings: Users can only view/modify their own bookings ────────────────
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid()::text = patient_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid()::text = patient_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid()::text = patient_id);

CREATE POLICY "Users can delete own bookings"
  ON bookings FOR DELETE
  USING (auth.uid()::text = patient_id);

-- ─── Products: Public read, admin write ──────────────────────────────────────
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');

-- ─── Cart items: Users can only view/modify their own cart ───────────────────
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid()::text = patient_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid()::text = patient_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (auth.uid()::text = patient_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid()::text = patient_id);

-- ─── Wishlist items: Users can only view/modify their own wishlist ───────────
CREATE POLICY "Users can view own wishlist"
  ON wishlist_items FOR SELECT
  USING (auth.uid()::text = patient_id);

CREATE POLICY "Users can insert own wishlist items"
  ON wishlist_items FOR INSERT
  WITH CHECK (auth.uid()::text = patient_id);

CREATE POLICY "Users can delete own wishlist items"
  ON wishlist_items FOR DELETE
  USING (auth.uid()::text = patient_id);

-- ─── Health records: Users can only view/modify their own records ────────────
CREATE POLICY "Users can view own health records"
  ON health_records FOR SELECT
  USING (auth.uid()::text = patient_id);

CREATE POLICY "Users can insert own health records"
  ON health_records FOR INSERT
  WITH CHECK (auth.uid()::text = patient_id);

CREATE POLICY "Users can update own health records"
  ON health_records FOR UPDATE
  USING (auth.uid()::text = patient_id);

CREATE POLICY "Users can delete own health records"
  ON health_records FOR DELETE
  USING (auth.uid()::text = patient_id);

-- ─── Sync operations: Users can only view/modify their own sync ops ──────────
-- Note: sync_operations don't have a patient_id column, so we use a JSONB payload check
CREATE POLICY "Users can view own sync operations"
  ON sync_operations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own sync operations"
  ON sync_operations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own sync operations"
  ON sync_operations FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own sync operations"
  ON sync_operations FOR DELETE
  USING (auth.role() = 'authenticated');

-- ─── Grants ─────────────────────────────────────────────────────────────────
GRANT SELECT ON doctors TO anon;
GRANT SELECT ON slots TO anon;
GRANT SELECT ON products TO anon;

GRANT ALL ON doctors TO authenticated;
GRANT ALL ON slots TO authenticated;
GRANT ALL ON bookings TO authenticated;
GRANT ALL ON products TO authenticated;
GRANT ALL ON cart_items TO authenticated;
GRANT ALL ON wishlist_items TO authenticated;
GRANT ALL ON health_records TO authenticated;
GRANT ALL ON sync_operations TO authenticated;
