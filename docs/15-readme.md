# Ayurvedic Super App — React Native

A production-oriented React Native implementation of the Amrutam Senior React Assignment.

## Modules

- Consultation
- Shop
- Health Records

## Engineering Highlights

- TypeScript
- React Navigation
- Feature-first architecture
- TanStack Query server-state management
- Zustand client-state management
- Supabase (PostgreSQL) backend
- SQLite-backed offline persistence
- Offline mutation queue
- Idempotent booking mutations
- Virtualized large lists
- Infinite product pagination
- Error boundary and typed errors
- Dark mode
- Accessibility
- Unit/component/E2E testing

## Requirements

Install the supported React Native development environment for the chosen project setup.

The project should document exact Node, package-manager, Android, and iOS requirements after dependency installation.

## Environment

Create environment files from the example:

```text
.env.example
```

Example variables:

```text
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Architecture

```text
Screen
  ↓
Feature Hook
  ↓
Use Case
  ↓
Repository
  ├── Supabase (server state)
  └── SQLite (offline state)
```

TanStack Query owns server state. Zustand owns small client/UI state. SQLite owns durable offline state.

## Backend

The app uses Supabase as the backend:

- **Database**: PostgreSQL with 8 tables (doctors, slots, bookings, products, cart_items, wishlist_items, health_records, sync_operations)
- **Seeded Data**: 100 doctors, 8,900 slots, 500 products, 500 health records
- **RLS**: Row Level Security enabled on all tables
- **API**: Auto-generated REST API via PostgREST

### Supabase Setup

1. Link project: `supabase link --project-ref fxegywsxtrtosnnjhftm`
2. Apply migrations: `supabase db push`
3. Seed data: `supabase db query -f supabase/seed.sql --linked`

## Performance

The app uses:

- FlatList/SectionList virtualization.
- Paginated product fetching.
- Stable list keys.
- Memoized list items where beneficial.
- Selective query persistence.
- Avoidance of large global stores.

## Offline

Cached data remains available when possible.

Cart operations are local-first.

Offline bookings are inserted into a durable queue and synchronized when connectivity returns.

Bookings are never displayed as confirmed until the remote operation succeeds.

## Testing

Run the project's test commands defined in `package.json`.

Required coverage:

- Business logic
- Custom hooks/application logic
- Utilities
- One E2E user flow

## Development Principles

- Keep screens thin.
- Keep domain logic pure.
- Hide infrastructure behind repositories.
- Validate external data.
- Avoid premature abstraction.
- Measure performance rather than assuming optimization.
- Prefer explicit states over hidden magic.
