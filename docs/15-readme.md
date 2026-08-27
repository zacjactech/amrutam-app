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
- SQLite-backed offline persistence
- Offline mutation queue
- Idempotent booking mutations
- Virtualized large lists
- Infinite product pagination
- Error boundary and typed errors
- Dark mode
- Accessibility
- Unit/component/E2E testing
- Deterministic mock failure injection

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
API_BASE_URL=
API_TIMEOUT_MS=10000
ENABLE_MOCK_FAILURES=false
ENABLE_PERFORMANCE_LOGGING=false
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
  ├── API
  └── SQLite
```

TanStack Query owns server state. Zustand owns small client/UI state. SQLite owns durable offline state.

## Performance

The app uses:

- FlatList/SectionList virtualization.
- Paginated product fetching.
- Stable list keys.
- Memoized list items where beneficial.
- Selective query persistence.
- Avoidance of large global stores.

The test dataset contains:

- 5,000 doctors
- 20,000 products
- 10,000 health records

## Offline

Cached data remains available when possible.

Cart operations are local-first.

Offline bookings are inserted into a durable queue and synchronized when connectivity returns.

Bookings are never displayed as confirmed until the remote operation succeeds.

## Failure Handling

The mock layer can simulate:

- Timeout
- Server failure
- Invalid JSON
- Empty response
- Partial response
- Session expiration

The API layer converts these into typed application errors.

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
