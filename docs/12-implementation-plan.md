# Implementation Plan

## Phase 0 — Foundation

- [ ] Create React Native TypeScript project without a boilerplate starter kit.
- [ ] Enable strict TypeScript.
- [ ] Install React Navigation.
- [ ] Configure ESLint and Prettier.
- [ ] Add environment configuration.
- [ ] Add logger.
- [ ] Add Error Boundary.
- [ ] Add global Toast.
- [ ] Add theme provider/tokens.
- [ ] Add NetInfo.
- [ ] Add TanStack Query.
- [ ] Add Zustand.
- [ ] Add SQLite abstraction.
- [ ] Add API client.
- [ ] Add mock repositories.
- [ ] Add test infrastructure.

## Phase 1 — Navigation and Shell

```text
Splash/Bootstrap
 ↓
Main Tabs
 ├── Home
 ├── Consultations
 ├── Shop
 └── Health Records
```

Build the shared shell before feature implementation.

## Phase 2 — Consultation

Order:

1. Domain types.
2. Mock doctor generator.
3. Repository.
4. Query hooks.
5. Doctor list.
6. Search/filter.
7. Doctor details.
8. Slot picker.
9. Booking use case.
10. Booking conflict/expiry logic.
11. Upcoming consultations.
12. Cancellation.
13. Offline queue.

## Phase 3 — Shop

Order:

1. Product generator.
2. Paginated repository.
3. Infinite query.
4. Product list.
5. Search/filter/sort.
6. Product details.
7. SQLite cart.
8. Wishlist.
9. Checkout summary.
10. Persistence test.

## Phase 4 — Health Records

Order:

1. Record generator.
2. Repository.
3. Paginated query.
4. Timeline grouping.
5. Search/filter.
6. Tags.
7. Attachment thumbnails.
8. Preview screen.

## Phase 5 — Reliability

Implement deterministic mock failures:

```text
timeout
server error
invalid JSON
empty
partial
session expired
```

Then verify every feature has a recoverable state.

## Phase 6 — Performance

Generate:

```text
5,000 doctors
20,000 products
10,000 health records
```

Validate:

- Virtualization.
- Pagination.
- Memoization.
- Stable keys.
- Query behavior.
- Memory growth.

## Phase 7 — Testing

Priority order:

1. Booking business rules.
2. Cart persistence.
3. Offline queue.
4. Error classification.
5. Product pagination.
6. Health timeline grouping.
7. E2E booking flow.

## Phase 8 — Polish

- [ ] Dark mode.
- [ ] Accessibility.
- [ ] Empty states.
- [ ] Skeletons.
- [ ] Error messages.
- [ ] Toasts.
- [ ] Demo data.
- [ ] README.
- [ ] Architecture diagram.
- [ ] Screenshots/video.

## Commit Strategy

Use focused commits:

```text
chore: initialize mobile architecture
feat: add shared design system
feat: add consultation module
feat: add booking conflict handling
feat: add shop module
feat: add offline cart
feat: add health records timeline
feat: add offline booking queue
test: add booking business rules
perf: optimize large list rendering
docs: add architecture and setup documentation
```
