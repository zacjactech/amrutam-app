# Amrutam Ayurvedic Super App

Production-oriented React Native implementation of the Amrutam Senior React Assignment.

## Architecture

- **Framework:** React Native with Expo Managed Workflow
- **Language:** TypeScript (strict mode)
- **Package Manager:** pnpm (enforced)
- **Navigation:** React Navigation 7+ (static type-safe)
- **State Management:** TanStack Query (server state) + Zustand (client UI state)
- **Storage:** SQLite via expo-sqlite (durable offline) + MMKV (fast key-value) + SecureStore (secrets)
- **Lists:** FlashList for virtualized rendering of large datasets (5K doctors, 20K products, 10K records)
- **Connectivity:** @react-native-community/netInfo for offline detection
- **Validation:** Zod schemas for type-safe validation

## Quick Start

```bash
# Install dependencies
pnpm install

# Type check
pnpm run typecheck

# Lint
pnpm run lint

# Start development server
pnpm start

# Run tests
pnpm test

# Full verification (typecheck + lint + test)
pnpm run verify
```

## Project Structure

```
src/
├── app/                  # App entry, providers, bootstrap
├── navigation/           # Navigation structure and types
├── features/
│   ├── auth/             # Authentication (phone OTP, email)
│   ├── consultation/     # Consultation booking module
│   ├── shop/             # E-commerce module
│   ├── health/           # Health records timeline
│   ├── home/             # Home dashboard
│   └── profile/          # User profile & settings
├── shared/               # Shared components, hooks, utils, design system
├── infrastructure/       # Database, sync, auth, connectivity, logging
└── domain/               # Types, validation, business rules
```

## State Management

| Concern | Solution | Rationale |
|---------|----------|-----------|
| Server data (doctors, products, records) | TanStack Query | Automatic caching, background refetch, optimistic updates |
| UI state (theme, filters, modals) | Zustand | Minimal boilerplate, no re-render overhead |
| Offline persistence (cart, bookings, sync queue) | SQLite | Relational queries, ACID compliance |
| Fast key-value (theme preference) | MMKV | Synchronous, 30x faster than AsyncStorage |
| Secrets (tokens, keys) | SecureStore | Encrypted OS-level storage |

## Performance Optimizations

- **Virtualized Lists:** FlashList for all large lists (doctors, products, health records) with `estimatedItemSize` for dynamic heights
- **Memoization:** `React.memo` on list item components, `useCallback` for event handlers, `useMemo` for expensive computations
- **Lazy Loading:** Screen-level code splitting via React Navigation lazy loading
- **Image Optimization:** `expo-image` with caching, progressive loading, and `contentFit`
- **Query Caching:** TanStack Query `staleTime: 5min`, `gcTime: 10min` to minimize refetches
- **Efficient State Updates:** Normalized store design, granular updates via Zustand selectors
- **Debounced Search:** Custom `useDebounce` hook (300ms) to prevent excessive API calls

## Offline Strategy

```
Online Flow:
  User Action → Repository → Supabase API → Cache in SQLite → UI Update

Offline Flow:
  User Action → Repository → SQLite (write-through) → Queue for Sync → UI Update
  Connection Restored → SyncWorker processes queue → Conflict resolution → UI Refresh
```

- **Offline Cart:** Full CRUD stored in SQLite, synced when online
- **Offline Bookings:** Queued with `pending_sync` status, never `confirmed` until server confirms
- **Conflict Resolution:** Idempotency keys (`patientId + slotId`) prevent double bookings
- **Sync Scheduler:** Background worker processes queue with exponential backoff
- **Connectivity Detection:** NetInfo listener triggers sync on reconnection

## Trade-offs Made

| Decision | Trade-off | Justification |
|----------|-----------|---------------|
| Expo managed workflow | Less native control | Faster development, easier builds, OTA updates |
| SQLite over Realm | More setup code | Standard SQL, no vendor lock-in, better debugging |
| MMKV over AsyncStorage | Larger bundle | 30x faster reads, synchronous API, better UX |
| TanStack Query over SWR | More complexity | Better mutation support, offline-first patterns |
| FlashList over FlatList | API differences | 5x performance for large lists, recycling |
| Zod over Yup | Newer library | Better TypeScript inference, lighter bundle |
| No state machine (XState) | More manual states | Fewer abstractions, easier debugging |

## Testing

- **Unit Tests:** Business logic, utility functions, validation schemas
- **Hook Tests:** Custom hooks with React Native Testing Library
- **Integration Tests:** Repository layer with mocked Supabase
- **E2E Tests:** Maestro flows for critical user journeys

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm run test:coverage

# Run E2E tests (requires Maestro CLI)
maestro test .maestro/
```

## Future Improvements

- **Feature Flags:** Remote configuration for gradual rollouts
- **Biometric Auth:** Face ID / fingerprint for quick sign-in
- **Push Notifications:** Appointment reminders, order updates
- **Localization:** Hindi + English support
- **Performance Monitoring:** React Navigation screen transition metrics
- **Crash Reporting:** Sentry or Bugsnag integration
- **Deep Linking:** Universal links for consultation sharing
- **Accessibility Audit:** VoiceOver / TalkBack compliance

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## Documentation

See `docs/` directory for comprehensive planning documents:
- `00-project-charter.md` - Scope and goals
- `01-prd.md` - Product requirements
- `02-architecture.md` - System architecture
- `04-data-model.md` - Database schema
- `07-offline-sync.md` - Offline strategy
- `12-implementation-plan.md` - Build sequence

## License

Private - Amrutam Assignment
