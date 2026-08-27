# Folder Structure

Recommended structure:

```text
src/
├── app/
│   ├── App.tsx
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ToastProvider.tsx
│   └── bootstrap/
│
├── navigation/
│   ├── RootNavigator.tsx
│   ├── MainTabs.tsx
│   ├── routes.ts
│   └── types.ts
│
├── features/
│   ├── consultations/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   ├── components/
│   │   ├── screens/
│   │   └── hooks/
│   │
│   ├── shop/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   ├── components/
│   │   ├── screens/
│   │   └── hooks/
│   │
│   └── health-records/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       ├── components/
│       ├── screens/
│       └── hooks/
│
├── shared/
│   ├── components/
│   ├── design-system/
│   ├── hooks/
│   ├── utils/
│   ├── errors/
│   ├── constants/
│   └── types/
│
├── infrastructure/
│   ├── api/
│   │   ├── client.ts
│   │   ├── errors.ts
│   │   └── interceptors.ts
│   ├── database/
│   │   ├── sqlite.ts
│   │   ├── migrations/
│   │   └── repositories/
│   ├── sync/
│   │   ├── SyncCoordinator.ts
│   │   ├── SyncQueue.ts
│   │   └── retryPolicy.ts
│   ├── network/
│   │   └── connectivity.ts
│   └── logging/
│       └── logger.ts
│
├── mocks/
│   ├── generators/
│   ├── handlers/
│   ├── fixtures/
│   └── failure-injection/
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Rules

1. Screens depend on application hooks, not infrastructure.
2. Components should not import API clients.
3. Domain code should be platform-independent.
4. Feature modules should not import another feature's internals.
5. Shared components must remain generic.
6. Database details remain behind repositories.
7. Mock implementation must implement the same interfaces as a future real API.
