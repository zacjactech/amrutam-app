# AI-Assisted Development Guide

This document is intended for use when implementing the project with an AI coding assistant.

## 1. Source of Truth

The following documents are authoritative:

1. Project Charter
2. PRD
3. Architecture
4. Technical Design
5. Data Model
6. API Contract
7. State/Data Flow
8. Offline/Sync Design
9. Performance Plan
10. Testing/QA
11. UI/UX Design System
12. Security/Reliability
13. Implementation Plan
14. ADRs

If generated code conflicts with these documents, update the documents explicitly before changing architecture.

## 2. Coding Rules

The coding assistant must:

- Use TypeScript strict mode.
- Keep feature boundaries intact.
- Avoid direct API calls from screens.
- Avoid putting server data into Zustand.
- Avoid rendering large datasets with ScrollView.
- Use stable list keys.
- Validate external API payloads.
- Handle loading, empty, error, offline, and retry states.
- Keep offline mutations idempotent.
- Never claim an offline booking is confirmed.
- Avoid unnecessary dependencies.
- Avoid broad refactors while implementing isolated features.

## 3. Implementation Sequence

Implement one vertical slice at a time.

Preferred order:

```text
Foundation
 ↓
Consultation
 ↓
Shop
 ↓
Health Records
 ↓
Offline Sync
 ↓
Reliability
 ↓
Performance
 ↓
Testing
 ↓
Polish
```

Each slice should compile and be testable before moving on.

## 4. AI Change Protocol

Before editing:

1. Inspect the existing file structure.
2. Identify the owning layer.
3. Read the relevant architecture rule.
4. Check existing shared components.
5. Avoid creating duplicate utilities.

After editing:

1. Type-check.
2. Lint.
3. Run relevant tests.
4. Inspect imports for architecture violations.
5. Check unnecessary re-renders for list components.
6. Update documentation if behavior changed.

## 5. Do Not Generate

Do not generate:

- Fake production credentials.
- Hard-coded secrets.
- Unbounded retries.
- Giant mock arrays directly inside React components.
- Screens containing API logic.
- Global stores containing every remote entity.
- Unnecessary microservices.
- Unnecessary abstraction layers.
