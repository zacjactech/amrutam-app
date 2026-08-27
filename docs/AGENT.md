# Amrutam React Native Assignment — Development Documentation Pack

This pack contains the production-oriented planning and development documents for the supplied assignment.

## Documents

| # | Document | Purpose |
|---|---|---|
| 00 | Project Charter | Scope, goals, success criteria |
| 01 | PRD | Functional and non-functional requirements |
| 02 | Architecture | System and feature architecture |
| 03 | Technical Design | Stack and engineering decisions |
| 04 | Data Model | Domain entities and local persistence |
| 05 | API Contract | API/repository/mock behavior |
| 06 | State & Data Flow | State ownership and feature flows |
| 07 | Offline & Sync | Queue, retries, conflicts, idempotency |
| 08 | Performance | Large dataset strategy and validation |
| 09 | Testing & QA | Test strategy and acceptance checklist |
| 10 | UI/UX Design System | Shared UI system and accessibility |
| 11 | Security & Reliability | Error handling, privacy, session behavior |
| 12 | Implementation Plan | Build sequence and delivery plan |
| 13 | Folder Structure | Concrete repository organization |
| 14 | ADRs | Architecture decisions and trade-offs |
| 15 | README | Developer-facing project documentation |
| 16 | AI Development Guide | Rules for AI-assisted implementation |
| 17 | References & Traceability | Assignment mapping and engineering references |

## Recommended Reading Order

1. Project Charter
2. PRD
3. Architecture
4. Technical Design
5. Data Model
6. API Contract
7. State & Data Flow
8. Offline & Sync
9. Performance
10. Testing & QA
11. UI/UX
12. Security & Reliability
13. Implementation Plan
14. Folder Structure
15. ADRs
16. README
17. AI Development Guide

## Important Implementation Position

Do not build a backend or microservice architecture for this assignment. The assignment explicitly permits mocked/generated data. Implement a realistic repository/API boundary so a real backend can replace the mock implementation later.

The highest-value engineering areas are:

- Correct architecture
- Reliable booking rules
- Offline queue/synchronization
- Large-list performance
- Clear state ownership
- Failure handling
- Tests
- Developer documentation
