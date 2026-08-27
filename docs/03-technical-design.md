# Technical Design and Stack

## 1. Stack

| Concern | Decision | Reason |
|---|---|---|
| Mobile | React Native | Required |
| Language | TypeScript strict | Required and reduces runtime mistakes |
| Navigation | React Navigation | Required |
| Server state | TanStack Query | Caching, retries, network-aware queries |
| Client state | Zustand | Small, explicit UI state |
| Offline persistence | SQLite | Durable structured local data |
| Connectivity | NetInfo | Reliable network state integration |
| API | Fetch/Axios behind adapter | Keep transport replaceable |
| Validation | Zod | Validate mock/remote payloads |
| Testing | Jest + React Native Testing Library | Business/UI tests |
| E2E | Detox or Maestro | One critical end-to-end flow |
| Linting | ESLint | Consistency |
| Formatting | Prettier | Consistency |
| Error abstraction | AppError + logger | Vendor-independent failure handling |
| Key-value storage | MMKV | Fast persistent key-value store for flags/preferences |
| Image optimization | expo-image / @d11/react-native-fast-image | Performant image rendering |

## 2. Why TanStack Query

The assignment requires cached API responses, retry behavior, and offline operation. TanStack Query separates server state from UI state and supports offline-aware behavior. Its React Native guidance also shows integrating the online manager with NetInfo. Persistent query storage can provide a cache layer for offline reads.

Use persistent query caching selectively. Do not persist huge datasets indiscriminately. Note that TanStack Query persistence uses AsyncStorage by default, which can be slow for large payloads; for large dataset caching, prefer selective SQLite persistence instead.

## 3. Why Zustand

The app does not require a complex global state graph. Zustand is sufficient for UI-owned state and avoids putting server state into a global client store.

## 4. Why SQLite

The assignment explicitly requires:

- Offline cart
- Offline queued bookings
- Automatic synchronization

A structured local database is more reliable for durable queues and relational data than using a large JSON blob in AsyncStorage.

## 4a. Why MMKV

For small, frequently-read key-value data (theme preference, feature flags, UI preferences), MMKV is significantly faster than AsyncStorage. Use MMKV for:

- Theme preference
- Feature flags
- UI preferences
- Session metadata

Do not use MMKV for large datasets or structured data; use SQLite for those.

## 5. API Abstraction

Screens must never call:

```text
fetch(...)
axios.get(...)
```

directly.

Instead:

```text
Screen
  ↓
Feature Hook
  ↓
Use Case
  ↓
Repository
  ↓
ApiClient
```

## 6. Data Validation

Every external response should be treated as untrusted.

```text
Raw response
  ↓
JSON parse
  ↓
Schema validation
  ↓
Domain mapping
  ↓
Application
```

Invalid payloads become typed application errors rather than crashing the UI.

## 7. Environment Configuration

Use:

```text
.env.development
.env.test
.env.production
```

Expose only client-safe values.

Example:

```text
API_BASE_URL
API_TIMEOUT_MS
ENABLE_MOCK_FAILURES
ENABLE_PERFORMANCE_LOGGING
```

Never place secrets in the React Native bundle.

## 8. Logging

Use a structured logger:

```ts
logger.debug("products.fetch.start", { page });
logger.info("booking.queued", { bookingId });
logger.warn("sync.retry", { operationId, attempt });
logger.error("api.invalid_response", { endpoint, requestId });
```

Avoid logging:

- Tokens
- Passwords
- Full medical records
- Sensitive personal data
