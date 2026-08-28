# API Contract and Supabase Integration

## 1. Principle

The assignment allows public or mock APIs. The application should behave as if it communicates with a real backend.

The app uses Supabase (PostgreSQL + PostgREST) as the backend, providing a managed database with Row Level Security, real-time subscriptions, and automatic API generation.

## 2. Database Tables

### Doctors

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | `doc_XXXXX` format |
| name | text | Doctor name |
| photo_url | text | Profile image URL |
| specialization | text | Ayurvedic specialization |
| experience | integer | Years of experience |
| rating | numeric(2,1) | Rating 0-5 |
| review_count | integer | Number of reviews |
| consultation_fee | integer | Fee in INR |
| languages | text[] | Supported languages |
| availability | jsonb | Availability status |
| bio | text | Doctor biography |
| clinic_name | text | Clinic name |
| clinic_address | text | Clinic address |

### Slots

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | `slot_doc_XXXXX_timestamp` |
| doctor_id | text (FK) | References doctors.id |
| start_time | timestamptz | Slot start |
| end_time | timestamptz | Slot end |
| is_booked | boolean | Booking status |
| consultation_type | text | video/audio/chat/in-person |

### Bookings

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | `bk_timestamp_random` |
| doctor_id | text (FK) | References doctors.id |
| patient_id | text | Patient identifier |
| slot_id | text (FK) | References slots.id |
| consultation_type | text | Booking type |
| status | text | pending_sync/confirmed/cancelled/etc |
| idempotency_key | text (UNIQUE) | patientId + slotId hash |
| notes | text | Optional notes |

### Products

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | `prod_XXXXX` format |
| name | text | Product name |
| description | text | Product description |
| category | text | Product category |
| price | numeric(10,2) | Price in INR |
| currency | text | ISO currency code |
| image_url | text | Product image |
| rating | numeric(2,1) | Rating 0-5 |
| review_count | integer | Number of reviews |
| stock | integer | Available stock |
| tags | text[] | Product tags |

### Health Records

| Column | Type | Description |
|--------|------|-------------|
| id | text (PK) | `rec_XXXXX` format |
| patient_id | text | Patient identifier |
| type | text | lab_report/prescription/etc |
| title | text | Record title |
| description | text | Record description |
| occurred_at | timestamptz | When record was created |
| tags | text[] | Record tags |
| attachments | jsonb | File attachments |
| metadata | jsonb | Additional data |

## 3. Supabase Queries

The app uses `@supabase/supabase-js` client for all database operations:

```ts
// Example: Fetch doctors with filters
const { data, count } = await supabase
  .from('doctors')
  .select('*', { count: 'exact' })
  .eq('specialization', 'Panchakarma')
  .gte('rating', 4.0)
  .order('rating', { ascending: false })
  .range(0, 19);

// Example: Create booking
const { data, error } = await supabase
  .from('bookings')
  .insert({
    doctor_id: doctorId,
    patient_id: patientId,
    slot_id: slotId,
    consultation_type: 'video',
    status: 'pending_sync',
    idempotency_key: idempotencyKey,
  })
  .select()
  .single();
```

## 4. Row Level Security

All tables have RLS enabled:

- **Doctors, Slots, Products**: Public read, authenticated write
- **Bookings, Cart, Wishlist, Health Records**: Authenticated read/write only

## 5. Repository Pattern

```ts
interface ConsultationRepository {
  getDoctors(filter, pagination, sortBy): Promise<PaginatedResult<Doctor>>;
  getDoctorById(id: string): Promise<Doctor | null>;
  getDoctorSlots(doctorId: string): Promise<ConsultationSlot[]>;
  getAvailableSlots(doctorId: string): Promise<ConsultationSlot[]>;
  createBooking(request: BookingRequest): Promise<Booking>;
  getBookings(patientId: string): Promise<Booking[]>;
  cancelBooking(bookingId: string): Promise<Booking | null>;
}
```

The same pattern applies to shop and health records repositories.

## 6. Booking Contract

Request:

```ts
type BookingRequest = {
  doctorId: string;
  patientId: string;
  slotId: string;
  consultationType: 'video' | 'audio' | 'chat' | 'in-person';
  notes?: string;
};
```

Idempotency:

```ts
const idempotencyKey = generateIdempotencyKey(patientId, slotId);
```

The idempotency key prevents duplicate bookings for the same patient and slot.

## 7. Pagination

Use Supabase range-based pagination:

```ts
const from = page * pageSize;
const to = from + pageSize - 1;

const { data, count } = await supabase
  .from('products')
  .select('*', { count: 'exact' })
  .range(from, to);
```

The default page size is 20 items.

## 8. Offline Support

- **Cart/Wishlist**: SQLite-only (client-owned, no server sync)
- **Bookings**: Queue in SQLite, sync to Supabase when online
- **Doctors/Products/Health Records**: Supabase as source of truth, TanStack Query caching
