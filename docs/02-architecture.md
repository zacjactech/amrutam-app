# System Architecture

## 1. Architecture Decision

Use a modular feature-first React Native architecture with clear separation between presentation, application state, domain logic, infrastructure, and persistence.

This is a single mobile application, not a microservice system.

## 2. High-Level Architecture

```text
┌───────────────────────────────────────────────┐
│                 React Native UI               │
│  Screens / Components / Accessibility / UX    │
└──────────────────────┬────────────────────────┘
                       │
┌──────────────────────▼────────────────────────┐
│              Application Layer                 │
│ Hooks / Use Cases / Feature Controllers        │
└──────────────┬───────────────────┬─────────────┘
               │                   │
       ┌───────▼──────┐     ┌──────▼─────────┐
       │ Server State │     │ Client State    │
       │ TanStack     │     │ Zustand        │
       │ Query        │     │ UI/preferences  │
       └───────┬──────┘     └────────────────┘
               │
┌──────────────▼────────────────────────────────┐
│             Domain / Repository Layer          │
│ Doctors / Slots / Products / Cart / Records    │
└──────────────┬───────────────────┬─────────────┘
               │                   │
       ┌───────▼──────┐     ┌──────▼─────────┐
       │ API Client   │     │ Local DB       │
       │ Mock/Remote  │     │ SQLite         │
       └───────┬──────┘     └──────┬─────────┘
               │                   │
               └──────────┬────────┘
                          │
                 ┌────────▼────────┐
                 │ Sync Coordinator│
                 │ Network Queue   │
                 └─────────────────┘
```

## 3. Feature Boundaries

```text
src/
  app/
  navigation/
  features/
    consultations/
    shop/
    health-records/
  shared/
    components/
    design-system/
    hooks/
    utils/
    errors/
    network/
    storage/
  infrastructure/
    api/
    database/
    sync/
  mocks/
  tests/
```

Features must not directly import implementation details from another feature.

Shared functionality belongs in `shared` or `infrastructure`.

## 4. Layer Responsibilities

### Presentation

Contains screens, components, list items, sheets, modals, and UI state adapters.

Must not contain raw API calls.

### Application

Contains feature hooks/use cases such as:

- `useDoctors`
- `useBookConsultation`
- `useCancelConsultation`
- `useProducts`
- `useCart`
- `useHealthRecords`

### Domain

Contains:

- Types
- Business rules
- Validation
- Pure transformations
- Repository interfaces

Example:

```text
ConsultationRepository
  getDoctors()
  getDoctor()
  getSlots()
  createBooking()
  cancelBooking()
```

### Infrastructure

Implements repository interfaces using:

- API client
- SQLite
- sync queue
- network monitoring

## 5. State Management

### TanStack Query

Use for server-owned state:

- Doctors
- Doctor slots
- Products
- Health records
- Booking status
- Remote synchronization

### Zustand

Use for small client-owned state:

- Theme preference
- UI preferences
- Temporary filters if needed
- UI-only flags

Do not store the entire product catalogue in Zustand.

### SQLite

Use for durable local state:

- Cart
- Wishlist
- Cached domain records where persistence is required
- Pending mutation queue
- Sync metadata

## 6. Navigation

Use React Navigation with typed route definitions.

Recommended structure:

```text
RootStack
 ├── MainTabs
 │    ├── Home
 │    ├── Consultations
 │    ├── Shop
 │    └── Health Records
 └── ModalStack
      ├── DoctorDetails
      ├── ProductDetails
      ├── BookingConfirmation
      ├── ConsultationDetails
      ├── HealthRecordDetails
      └── AttachmentPreview
```

## 7. Dependency Rule

```text
UI → Application → Domain
                  ↑
Infrastructure ───┘
```

The domain layer must not depend on React Native, SQLite, Axios, or TanStack Query.

## 8. Why Not Microservices?

There is no backend requirement and the assignment is a mobile engineering assessment. Microservices would add deployment, networking, observability, and failure-management complexity without improving the evaluated client architecture.

## 9. Scalability Strategy

The design scales primarily by:

- Paginating remote data.
- Virtualizing lists.
- Keeping server state separate from UI state.
- Persisting only data that needs offline availability.
- Processing mutations through a durable queue.
- Avoiding global subscriptions to large collections.
- Memoizing expensive derived values.

## 10. List Rendering Strategy

For large datasets (5,000+ items), prefer FlashList over FlatList:

| Scenario | Recommendation |
|---|---|
| Lists under 200 items | FlatList with tuned `windowSize` |
| Lists over 500 items or media-heavy rows | FlashList (`@shopify/flash-list`) |
| Grouped lists (health records) | SectionList or FlashList with sticky headers |

FlashList recycles native cells more aggressively and sustains 60 FPS where FlatList may drop frames. The API is nearly identical to FlatList, making migration straightforward.

## 11. Image Optimization

Use a performant image library to avoid decoding bottlenecks in lists:

| Setup | Library |
|---|---|
| Expo | `expo-image` |
| Bare React Native | `@d11/react-native-fast-image` |

Always specify explicit dimensions, use thumbnail URLs for list items, and enable memory caching.
