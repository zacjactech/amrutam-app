# Security, Reliability and Failure Management

## 1. Security Principles

Even though this is an assessment with mocked APIs, implement production-minded boundaries.

## 2. Sensitive Data

Health records can contain sensitive information. Avoid logging full records, attachments, or personally identifiable medical information.

## 3. Local Storage

Use structured local storage for required offline data. Avoid storing secrets in plain text.

For a production app, authentication tokens should use secure platform storage. This assessment can abstract that behind:

```ts
interface SecureStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}
```

## 4. Authentication

Authentication is not required by the assignment, but session-expiration handling is.

The API layer should map:

```text
401 SESSION_EXPIRED
```

to a central session-expired event.

Do not allow individual screens to implement independent session handling.

## 5. Error Classification

```ts
type ErrorKind =
  | "network"
  | "timeout"
  | "server"
  | "validation"
  | "conflict"
  | "expired"
  | "session"
  | "invalid-response"
  | "unknown";
```

The UI maps error kinds to user actions.

## 6. Error Boundary

Use an application-level Error Boundary for unexpected render errors.

The Error Boundary is not a substitute for handling API failures.

## 7. Timeouts

Every remote request must have a bounded timeout.

Do not leave a promise pending indefinitely.

## 8. Malformed Data

External responses must be schema-validated.

```text
network response
 ↓
parse
 ↓
validate
 ↓
map
 ↓
use
```

Invalid data should produce an `INVALID_RESPONSE` error.

## 9. Idempotency

All offline mutations that can be retried must have stable idempotency identifiers.

## 10. Session Expiration

Central flow:

```text
API 401
 ↓
API interceptor
 ↓
Session manager
 ↓
Attempt refresh if supported
 ↓
otherwise clear session
 ↓
navigate to authentication/recovery state
```

For this assignment, a mock session-expired state is sufficient.

## 11. Privacy

Do not include health record content in:

- Analytics events
- Debug logs
- Crash metadata
- Performance labels

Use IDs or redacted metadata.
