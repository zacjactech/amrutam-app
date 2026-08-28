// OTP Rate Limiter Tests

import { checkRateLimit, recordSend, resetRateLimit, getRateLimitStatus, clearAllRateLimits } from '../otpRateLimiter';

describe('OTP Rate Limiter', () => {
  beforeEach(() => {
    clearAllRateLimits();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('checkRateLimit', () => {
    it('allows first OTP send', () => {
      const result = checkRateLimit('+919876543210');
      expect(result.allowed).toBe(true);
      expect(result.cooldownSeconds).toBe(0);
      expect(result.sendsThisHour).toBe(0);
    });

    it('blocks send within cooldown period', () => {
      const phone = '+919876543210';
      recordSend(phone);

      const result = checkRateLimit(phone);
      expect(result.allowed).toBe(false);
      expect(result.cooldownSeconds).toBeGreaterThan(0);
      expect(result.message).toContain('Please wait');
    });

    it('allows send after cooldown expires', () => {
      const phone = '+919876543210';
      recordSend(phone);

      // Advance time past cooldown (60 seconds)
      jest.advanceTimersByTime(61_000);

      const result = checkRateLimit(phone);
      expect(result.allowed).toBe(true);
      expect(result.cooldownSeconds).toBe(0);
    });

    it('blocks send after max hourly limit', () => {
      const phone = '+919876543210';

      // Send 5 OTPs with cooldown gaps
      for (let i = 0; i < 5; i++) {
        recordSend(phone);
        jest.advanceTimersByTime(61_000); // Advance past cooldown
      }

      // Now we should be rate limited (5 per hour)
      const result = checkRateLimit(phone);
      expect(result.allowed).toBe(false);
      expect(result.sendsThisHour).toBe(5);
      expect(result.message).toContain('Too many OTP requests');
    });

    it('allows send after hourly window expires', () => {
      const phone = '+919876543210';

      // Send 5 OTPs (max per hour)
      for (let i = 0; i < 5; i++) {
        recordSend(phone);
        jest.advanceTimersByTime(61_000);
      }

      // Advance 1 hour from the first send
      jest.advanceTimersByTime(3_600_000);

      const result = checkRateLimit(phone);
      expect(result.allowed).toBe(true);
      expect(result.sendsThisHour).toBe(0);
    });

    it('tracks different phone numbers independently', () => {
      const phone1 = '+919876543210';
      const phone2 = '+14155552671';

      recordSend(phone1);

      // Phone 1 should be rate limited
      expect(checkRateLimit(phone1).allowed).toBe(false);

      // Phone 2 should still be allowed
      expect(checkRateLimit(phone2).allowed).toBe(true);
    });
  });

  describe('recordSend', () => {
    it('records a send timestamp', () => {
      const phone = '+919876543210';
      recordSend(phone);

      const status = getRateLimitStatus(phone);
      expect(status.sendsThisHour).toBe(1);
    });

    it('increments send count', () => {
      const phone = '+919876543210';
      recordSend(phone);
      jest.advanceTimersByTime(61_000);
      recordSend(phone);

      const status = getRateLimitStatus(phone);
      expect(status.sendsThisHour).toBe(2);
    });
  });

  describe('resetRateLimit', () => {
    it('clears rate limit for a phone number', () => {
      const phone = '+919876543210';
      recordSend(phone);

      expect(checkRateLimit(phone).allowed).toBe(false);

      resetRateLimit(phone);

      expect(checkRateLimit(phone).allowed).toBe(true);
      expect(getRateLimitStatus(phone).sendsThisHour).toBe(0);
    });
  });

  describe('getRateLimitStatus', () => {
    it('returns zero state for unknown phone', () => {
      const status = getRateLimitStatus('+919876543210');
      expect(status.sendsThisHour).toBe(0);
      expect(status.nextAllowedAt).toBeNull();
    });

    it('returns next allowed time after a send', () => {
      const phone = '+919876543210';
      const before = Date.now();
      recordSend(phone);

      const status = getRateLimitStatus(phone);
      expect(status.nextAllowedAt).toBeGreaterThanOrEqual(before + 60_000);
      expect(status.nextAllowedAt).toBeLessThanOrEqual(before + 61_000);
    });
  });

  describe('clearAllRateLimits', () => {
    it('clears all rate limit data', () => {
      recordSend('+919876543210');
      recordSend('+14155552671');

      clearAllRateLimits();

      expect(checkRateLimit('+919876543210').allowed).toBe(true);
      expect(checkRateLimit('+14155552671').allowed).toBe(true);
    });
  });

  describe('cooldown message formatting', () => {
    it('formats singular second correctly', () => {
      const phone = '+919876543210';
      recordSend(phone);

      // Just barely within cooldown
      jest.advanceTimersByTime(59_000);
      const result = checkRateLimit(phone);
      expect(result.message).toMatch(/1 second/);
      expect(result.message).not.toMatch(/1 seconds/);
    });

    it('formats plural seconds correctly', () => {
      const phone = '+919876543210';
      recordSend(phone);

      jest.advanceTimersByTime(30_000);
      const result = checkRateLimit(phone);
      expect(result.message).toMatch(/\d+ seconds/);
    });

    it('formats minutes for hourly limit', () => {
      const phone = '+919876543210';

      // Send 5 OTPs to hit hourly limit
      for (let i = 0; i < 5; i++) {
        recordSend(phone);
        jest.advanceTimersByTime(61_000);
      }

      const result = checkRateLimit(phone);
      expect(result.message).toMatch(/minute/);
    });
  });
});
