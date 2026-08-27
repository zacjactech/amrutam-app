# State Management and Data Flow

## 1. State Categories

### Server State

Examples:

- Doctors
- Slots
- Products
- Health records
- Upcoming bookings

Owner: TanStack Query.

### Client State

Examples:

- Theme
- UI preferences
- Temporary view state

Owner: Zustand or local component state.

### Durable Local State

Examples:

- Cart
- Wishlist
- Offline booking queue
- Pending sync operations

Owner: SQLite.

## 2. Query Key Conventions

```text
["doctors", filters]
["doctor", doctorId]
["doctor-slots", doctorId, date]
["upcoming-bookings"]
["products", filters]
["product", productId]
["health-records", filters]
["health-record", recordId]
```

Keep keys deterministic and serializable.

## 3. Product Infinite Query

```text
Screen
 ↓
useInfiniteProducts(filters)
 ↓
TanStack Query
 ↓
Repository
 ↓
API
```

Each page should contain only the required amount of records.

## 4. Cart Flow

```text
User taps Add
 ↓
Cart use case
 ↓
SQLite transaction
 ↓
Cart query/store invalidation
 ↓
UI updates
```

The cart should not depend on the network.

## 5. Booking Flow

Online:

```text
Select slot
 ↓
Validate local expiry
 ↓
Create booking mutation
 ↓
API
 ├── success → confirmed
 ├── conflict → conflict
 └── failure → error/retry
```

Offline:

```text
Select slot
 ↓
Validate locally
 ↓
Create pending booking
 ↓
Insert sync operation
 ↓
Show "Pending sync"
 ↓
Connectivity returns
 ↓
Sync worker
 ↓
API
 ├── success → confirmed
 ├── conflict → conflict
 └── retryable failure → queued again
```

## 6. Optimistic UI

Use optimistic updates only where rollback behavior is deterministic.

Good candidate:

- Cart quantity
- Wishlist toggle

Do not blindly optimistic-update a booking to "confirmed". Offline booking should explicitly show a pending state.

## 7. Query Invalidation

After successful booking:

```text
invalidate:
  ["upcoming-bookings"]
  ["doctor-slots", doctorId]
```

After cancellation:

```text
invalidate:
  ["upcoming-bookings"]
  ["doctor-slots", doctorId]
```

## 8. Selector Discipline

Components should subscribe to the smallest state slice possible.

Avoid:

```ts
const entireStore = useStore();
```

Prefer:

```ts
const cartCount = useCartStore(state => state.totalItems);
```

This reduces unnecessary renders.
