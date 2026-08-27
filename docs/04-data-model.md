# Data Model

## 1. Doctor

```ts
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  consultationFee: number;
  currency: string;
  languages: string[];
  bio: string;
  isAvailable: boolean;
};
```

## 2. Consultation Slot

```ts
type ConsultationSlot = {
  id: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  status: "available" | "held" | "booked" | "expired";
  version: number;
};
```

Use ISO-8601 timestamps and perform expiry checks against a trusted current time abstraction.

## 3. Booking

```ts
type Booking = {
  id: string;
  doctorId: string;
  slotId: string;
  patientId: string;
  status:
    | "pending_sync"
    | "confirmed"
    | "cancelled"
    | "conflict"
    | "failed";
  createdAt: string;
  updatedAt: string;
  syncOperationId?: string;
};
```

## 4. Product

```ts
type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
};
```

## 5. Cart Item

```ts
type CartItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  updatedAt: string;
};
```

## 6. Health Record

```ts
type HealthRecord = {
  id: string;
  patientId: string;
  type:
    | "lab_report"
    | "prescription"
    | "consultation"
    | "vaccination"
    | "allergy";
  title: string;
  description?: string;
  occurredAt: string;
  tags: string[];
  attachments: Attachment[];
  metadata: Record<string, string | number | boolean | null>;
};
```

## 7. Attachment

```ts
type Attachment = {
  id: string;
  name: string;
  mimeType: "image/jpeg" | "image/png" | "application/pdf";
  thumbnailUrl?: string;
  uri?: string;
  sizeBytes?: number;
};
```

## 8. Sync Operation

```ts
type SyncOperation = {
  id: string;
  type: "CREATE_BOOKING" | "CANCEL_BOOKING";
  payload: unknown;
  status: "queued" | "processing" | "succeeded" | "failed";
  attemptCount: number;
  nextAttemptAt?: string;
  idempotencyKey: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
};
```

## 9. Local Tables

Recommended SQLite tables:

```text
cart_items
wishlist_items
bookings
health_records
sync_operations
sync_metadata
```

Large remote collections such as products should be cached in pages rather than copied into a single giant table unless the implementation requires fully offline browsing.

## 10. Booking Uniqueness

The local queue must use a unique `idempotencyKey`.

Recommended logical key:

```text
patientId + slotId
```

The mock server should also reject duplicate idempotency keys.

This prevents retries from creating duplicate bookings.
