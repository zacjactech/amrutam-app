# AGENTS.md — Amrutam React Native Project

## Project Status

**Planning phase only.** No implementation code exists. The `docs/` directory contains 20 planning documents that serve as the authoritative specification. Implementation has not begun.

## Source of Truth

The documentation pack in `docs/` is authoritative. Read in order:

1. `00-project-charter.md` — Scope, goals, success criteria
2. `01-prd.md` — Functional/non-functional requirements
3. `02-architecture.md` — System and feature architecture
4. `03-technical-design.md` — Stack and engineering decisions
5. `04-data-model.md` — Domain entities and persistence
6. `05-api-contract.md` — API/repository/mock behavior
7. `06-state-and-data-flow.md` — State ownership and flows
8. `07-offline-sync.md` — Queue, retries, conflicts, idempotency
9. `08-performance.md` — Large dataset strategy
10. `09-testing-and-qa.md` — Test strategy
11. `10-ui-ux-design-system.md` — Shared UI system
12. `11-security-reliability.md` — Error handling, privacy
13. `12-implementation-plan.md` — Build sequence
14. `13-folder-structure.md` — Repository organization
15. `14-adr.md` — Architecture decisions
16. `15-readme.md` — Developer-facing docs
17. `16-ai-development-guide.md` — AI coding rules
18. `17-references-and-traceability.md` — Engineering references
19. `18-implementation-plan.md` — Technical roadmap (NEW)
20. `19-session-tracking.md` — Progress tracking (NEW)

If code conflicts with these docs, update docs first before changing architecture.

## Assignment Constraints

- **No backend or microservices.** Mocked/generated data is explicitly permitted.
- **Three modules:** Consultation, Shop, Health Records
- **Dataset sizes:** 5,000 doctors, 20,000 products, 10,000 health records
- **Time limit:** 72 hours (expected effort: 8-12 hours)
- **No boilerplate starters** — build from scratch

## Tech Stack (Decided)

| Concern | Decision |
|---------|----------|
| Framework | React Native (Expo managed) |
| Language | TypeScript (strict mode) |
| Navigation | React Navigation 7+ (static API preferred) |
| Server state | TanStack Query |
| Client state | Zustand (small UI state only) |
| Offline persistence | SQLite (`expo-sqlite`) |
| Key-value storage | MMKV |
| Connectivity | NetInfo |
| Lists | FlashList (`@shopify/flash-list`) for 500+ items |
| Images | `expo-image` |
| Validation | Zod |
| Testing | Jest + React Native Testing Library |
| E2E | Maestro |

## Architecture Rules

**Layer dependency:** `UI → Application → Domain ← Infrastructure`

- Domain layer must NOT depend on React Native, SQLite, or TanStack Query
- Screens must NOT contain raw API calls or direct SQLite access
- Feature modules must NOT import another feature's internals
- Shared functionality belongs in `shared/` or `infrastructure/`

**State ownership:**
- **TanStack Query:** Server-owned state (doctors, products, health records, slots)
- **Zustand:** Client-owned state (theme, UI preferences, temporary filters)
- **SQLite:** Durable offline state (cart, wishlist, booking queue, sync operations)
- **MMKV:** Fast key-value (theme preference, feature flags)

**Critical rule:** Never store server data in Zustand. Never put large datasets in global state.

## Booking Rules (Business-Critical)

- Offline bookings use `pending_sync` status, NEVER `confirmed`
- A slot must not be booked twice (enforce via idempotency key: `patientId + slotId`)
- Expired slots must be rejected even if previously cached
- Slot expiry checked against server time when online; local time is approximation when offline
- Confirmation is a server-side fact — UI must reflect this honestly

## Required States for Every Feature

Every screen/route must implement:
- Happy path
- Loading state (skeleton for major content, spinner for mutations)
- Empty state (with clear message and action)
- Error state (distinguish: retryable, validation, conflict, session, offline)
- Offline state (when applicable)

## Verification Workflow (Per Change)

After every edit:
1. Type-check (`tsc --noEmit` or `npx tsc`)
2. Lint (`eslint .`)
3. Run relevant tests
4. Inspect imports for architecture violations
5. Check list components for unnecessary re-renders

## Commit Strategy

Use focused, single-purpose commits:
```
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

## What NOT to Generate

- Fake production credentials or hard-coded secrets
- Unbounded retries (use bounded exponential backoff with jitter)
- Giant mock arrays inside React components (use generators)
- Screens containing API logic (use repository pattern)
- Global stores containing every remote entity
- Microservices or complex backend infrastructure
- Unnecessary abstraction layers

## Environment Files

Create from `.env.example`:
- `.env.development` — Mock APIs, debug logging enabled
- `.env.staging` — Performance logging, full dataset
- `.env.production` — Optimized, no debug features

Variables: `API_BASE_URL`, `API_TIMEOUT_MS`, `ENABLE_MOCK_FAILURES`, `ENABLE_PERFORMANCE_LOGGING`

## Key References

- Original assignment: `React Native Assignment.pdf`
- Evaluation criteria: 20% Architecture, 20% Code Quality, 20% Performance, 15% Offline/Error, 10% State, 5% Testing, 5% Docs, 5% UX
