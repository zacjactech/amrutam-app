// Secure Logger - PII-safe structured logging

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /auth/i,
  /credit/i,
  /ssn/i,
  /social.security/i,
  /patient/i,
  /medical/i,
  /diagnosis/i,
  /prescription/i,
];

function sanitize(value: unknown): unknown {
  if (typeof value === 'string') {
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(value)) {
        return '[REDACTED]';
      }
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (value !== null && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (SENSITIVE_PATTERNS.some((p) => p.test(key))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(val);
      }
    }
    return sanitized;
  }

  return value;
}

function createEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };
  if (context !== undefined) {
    entry.context = sanitize(context) as Record<string, unknown>;
  }
  return entry;
}

function log(entry: LogEntry): void {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  const contextStr = entry.context !== undefined ? ` ${JSON.stringify(entry.context)}` : '';

  switch (entry.level) {
    case 'debug':
      if (__DEV__) {
        console.log(`${prefix} ${entry.message}${contextStr}`);
      }
      break;
    case 'info':
      console.log(`${prefix} ${entry.message}${contextStr}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${entry.message}${contextStr}`);
      break;
    case 'error':
      console.error(`${prefix} ${entry.message}${contextStr}`);
      break;
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>): void => {
    log(createEntry('debug', message, context));
  },
  info: (message: string, context?: Record<string, unknown>): void => {
    log(createEntry('info', message, context));
  },
  warn: (message: string, context?: Record<string, unknown>): void => {
    log(createEntry('warn', message, context));
  },
  error: (message: string, context?: Record<string, unknown>): void => {
    log(createEntry('error', message, context));
  },
};
