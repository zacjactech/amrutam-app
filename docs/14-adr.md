# Architecture Decision Records

## ADR-001 — Modular Monolith Mobile Architecture

### Decision

Use one React Native application with feature modules.

### Reason

The assignment evaluates client architecture. Separate mobile packages or microservices would increase complexity without improving the assessed outcomes.

### Consequences

Positive:

- Faster implementation.
- Clear feature boundaries.
- Simple deployment.
- Easy code sharing.

Negative:

- Requires discipline to avoid cross-feature coupling.

---

## ADR-002 — TanStack Query for Server State

### Decision

Use TanStack Query for remote/server-owned state.

### Reason

The assignment requires caching, pagination, retries, and offline-aware behavior.

### Consequences

Positive:

- Clear server-state lifecycle.
- Query caching.
- Pagination/infinite queries.
- Network-aware behavior.

Negative:

- Adds a dependency and requires developers to understand query invalidation.

---

## ADR-003 — SQLite for Offline Mutations

### Decision

Use SQLite for durable cart and mutation queue state.

### Reason

Offline bookings require a durable queue with statuses, retries, and idempotency keys. A structured local database is safer than a single serialized JSON document.

### Consequences

Positive:

- Durable state.
- Transactions.
- Structured queue.
- Easier migration path.

Negative:

- More implementation work than AsyncStorage.

---

## ADR-004 — Zustand Only for Client State

### Decision

Use Zustand for small UI/client state and avoid putting server data into the global store.

### Reason

Separating server state from client state reduces unnecessary global subscriptions and duplicate caching.

### Consequences

Positive:

- Smaller stores.
- Fewer accidental re-renders.
- Clear ownership.

Negative:

- Developers must understand which state belongs to which system.

---

## ADR-005 — No Microservices

### Decision

Do not introduce microservices.

### Reason

There is no real backend requirement and the assignment is time-boxed. A mocked repository can later be swapped for a real backend.

### Consequences

The mobile client remains the primary system under evaluation.

---

## ADR-006 — Explicit Pending Booking State

### Decision

Offline bookings use `pending_sync` rather than `confirmed`.

### Reason

Confirmation is a server-side fact. Offline creation cannot prove that the slot remains available.

### Consequences

The UI is more honest and conflict handling becomes explicit.
