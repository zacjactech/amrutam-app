// Secure Logger - PII-safe structured logging

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

/** Patterns that match against object keys (more aggressive — covers names, phone, etc.) */
const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /credit/i,
  /card[_-]?number/i,
  /ssn/i,
  /social[_-]?security/i,
  /phone/i,
  /full[_-]?name/i,
  /userName/i,
  /^name$/i,
];

/** Patterns that match against string values (restrictive — avoids matching error messages) */
const SENSITIVE_VALUE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /credit/i,
  /card[_-]?number/i,
  /ssn/i,
  /social[_-]?security/i,
];

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((p) => p.test(key));
}

function sanitize(value: unknown): unknown {
  if (typeof value === 'string') {
    for (const pattern of SENSITIVE_VALUE_PATTERNS) {
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
      if (isSensitiveKey(key)) {
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

function sanitizeMessage(message: string): string {
  return message.replace(/[\r\n]/g, ' ');
}

function log(entry: LogEntry): void {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  const safeMessage = sanitizeMessage(entry.message);
  const contextStr = entry.context !== undefined ? ` ${JSON.stringify(entry.context)}` : '';

  switch (entry.level) {
    case 'debug':
      if (__DEV__) {
        console.log(`${prefix} ${safeMessage}${contextStr}`);
      }
      break;
    case 'info':
      console.log(`${prefix} ${safeMessage}${contextStr}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${safeMessage}${contextStr}`);
      break;
    case 'error':
      console.error(`${prefix} ${safeMessage}${contextStr}`);
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
