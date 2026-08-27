# Amrutam Senior React Native Assignment — Project Charter

## 1. Purpose

Build a production-oriented Ayurvedic Super App mobile application with three independent modules:

1. Consultation
2. Shop
3. Health Records

The implementation is evaluated primarily on architecture, maintainability, performance, offline reliability, testing, and developer experience rather than pixel-perfect visual reproduction.

The assignment specifies a 72-hour time limit with an expected effort of 8–12 hours. The implementation should therefore demonstrate senior engineering decisions without introducing infrastructure that is unnecessary for the assessment.

## 2. Success Criteria

The application is successful when it:

- Implements the three required modules end-to-end.
- Handles large mocked datasets without obvious UI lag.
- Works with cached data while offline.
- Allows cart operations offline.
- Allows bookings to be queued offline and synchronized when connectivity returns.
- Handles conflicts, expired slots, duplicate booking attempts, timeouts, malformed/partial responses, empty results, and session expiration.
- Uses TypeScript throughout the application.
- Uses React Navigation.
- Has modular feature boundaries and reusable shared components.
- Has meaningful unit/component tests and one end-to-end flow.
- Includes dark mode and accessibility support.
- Documents architectural decisions and trade-offs.

## 3. Explicit Scope

### Consultation

- Doctor listing
- Search
- Filters
- Doctor details
- Available slots
- Booking
- Upcoming consultations
- Cancellation
- Slot conflict handling
- Expired-slot handling
- Double-booking protection

### Shop

- Product listing
- Infinite scrolling
- Search
- Multi-filter
- Sorting
- Product details
- Cart
- Quantity updates
- Wishlist
- Checkout summary
- Persistent offline cart

### Health Records

- Timeline
- Record types:
  - Lab report
  - Prescription
  - Consultation
  - Vaccination
  - Allergy
- Filters
- Search
- Tags
- Attachment previews
- Month/year grouping

## 4. Non-Goals

The assignment does not require:

- A real payment gateway.
- A real healthcare backend.
- Real authentication infrastructure.
- A production cloud deployment.
- Real doctor scheduling infrastructure.
- Real medical data integrations.
- Pixel-perfect cloning of a reference design.
- Microservices.
- Kubernetes.
- A complex backend.

Mock APIs are explicitly permitted.

## 5. Engineering Position

Use a local-first mobile architecture with a thin API abstraction. The app should behave like a real production client even though the remote API is mocked.

Recommended high-level stack:

- React Native
- TypeScript with strict mode
- React Navigation
- TanStack Query for server state/cache
- Zustand for small client/UI state
- SQLite for durable offline domain data and mutation queue
- NetInfo for connectivity awareness
- Axios or fetch wrapped behind an API client
- React Native Testing Library + Jest
- Maestro or Detox for one E2E flow
- ESLint + Prettier
- Sentry-compatible error abstraction, but no vendor lock-in

## 6. Project Setup

Use Expo managed workflow unless a specific requirement forces bare React Native. This affects library choices:

| Concern | Expo | Bare React Native |
|---|---|---|
| SQLite | `expo-sqlite` | `react-native-quick-sqlite` |
| Image | `expo-image` | `@d11/react-native-fast-image` |
| Storage | `expo-secure-store` | `react-native-keychain` |

Document the chosen setup in the README after project initialization.

## 6. Time Allocation

| Area | Target |
|---|---:|
| Project foundation | 30–45 min |
| Shared UI/design system | 45–60 min |
| Consultation | 2–2.5 h |
| Shop | 2–2.5 h |
| Health Records | 1.5–2 h |
| Offline/sync/reliability | 1.5–2 h |
| Testing/performance validation | 1–1.5 h |
| README/demo polish | 30–45 min |

## 7. Definition of Done

A feature is done only when:

- Happy path works.
- Empty/loading/error states exist.
- Offline behavior is defined.
- Types are explicit.
- Network calls do not leak into presentation components.
- Large-list rendering is virtualized.
- Tests cover the important business rules.
- Accessibility labels exist for interactive controls.
- The feature can be understood by another developer without reverse-engineering it.
