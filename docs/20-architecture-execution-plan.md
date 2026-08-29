# Architecture & Execution Plan

## Document Control

| Field | Value |
|---|---|
| Project | Amrutam Ayurvedic Super App |
| Version | 1.0 |
| Created | 2026-08-26 |
| Author | Senior Mobile Architect |
| Status | Approved for Implementation |

---

## 1. Workflow Selection

### 1.1 Selected Workflow: Expo Managed

**Decision:** Expo Managed Workflow with EAS Build for production deployments.

**Rationale:**

| Factor | Justification |
|--------|---------------|
| Security | Expo manages native dependency security patches; `expo-secure-store` provides encrypted storage |
| Velocity | Pre-configured builds, OTA updates, no native IDE setup required |
| Scalability | EAS Build scales automatically; Dev Client available for future native needs |
| Maintenance | Single dependency (`expo`) manages native module compatibility |
| Cost | Free tier sufficient for development; predictable pricing at scale |

### 1.2 Package Manager: pnpm

**Decision:** pnpm as the exclusive package manager.

**Rationale:**

| Factor | Justification |
|--------|---------------|
| Disk Efficiency | Content-addressable storage reduces node_modules size by 50-70% |
| Strictness | Prevents phantom dependencies; enforces declared dependencies |
| Speed | 2x faster than npm for clean installs; efficient for CI/CD |
| Security | Built-in audit capabilities; lockfile integrity verification |
| Monorepo Ready | Workspace support for future multi-package architecture |

**Configuration:**
```json
// package.json
{
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - '.'
```

---

## 2. Security-First Architecture

### 2.1 Security Principles

| Principle | Implementation |
|-----------|----------------|
| Defense in Depth | Multiple validation layers (client, transport, storage) |
| Least Privilege | Minimal permissions requested; scoped access tokens |
| Zero Trust | All external data validated; no implicit trust |
| Encryption at Rest | SQLite encryption via SQLCipher; keychain for secrets |
| Encryption in Transport | HTTPS certificate pinning for production |

### 2.2 Data Validation Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA VALIDATION LAYERS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Schema Validation (Zod)                               │
│  ├── Request payload validation                                  │
│  ├── Response payload validation                                 │
│  └── Environment variable validation                             │
│                                                                  │
│  Layer 2: Domain Validation (Pure Functions)                    │
│  ├── Business rule enforcement                                   │
│  ├── Slot expiry verification                                    │
│  └── Booking conflict detection                                  │
│                                                                  │
│  Layer 3: Transport Validation (API Client)                     │
│  ├── Timeout enforcement                                         │
│  ├── Retry classification                                        │
│  └── Error normalization                                         │
│                                                                  │
│  Layer 4: Storage Validation (SQLite)                           │
│  ├── Type-safe queries                                           │
│  ├── Constraint enforcement                                      │
│  └── Migration validation                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Security Implementation

| Concern | Solution | Library |
|---------|----------|---------|
| Secure Storage | Encrypted keychain/keyring | `expo-secure-store` |
| Data Encryption | SQLCipher for SQLite | `expo-sqlite` (with cipher) |
| Certificate Pinning | SSL pinning for API calls | `expo-certificates` |
| Environment Secrets | Build-time injection | EAS Secrets |
| Input Sanitization | Zod schema validation | `zod` |
| Obfuscation | ProGuard (Android), Bitcode (iOS) | Built into EAS Build |

---

## 3. Technical Architecture

### 3.1 Layered Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Screens   │  │ Components  │  │   Design System         │ │
│  │             │  │             │  │   (Tokens, Theme)       │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘ │
│         │                │                                       │
├─────────┴────────────────┴───────────────────────────────────────┤
│                      APPLICATION LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │    Hooks    │  │  Use Cases  │  │   State Selectors       │ │
│  │             │  │             │  │                         │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘ │
│         │                │                                       │
├─────────┴────────────────┴───────────────────────────────────────┤
│                        DOMAIN LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │    Types    │  │  Validation │  │   Business Rules        │ │
│  │             │  │   (Zod)     │  │   (Pure Functions)      │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────────┘ │
│         │                │                                       │
├─────────┴────────────────┴───────────────────────────────────────┤
│                     INFRASTRUCTURE LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ API Client  │  │  SQLite DB  │  │   Sync Engine           │ │
│  │             │  │             │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 State Management Architecture

| State Type | Owner | Storage | Validation |
|------------|-------|---------|------------|
| Server State | TanStack Query | Query Cache | Zod (response) |
| Client State | Zustand | In-memory | Zod (input) |
| Durable State | SQLite | Database | Schema + Constraints |
| Key-Value | MMKV | Encrypted Store | Type-safe wrapper |

### 3.3 Data Flow

```
User Action
    │
    ▼
┌───────────────┐
│   Screen      │ ◄── Presentation Layer
│   (Hook Call) │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Feature Hook │ ◄── Application Layer
│  (useCase)    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Repository   │ ◄── Domain Layer
│  (Interface)  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  API Client   │ ◄── Infrastructure Layer
│  (Validated)  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  External API │
│  (Mock/Real)  │
└───────────────┘
```

---

## 4. Phased Execution Plan

### Phase 0: Project Initialization
**Duration:** 30-45 minutes  
**Security Focus:** Dependency audit, secure configuration

| Step | Task | Security/Validation | Deliverable |
|------|------|---------------------|-------------|
| 0.1 | Initialize Expo with pnpm | Verify package integrity | `package.json` |
| 0.2 | Configure TypeScript strict | Enable all strict flags | `tsconfig.json` |
| 0.3 | Setup ESLint + Prettier | Security lint rules | `.eslintrc.js` |
| 0.4 | Install dependencies | `pnpm audit` pass | `pnpm-lock.yaml` |
| 0.5 | Configure environment | Validate env schema | `.env.*` files |
| 0.6 | Setup secure storage | Keychain configuration | `SecureStorage` |
| 0.7 | Initialize SQLite | Schema validation ready | `database.ts` |

**Exit Criteria:** `pnpm run typecheck` passes; `pnpm audit` clean; app launches to blank screen.

---

### Phase 1: Foundation & Security Layer
**Duration:** 45-60 minutes  
**Security Focus:** Error boundaries, secure logging, input sanitization

| Step | Task | Security/Validation | Deliverable |
|------|------|---------------------|-------------|
| 1.1 | Design system tokens | Token validation | `tokens.ts` |
| 1.2 | Theme provider | Type-safe theming | `ThemeProvider` |
| 1.3 | Error Boundary | Graceful failure handling | `ErrorBoundary` |
| 1.4 | Secure logger | PII redaction | `logger.ts` |
| 1.5 | Toast system | XSS-safe messages | `ToastProvider` |
| 1.6 | API client base | Timeout, retry, validation | `apiClient.ts` |
| 1.7 | Zod schemas | All domain schemas | `schemas.ts` |
| 1.8 | Navigation structure | Type-safe routes | `navigation/` |

**Exit Criteria:** Navigation functional; error boundary catches crashes; logger redacts PII.

---

### Phase 2: Consultation Module
**Duration:** 2-2.5 hours  
**Security Focus:** Input validation, booking integrity

| Step | Task | Security/Validation | Deliverable |
|------|------|---------------------|-------------|
| 2.1 | Doctor types & schemas | Zod validation | `doctor.types.ts` |
| 2.2 | Doctor data generator | Bounded data generation | `doctor.generator.ts` |
| 2.3 | Consultation repository | Validated queries | `doctor.repository.ts` |
| 2.4 | Doctor list hook | Query validation | `useDoctors` |
| 2.5 | Search & filter | Input sanitization | `DoctorFilterSheet` |
| 2.6 | Doctor details | Slot validation | `DoctorDetailsScreen` |
| 2.7 | Slot picker | Expiry validation | `SlotPicker` |
| 2.8 | Booking use case | Idempotency, conflict check | `useBookConsultation` |
| 2.9 | Booking confirmation | Status enforcement | `BookingConfirmation` |
| 2.10 | Upcoming consultations | State reconciliation | `UpcomingScreen` |
| 2.11 | Cancellation | Status validation | `useCancelConsultation` |

**Exit Criteria:** Full booking flow works; slot conflicts rejected; expired slots blocked.

---

### Phase 3: Shop Module
**Duration:** 2-2.5 hours  
**Security Focus:** Cart integrity, pagination safety

| Step | Task | Security/Validation | Deliverable |
|------|------|---------------------|-------------|
| 3.1 | Product types & schemas | Zod validation | `product.types.ts` |
| 3.2 | Product generator | Bounded data generation | `product.generator.ts` |
| 3.3 | Paginated repository | Page bounds validation | `product.repository.ts` |
| 3.4 | Infinite query hook | Pagination safety | `useInfiniteProducts` |
| 3.5 | Product list (FlashList) | Stable keys, memoization | `ProductListScreen` |
| 3.6 | Search/filter/sort | Input sanitization | `ProductFilterSheet` |
| 3.7 | Product details | Stock validation | `ProductDetailsScreen` |
| 3.8 | SQLite cart | Transaction safety | `cart.repository.ts` |
| 3.9 | Cart operations | Quantity validation | `useCart` |
| 3.10 | Wishlist | Persistence validation | `useWishlist` |
| 3.11 | Checkout summary | Price calculation integrity | `CheckoutScreen` |

**Exit Criteria:** 20K products scroll smoothly; cart persists across restarts; price calculations accurate.

---

### Phase 4: Health Records Module
**Duration:** 1.5-2 hours  
**Security Focus:** PHI protection, access control

| Step | Task | Security/Validation | Deliverable |
|------|------|---------------------|-------------|
| 4.1 | Record types & schemas | Zod validation | `record.types.ts` |
| 4.2 | Record generator | Synthetic PHI generation | `record.generator.ts` |
| 4.3 | Records repository | Validated queries | `record.repository.ts` |
| 4.4 | Timeline query | Date validation | `useHealthRecords` |
| 4.5 | Timeline screen | Month/year grouping | `TimelineScreen` |
| 4.6 | Search/filter/tag | Input sanitization | `RecordFilterSheet` |
| 4.7 | Record details | PHI redaction in logs | `RecordDetailsScreen` |
| 4.8 | Attachment preview | MIME type validation | `AttachmentPreview` |

**Exit Criteria:** Timeline groups correctly; PHI not logged; attachment types validated.

---

### Phase 5: Offline & Sync Engine
**Duration:** 1.5-2 hours  
**Security Focus:** Queue integrity, conflict resolution

| Step | Task | Security/Validation | Deliverable |
|------|------|---------------------|-------------|
| 5.1 | Connectivity service | State validation | `connectivity.ts` |
| 5.2 | Sync operation types | Zod validation | `sync.types.ts` |
| 5.3 | Sync queue (SQLite) | Transaction safety | `syncQueue.ts` |
| 5.4 | Sync coordinator | Idempotency enforcement | `syncCoordinator.ts` |
| 5.5 | Retry policy | Bounded backoff | `retryPolicy.ts` |
| 5.6 | Offline booking queue | Status validation | `offlineBooking` |
| 5.7 | Sync status UI | State accuracy | `SyncIndicator` |
| 5.8 | Conflict resolution UI | User choice preservation | `ConflictDialog` |

**Exit Criteria:** Offline bookings queue; sync resumes on reconnect; conflicts surface to user.

---

### Phase 6: Reliability & Error Handling
**Duration:** 1-1.5 hours  
**Security Focus:** Graceful degradation, error classification

| Step | Task | Security/Validation | Deliverable |
|------|------|---------------------|-------------|
| 6.1 | Error classification | Typed errors | `errors.ts` |
| 6.2 | Mock failure injection | Deterministic failures | `failureInjection.ts` |
| 6.3 | Timeout handling | Bounded timeouts | `apiClient` update |
| 6.4 | Retry logic | Classification-based | `retryPolicy` update |
| 6.5 | Session expiration | Centralized handling | `sessionManager.ts` |
| 6.6 | Error state components | User-friendly messages | `ErrorState` |
| 6.7 | Failure scenario tests | All 7 failure types | Test coverage |

**Exit Criteria:** All 7 failure types handled; no unhandled promise rejections; session expiry flows work.

---

### Phase 7: Testing & Quality Assurance
**Duration:** 1-1.5 hours  
**Security Focus:** Validation coverage, edge cases

| Step | Task | Security/Validation | Deliverable |
|------|------|---------------------|-------------|
| 7.1 | Unit tests (business logic) | Validation coverage | `*.test.ts` |
| 7.2 | Hook tests | State machine coverage | `*.test.tsx` |
| 7.3 | Component tests | State coverage | `*.test.tsx` |
| 7.4 | Integration tests | Flow coverage | `*.test.tsx` |
| 7.5 | E2E booking flow | Maestro YAML | `booking.e2e.yaml` |
| 7.6 | Security audit | `pnpm audit` | Audit report |
| 7.7 | Performance validation | FPS, memory | Perf report |

**Exit Criteria:** >70% coverage on business logic; E2E passes; no critical audit findings.

---

### Phase 8: Polish & Production Readiness
**Duration:** 30-45 minutes  
**Security Focus:** Final hardening, documentation

| Step | Task | Security/Validation | Deliverable |
|------|------|---------------------|-------------|
| 8.1 | Dark mode verification | Token coverage | Visual QA |
| 8.2 | Accessibility audit | Screen reader labels | A11y report |
| 8.3 | Performance optimization | Large dataset validation | Perf report |
| 8.4 | README documentation | Architecture decisions | `README.md` |
| 8.5 | Build configuration | EAS Build setup | `eas.json` |
| 8.6 | Production build | Signed release | `.apk` / `.ipa` |

**Exit Criteria:** Dark mode complete; a11y labels present; production build succeeds.

---

## 5. Dependency Manifest

### 5.1 Core Dependencies

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    
    "@tanstack/react-query": "^5.40.0",
    "zustand": "^4.5.0",
    
    "expo-sqlite": "~14.0.0",
    "react-native-mmkv": "^2.12.0",
    
    "@react-native-community/netinfo": "^11.3.0",
    "@shopify/flash-list": "^1.7.0",
    "expo-image": "~1.12.0",
    "expo-secure-store": "~13.0.0",
    
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "typescript": "^5.4.0",
    "eslint": "^8.57.0",
    "prettier": "^3.3.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-native": "^4.1.0",
    "eslint-plugin-security": "^3.0.0",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.5.0",
    "@types/jest": "^29.5.0"
  }
}
```

### 5.2 Security Dependencies

| Package | Purpose | Justification |
|---------|---------|---------------|
| `expo-secure-store` | Encrypted keychain storage | Required for tokens, session data |
| `eslint-plugin-security` | Static analysis for security | Catches common vulnerabilities |
| `zod` | Runtime validation | Prevents malformed data propagation |

---

## 6. Environment Configuration

### 6.1 Environment Files

```bash
# .env.development
APP_ENV=development
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# .env.staging
APP_ENV=staging
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# .env.production
APP_ENV=production
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 6.2 Environment Validation Schema

```typescript
// src/infrastructure/env.ts
import { z } from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
```

---

## 7. Security Checklist

| Category | Requirement | Implementation | Phase |
|----------|-------------|----------------|-------|
| Storage | No plaintext secrets | `expo-secure-store` | 1 |
| Transport | HTTPS only | API client enforcement | 1 |
| Input | All inputs validated | Zod schemas | 2-4 |
| Output | PII redaction in logs | Custom logger | 1 |
| Dependencies | Regular audits | `pnpm audit` in CI | 7 |
| Code | Static analysis | ESLint security plugin | 1 |
| Build | Signed releases | EAS Build | 8 |
| Updates | OTA security patches | `expo-updates` | 8 |

---

## 8. Validation Checklist

| Layer | Validation | Tool | Coverage |
|-------|------------|------|----------|
| Schema | Request/Response shapes | Zod | 100% |
| Domain | Business rules | Pure functions | 100% |
| Transport | Timeout, retry | API client | 100% |
| Storage | Type safety | SQLite schema | 100% |
| UI | Input sanitization | Components | 100% |

---

## 9. Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Dependency vulnerability | Low | High | `pnpm audit` in CI; Expo auto-updates |
| Data corruption | Low | High | SQLite transactions; validation layers |
| Performance degradation | Medium | High | FlashList; pagination; memoization |
| Security breach | Low | Critical | Secure storage; no plaintext secrets |
| Scope creep | Medium | Medium | Phased approach; strict task backlog |

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| App launch time | < 2 seconds | Cold start to interactive |
| List scroll FPS | 55-60 FPS | FlashList on 20K items |
| Offline booking sync | < 5 seconds | Reconnection to confirmed |
| Test coverage | > 70% | Business logic coverage |
| Security audit | 0 critical | `pnpm audit` |
| Accessibility | 100% | Interactive elements labeled |
| Bundle size | < 50 MB | Production build |

---

## 11. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-26 | Senior Mobile Architect | Initial architecture document |
