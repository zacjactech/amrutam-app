# API Contract and Mock Server Specification

## 1. Principle

The assignment allows public or mock APIs. The application should behave as if it communicates with a real backend.

The API adapter must therefore define stable contracts before mock implementation.

## 2. Endpoints

### Doctors

```http
GET /doctors
GET /doctors/:doctorId
GET /doctors/:doctorId/slots
```

Query parameters:

```text
search
specialty
minRating
maxFee
available
page
limit
```

### Bookings

```http
POST /bookings
GET /bookings/upcoming
POST /bookings/:bookingId/cancel
```

### Products

```http
GET /products
GET /products/:productId
```

Query parameters:

```text
search
category
minPrice
maxPrice
minRating
sort
page
limit
```

### Health Records

```http
GET /health-records
GET /health-records/:recordId
```

Query parameters:

```text
search
type
tag
from
to
page
limit
```

## 3. Standard Response Envelope

```ts
type ApiResponse<T> = {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNextPage?: boolean;
    requestId?: string;
  };
};
```

## 4. Error Envelope

```ts
type ApiErrorResponse = {
  error: {
    code:
      | "VALIDATION_ERROR"
      | "NOT_FOUND"
      | "SLOT_EXPIRED"
      | "SLOT_CONFLICT"
      | "SESSION_EXPIRED"
      | "TIMEOUT"
      | "SERVER_ERROR"
      | "INVALID_RESPONSE";
    message: string;
    requestId?: string;
    details?: unknown;
  };
};
```

## 5. Booking Contract

Request:

```ts
type CreateBookingRequest = {
  patientId: string;
  doctorId: string;
  slotId: string;
  idempotencyKey: string;
};
```

Success:

```text
201 Created
```

Conflict:

```text
409 Conflict
code = SLOT_CONFLICT
```

Expired:

```text
409 Conflict
code = SLOT_EXPIRED
```

## 6. Mock Failure Injection

The mock API should support deterministic failure scenarios during development:

```text
?failure=timeout
?failure=server
?failure=invalid-json
?failure=partial
?failure=empty
?failure=session-expired
```

This makes reliability testable rather than theoretical.

## 7. Pagination

Use page/limit pagination as the default for mock implementation. The default page size should be 40 items for products.

Use cursor pagination if the mock implementation supports it. Otherwise use page/limit.

The UI must consume a pagination abstraction so the backend mechanism can later be changed.

## 8. API Repository Interface

```ts
interface ConsultationRepository {
  listDoctors(params: DoctorQuery): Promise<Paginated<Doctor>>;
  getDoctor(id: string): Promise<Doctor>;
  getSlots(doctorId: string): Promise<ConsultationSlot[]>;
  createBooking(input: CreateBookingRequest): Promise<Booking>;
  listUpcomingBookings(): Promise<Booking[]>;
  cancelBooking(id: string): Promise<Booking>;
}
```

The same pattern applies to shop and health records.
