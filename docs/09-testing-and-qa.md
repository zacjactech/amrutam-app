# Testing and QA Strategy

## 1. Testing Pyramid

```text
                 E2E
                /   \
          Integration
          /          \
       Component   Hooks
          \          /
             Unit
```

Prioritize business rules and reliability over snapshot volume.

## 2. Unit Tests

Test pure functions:

- Product price calculation
- Cart quantity rules
- Filter builders
- Sort functions
- Date grouping
- Slot expiry
- Retry classification
- Backoff calculation
- Idempotency key generation

## 3. Hook/Application Tests

Test:

- Doctor search/filter behavior
- Product pagination
- Cart mutations
- Booking mutation
- Cancellation
- Offline booking queue
- Sync result handling

## 4. Component Tests

Test:

- Loading states
- Empty states
- Error states
- Disabled buttons
- Accessibility labels
- Conflict messages
- Pending sync indicators

## 5. Required Business Cases

### Booking

- Available slot → booking succeeds.
- Expired slot → rejected.
- Already booked slot → conflict.
- Duplicate idempotency key → no duplicate booking.
- Offline → queued.
- Reconnect → synchronized.
- Temporary network failure → retry.
- Validation error → no retry.

### Cart

- Add product.
- Increase quantity.
- Decrease quantity.
- Remove product.
- Persist across restart.
- Continue offline.

### Records

- Group by month/year.
- Search.
- Filter by type.
- Filter by tag.
- Attachment preview state.

## 6. E2E Flow

Recommended single E2E flow:

```text
Launch
 ↓
Consultations
 ↓
Search doctor
 ↓
Open doctor
 ↓
Select available slot
 ↓
Confirm booking
 ↓
Open upcoming consultations
 ↓
Verify booking
```

A second optional flow should test offline booking and synchronization.

## 7. Failure Injection Tests

The mock API should expose deterministic failures for:

- Timeout
- 500
- Invalid JSON
- Empty response
- Partial response
- Session expired

The application should produce stable, user-friendly error states for each.

## 8. QA Checklist

- [ ] App launches from clean install.
- [ ] Navigation works on all required screens.
- [ ] Doctor search works.
- [ ] Doctor filters work.
- [ ] Doctor slot selection works.
- [ ] Expired slots are rejected.
- [ ] Double booking is rejected.
- [ ] Booking cancellation works.
- [ ] Product infinite scrolling works.
- [ ] Product filters work.
- [ ] Product sorting works.
- [ ] Cart persists after restart.
- [ ] Wishlist works.
- [ ] Health records group correctly.
- [ ] Health record filters/search work.
- [ ] Attachment preview works.
- [ ] Offline cached reads work.
- [ ] Offline cart works.
- [ ] Offline booking queues.
- [ ] Reconnection triggers sync.
- [ ] Sync conflicts are visible.
- [ ] Timeout has recovery UI.
- [ ] Invalid payload does not crash app.
- [ ] Session expiration has recovery path.
- [ ] Dark mode works.
- [ ] Accessibility labels exist.
- [ ] Large-list scrolling is tested.
