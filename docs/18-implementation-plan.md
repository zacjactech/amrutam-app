# Implementation Plan

## Document Control

| Field | Value |
|---|---|
| Project | Amrutam Ayurvedic Super App |
| Version | 1.0 |
| Created | 2026-08-26 |
| Status | Active |

---

## 1. Overview

This Implementation Plan provides the technical roadmap for building the Amrutam Ayurvedic Super App, a production-oriented React Native application with three modules: Consultation, Shop, and Health Records. It defines milestones, resource requirements, deployment phases, and success criteria.

---

## 2. Technical Roadmap

### 2.1 Architecture Foundation

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION PHASES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 0: Foundation          [30-45 min]                        │
│  ├── Project initialization                                     │
│  ├── Dependency installation                                     │
│  ├── Tooling setup (ESLint, Prettier, TypeScript)               │
│  └── Core infrastructure (logger, error boundary, theme)        │
│                                                                  │
│  Phase 1: Shared Systems      [45-60 min]                        │
│  ├── Design system (tokens, typography, spacing)                │
│  ├── Reusable component library                                  │
│  ├── Navigation structure                                        │
│  └── API client abstraction                                      │
│                                                                  │
│  Phase 2: Consultation        [2-2.5 h]                         │
│  ├── Domain types and mock data generator                      │
│  ├── Repository and query hooks                                  │
│  ├── Doctor list with search/filter                             │
│  ├── Doctor details and slot picker                             │
│  ├── Booking flow with conflict handling                        │
│  └── Upcoming consultations and cancellation                    │
│                                                                  │
│  Phase 3: Shop                [2-2.5 h]                         │
│  ├── Product generator and paginated repository                 │
│  ├── Infinite scroll product list                               │
│  ├── Search, filter, sort functionality                         │
│  ├── Product details and wishlist                               │
│  ├── SQLite-backed cart with persistence                        │
│  └── Checkout summary                                           │
│                                                                  │
│  Phase 4: Health Records      [1.5-2 h]                         │
│  ├── Record generator and repository                            │
│  ├── Timeline with month/year grouping                          │
│  ├── Search, filter, tags                                       │
│  └── Attachment previews                                        │
│                                                                  │
│  Phase 5: Offline & Sync      [1.5-2 h]                         │
│  ├── Connectivity integration (NetInfo)                         │
│  ├── Offline mutation queue                                     │
│  ├── Sync coordinator and retry policy                          │
│  └── Conflict resolution UI                                     │
│                                                                  │
│  Phase 6: Reliability         [1-1.5 h]                         │
│  ├── Mock failure injection                                     │
│  ├── Error classification and handling                          │
│  ├── Timeout and retry logic                                    │
│  └── Session expiration handling                                │
│                                                                  │
│  Phase 7: Testing             [1-1.5 h]                         │
│  ├── Unit tests (business logic, utilities)                     │
│  ├── Hook/integration tests                                      │
│  ├── Component tests (states, accessibility)                    │
│  └── E2E flow (booking journey)                                 │
│                                                                  │
│  Phase 8: Polish              [30-45 min]                        │
│  ├── Dark mode verification                                     │
│  ├── Accessibility audit                                        │
│  ├── Performance validation                                     │
│  └── README and documentation                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Phase Dependencies

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 5 ──► Phase 7 ──► Phase 8
                   │                    ▲
                   ├──► Phase 3 ────────┤
                   │                    │
                   └──► Phase 4 ────────┤
                                        │
                              Phase 6 ──┘
```

---

## 3. Key Milestones

### Milestone 1: Project Foundation Complete
- **Target**: End of Phase 0 + Phase 1
- **Deliverables**:
  - [ ] React Native TypeScript project initialized
  - [ ] All dependencies installed and configured
  - [ ] ESLint + Prettier + strict TypeScript
  - [ ] Logger, Error Boundary, Toast, Theme provider
  - [ ] Design system tokens and base components
  - [ ] Navigation structure (tabs + modals)
  - [ ] API client with mock repositories
- **Success Criteria**: App launches to empty home screen with working navigation

### Milestone 2: Consultation Module Complete
- **Target**: End of Phase 2
- **Deliverables**:
  - [ ] Doctor listing with virtualized list
  - [ ] Search and multi-filter functionality
  - [ ] Doctor details with available slots
  - [ ] Booking flow with conflict/expiry handling
  - [ ] Upcoming consultations with cancellation
- **Success Criteria**: Can search doctors, book slot, view upcoming, cancel booking

### Milestone 3: Shop Module Complete
- **Target**: End of Phase 3
- **Deliverables**:
  - [ ] Product listing with infinite scroll
  - [ ] Search, multi-filter, sort
  - [ ] Product details and wishlist
  - [ ] Cart with persistence across restarts
  - [ ] Checkout summary
- **Success Criteria**: Can browse 20K products smoothly, cart persists after app restart

### Milestone 4: Health Records Complete
- **Target**: End of Phase 4
- **Deliverables**:
  - [ ] Timeline grouped by month/year
  - [ ] All 5 record types supported
  - [ ] Search, filter, tags
  - [ ] Attachment previews
- **Success Criteria**: Can navigate records timeline, filter by type/tag, preview attachments

### Milestone 5: Offline & Sync Operational
- **Target**: End of Phase 5
- **Deliverables**:
  - [ ] NetInfo integration with TanStack Query
  - [ ] Offline mutation queue in SQLite
  - [ ] Automatic sync on reconnection
  - [ ] Conflict resolution UI
- **Success Criteria**: App works offline, bookings queue and sync when reconnected

### Milestone 6: Reliability Validated
- **Target**: End of Phase 6
- **Deliverables**:
  - [ ] All failure scenarios handled gracefully
  - [ ] Timeout and retry logic
  - [ ] Session expiration flow
  - [ ] Error states for all error kinds
- **Success Criteria**: No unhandled errors; user-friendly messages for all failure modes

### Milestone 7: Testing Complete
- **Target**: End of Phase 7
- **Deliverables**:
  - [ ] Unit tests for business logic
  - [ ] Hook/integration tests
  - [ ] Component tests for states
  - [ ] One E2E booking flow
- **Success Criteria**: All business rules covered by tests; E2E flow passes

### Milestone 8: Production Ready
- **Target**: End of Phase 8
- **Deliverables**:
  - [ ] Dark mode fully functional
  - [ ] Accessibility labels on all interactive elements
  - [ ] Performance validated on large datasets
  - [ ] README with architecture decisions
- **Success Criteria**: App meets all evaluation criteria

---

## 4. Resource Requirements

### 4.1 Development Environment

| Resource | Specification | Purpose |
|----------|---------------|---------|
| Node.js | 18.x LTS or higher | Runtime environment |
| Package Manager | npm 9+ or yarn 1.22+ | Dependency management |
| Expo SDK | Latest stable (50+) | React Native framework |
| TypeScript | 5.x | Type safety |
| Xcode 15+ | iOS development | iOS simulator/build |
| Android Studio | Android development | Android emulator/build |

### 4.2 Core Dependencies

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| Navigation | `@react-navigation/native` | ^7.x | Screen navigation |
| Navigation | `@react-navigation/native-stack` | ^7.x | Stack navigator |
| Navigation | `@react-navigation/bottom-tabs` | ^7.x | Tab navigator |
| State | `@tanstack/react-query` | ^5.x | Server state management |
| State | `zustand` | ^4.x | Client state management |
| Database | `expo-sqlite` | ^14.x | Local SQLite storage |
| Network | `@react-native-community/netinfo` | ^11.x | Connectivity detection |
| Validation | `zod` | ^3.x | Schema validation |
| Testing | `jest` | ^29.x | Test runner |
| Testing | `@testing-library/react-native` | ^12.x | Component testing |
| E2E | `maestro` | ^1.x | End-to-end testing |
| Lists | `@shopify/flash-list` | ^1.x | Virtualized lists |
| Images | `expo-image` | ^1.x | Optimized images |
| Storage | `react-native-mmkv` | ^2.x | Fast key-value storage |

### 4.3 Optional Dependencies

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| Logging | `pino` | ^9.x | Structured logging |
| Animations | `react-native-reanimated` | ^3.x | Smooth animations |
| Icons | `lucide-react-native` | ^0.x | Icon library |
| Forms | `react-hook-form` | ^7.x | Form handling |

### 4.4 Human Resources

| Role | Responsibility | Allocation |
|------|----------------|------------|
| Lead Developer | Architecture, code review, critical path | 100% |
| Feature Developer | Module implementation | 100% |
| QA Engineer | Test strategy, validation | 25% |

---

## 5. Deployment Phases

### Phase A: Development Build
- **Environment**: Local development
- **Target**: iOS Simulator / Android Emulator
- **Configuration**: `.env.development`
- **Features**: Mock APIs, debug logging, performance monitors

### Phase B: Internal Testing
- **Environment**: TestFlight (iOS) / Internal Sharing (Android)
- **Target**: Physical devices
- **Configuration**: `.env.staging`
- **Features**: Real device performance validation, accessibility testing

### Phase C: Production Build
- **Environment**: App Store / Play Store
- **Target**: Production users
- **Configuration**: `.env.production`
- **Features**: Optimized bundle, crash reporting, analytics

---

## 6. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Large dataset performance | Medium | High | FlashList, pagination, memoization |
| Offline sync complexity | Medium | Medium | Idempotency keys, bounded retries |
| TypeScript strict mode friction | Low | Medium | Incremental strictness, well-defined types |
| Dependency compatibility | Low | High | Pin versions, test upgrades in isolation |
| Time overrun | Medium | High | Prioritize core features, defer polish |

---

## 7. Definition of Done

A feature is complete when:

- [ ] Happy path works without errors
- [ ] Empty, loading, and error states implemented
- [ ] Offline behavior defined (where applicable)
- [ ] TypeScript types are explicit (no `any`)
- [ ] Network calls isolated from presentation components
- [ ] Large lists use virtualization
- [ ] Business rules covered by tests
- [ ] Accessibility labels present on interactive elements
- [ ] Code passes ESLint and Prettier checks
- [ ] Feature documented in code comments

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| App launch time | < 2 seconds | Cold start to interactive |
| List scroll FPS | 55-60 FPS | FlashList on 20K items |
| Offline booking sync | < 5 seconds | Reconnection to confirmed |
| Test coverage | > 70% | Business logic coverage |
| Accessibility score | 100% | Interactive elements labeled |
| Bundle size | < 50 MB | Production build |

---

## 9. Appendix: Environment Variables

```bash
# .env.development
API_BASE_URL=http://localhost:3000
API_TIMEOUT_MS=10000
ENABLE_MOCK_FAILURES=true
ENABLE_PERFORMANCE_LOGGING=true
MOCK_DATASET_SIZE=small

# .env.staging
API_BASE_URL=https://staging-api.amrutam.app
API_TIMEOUT_MS=15000
ENABLE_MOCK_FAILURES=false
ENABLE_PERFORMANCE_LOGGING=true
MOCK_DATASET_SIZE=full

# .env.production
API_BASE_URL=https://api.amrutam.app
API_TIMEOUT_MS=15000
ENABLE_MOCK_FAILURES=false
ENABLE_PERFORMANCE_LOGGING=false
MOCK_DATASET_SIZE=full
```

---

## 10. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-26 | - | Initial implementation plan |
