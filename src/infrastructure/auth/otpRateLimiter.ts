// OTP Rate Limiter - Prevents abuse of the OTP send flow
//
// Rules:
//   - Minimum 60 seconds between OTP sends per phone number
//   - Maximum 5 OTP sends per hour per phone number
//
// Tracks timestamps in-memory per phone number. Designed for per-device
// mobile usage; Supabase also enforces server-side rate limits.

import { logger } from '../logging/logger';

const COOLDOWN_MS = 60_000; // 60 seconds between sends
const MAX_PER_HOUR = 5;     // Max sends per rolling hour
const HOUR_MS = 3_600_000;  // 1 hour in milliseconds

interface RateLimitEntry {
  /** Timestamps of recent OTP send attempts (ms since epoch) */
  sends: number[];
}

/**
 * In-memory store of rate limit data per phone number.
 * Keyed by normalized phone number (E.164 format).
 */
const store = new Map<string, RateLimitEntry>();

function normalizePhone(phone: string): string {
  return phone.trim();
}

function pruneOldTimestamps(entry: RateLimitEntry, now: number): void {
  const cutoff = now - HOUR_MS;
  entry.sends = entry.sends.filter((ts) => ts > cutoff);
}

export interface RateLimitResult {
  /** Whether the OTP send is allowed */
  allowed: boolean;
  /** Seconds until the next OTP can be sent (0 if allowed) */
  cooldownSeconds: number;
  /** Number of OTPs sent in the current hour */
  sendsThisHour: number;
  /** User-friendly message explaining the rate limit */
  message: string;
}

/**
 * Check whether an OTP can be sent to the given phone number.
 * Does NOT record the send — call `recordSend()` after a successful send.
 */
export function checkRateLimit(phone: string): RateLimitResult {
  const now = Date.now();
  const key = normalizePhone(phone);
  const entry = store.get(key);

  if (!entry) {
    return {
      allowed: true,
      cooldownSeconds: 0,
      sendsThisHour: 0,
      message: '',
    };
  }

  pruneOldTimestamps(entry, now);

  // Check cooldown (minimum 60s between sends)
  const lastSend = entry.sends[entry.sends.length - 1];
  if (lastSend !== undefined) {
    const elapsed = now - lastSend;
    if (elapsed < COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
      return {
        allowed: false,
        cooldownSeconds: remainingSeconds,
        sendsThisHour: entry.sends.length,
        message: `Please wait ${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'} before requesting another OTP.`,
      };
    }
  }

  // Check hourly limit
  if (entry.sends.length >= MAX_PER_HOUR) {
    const oldestInWindow = entry.sends[0]!;
    const remainingSeconds = Math.ceil((oldestInWindow + HOUR_MS - now) / 1000);
    const remainingMinutes = Math.ceil(remainingSeconds / 60);
    return {
      allowed: false,
      cooldownSeconds: remainingSeconds,
      sendsThisHour: entry.sends.length,
      message: `Too many OTP requests. Please try again in ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}.`,
    };
  }

  return {
    allowed: true,
    cooldownSeconds: 0,
    sendsThisHour: entry.sends.length,
    message: '',
  };
}

/**
 * Record a successful OTP send for the given phone number.
 * Call this AFTER the Supabase API call succeeds.
 */
export function recordSend(phone: string): void {
  const now = Date.now();
  const key = normalizePhone(phone);
  let entry = store.get(key);

  if (!entry) {
    entry = { sends: [] };
    store.set(key, entry);
  }

  pruneOldTimestamps(entry, now);
  entry.sends.push(now);

  logger.debug('OTP rate limit: recorded send', {
    phone: key,
    sendsThisHour: entry.sends.length,
  });
}

/**
 * Reset rate limit state for a phone number.
 * Useful for testing or after a successful OTP verification.
 */
export function resetRateLimit(phone: string): void {
  const key = normalizePhone(phone);
  store.delete(key);
}

/**
 * Get the current rate limit status for a phone number (read-only check).
 */
export function getRateLimitStatus(phone: string): { sendsThisHour: number; nextAllowedAt: number | null } {
  const now = Date.now();
  const key = normalizePhone(phone);
  const entry = store.get(key);

  if (!entry) {
    return { sendsThisHour: 0, nextAllowedAt: null };
  }

  pruneOldTimestamps(entry, now);

  const lastSend = entry.sends[entry.sends.length - 1];
  const nextAllowedAt = lastSend !== undefined ? lastSend + COOLDOWN_MS : null;

  return {
    sendsThisHour: entry.sends.length,
    nextAllowedAt,
  };
}

/**
 * Clear all rate limit data. Primarily for testing.
 */
export function clearAllRateLimits(): void {
  store.clear();
}
