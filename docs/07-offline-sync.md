# Offline-First and Synchronization Design

## 1. Goals

The app must:

- Show cached data when offline.
- Keep cart operations available offline.
- Queue bookings while offline.
- Synchronize automatically after reconnection.
- Avoid duplicate mutations.
- Surface conflicts rather than silently overwriting data.

## 2. Connectivity

Use NetInfo as the connectivity source and connect it to TanStack Query's online manager.

Connectivity is advisory, not proof that the server is reachable. A request can still fail when the device reports online.

Note: TanStack Query's persistence uses AsyncStorage by default. For large cached datasets, consider selective SQLite persistence instead, as AsyncStorage can become a bottleneck with large payloads.

## 2a. Key-Value Storage

For small, frequently-accessed data, use MMKV instead of AsyncStorage:

| Data | Storage |
|---|---|
| Theme preference | MMKV |
| Feature flags | MMKV |
| UI preferences | MMKV |
| Session metadata | MMKV or SecureStorage |
| Structured domain data | SQLite |
| Large cached responses | SQLite (selective) |

## 3. Cache Strategy

### Doctors

Cache recent list/query results.

### Products

Cache recently viewed/list pages. Do not attempt to persist all 20,000 products.

### Health Records

Persist the patient's recent records and metadata needed for offline timeline browsing.

### Cart

Persist all cart items.

### Bookings

Persist upcoming and pending bookings.

## 4. Mutation Queue

The queue is durable.

```text
sync_operations
--------------------------------
id
type
payload
status
attempt_count
idempotency_key
next_attempt_at
last_error
created_at
updated_at
```

## 5. Queue Processing

When network becomes available:

```text
1. Acquire sync lock.
2. Read queued operations ordered by creation time.
3. Mark operation as processing.
4. Submit with idempotency key.
5. On success, mark succeeded.
6. On conflict, mark failed/conflict and notify UI.
7. On retryable failure, increment attempt count.
8. Calculate next retry time.
9. Release lock.
```

## 6. Retry Policy

Use bounded exponential backoff with jitter.

Example:

```text
attempt 1 → ~1s
attempt 2 → ~2s
attempt 3 → ~4s
attempt 4 → ~8s
attempt 5 → stop/requires user action
```

Do not retry:

- Slot expired
- Slot conflict
- Validation error
- Session expired without a valid refresh path

Retry:

- Timeout
- Temporary server failure
- Network failure

## 7. Idempotency

Every queued booking receives a stable idempotency key.

Never generate a new key for each retry.

```text
booking operation
  id = local operation UUID
  idempotencyKey = stable UUID
```

## 8. Conflict Handling

A booking conflict must result in:

```text
pending → conflict
```

The UI should explain that the slot is no longer available and allow the patient to select another slot.

Do not automatically choose another appointment time.

## 9. Sync State UI

Use explicit states:

- Synced
- Pending
- Syncing
- Failed
- Conflict

A small global connection indicator can show offline status without blocking the whole application.

## 10. Local Clock Risk

Slot expiry must be checked against server timestamps when online. When offline, local time can be used as an approximation but the booking must be revalidated remotely before becoming confirmed.
