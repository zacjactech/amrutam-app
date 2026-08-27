# Amrutam Ayurvedic Super App

Production-oriented React Native implementation of the Amrutam Senior React Assignment.

## Architecture

- **Framework:** React Native with Expo Managed Workflow
- **Language:** TypeScript (strict mode)
- **Package Manager:** pnpm (enforced)
- **Navigation:** React Navigation 7+
- **State:** TanStack Query (server) + Zustand (client)
- **Storage:** SQLite (durable) + MMKV (key-value) + SecureStore (secrets)
- **Lists:** FlashList for large datasets

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
│   ├── consultations/    # Consultation module
│   ├── shop/             # Shop module
│   └── health-records/   # Health records module
├── shared/               # Shared components, hooks, utils
├── infrastructure/       # API, database, sync, network
└── domain/               # Types, validation, business rules
```

## Environment Setup

1. Copy `.env.example` to `.env.development`
2. Configure environment variables
3. Run `pnpm start`

## Documentation

See `docs/` directory for comprehensive planning documents:
- `00-project-charter.md` - Scope and goals
- `02-architecture.md` - System architecture
- `12-implementation-plan.md` - Build sequence
- `20-architecture-execution-plan.md` - Technical roadmap

## License

Private - Amrutam Assignment
