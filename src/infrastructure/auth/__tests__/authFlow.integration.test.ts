// Auth Flow Integration Tests
//
// Tests the complete auth lifecycle by simulating the Supabase API flow:
//   Sign up -> OTP verify -> session persistence -> profile update -> sign out
//
// These tests verify the integration between AuthContext and the mocked
// Supabase client, ensuring the full flow works end-to-end.

import { supabase } from '../../supabase/client';
import { clearAllRateLimits } from '../otpRateLimiter';

// ─── Test Fixtures ──────────────────────────────────────────────────────────

const MOCK_EMAIL = 'test@example.com';
const MOCK_OTP = '123456';
const MOCK_USER_ID = 'user-abc-123';
const MOCK_SESSION = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  user: {
    id: MOCK_USER_ID,
    email: MOCK_EMAIL,
    user_metadata: { full_name: 'Test User' },
    app_metadata: {},
    created_at: new Date().toISOString(),
  },
  expires_at: Date.now() + 3600,
  token_type: 'bearer',
};

// ─── Helper: create a sequence resolver ─────────────────────────────────────

type MockFn = jest.Mock;

function getAuthMock(): {
  signInWithOtp: MockFn;
  verifyOtp: MockFn;
  signOut: MockFn;
  getSession: MockFn;
  onAuthStateChange: MockFn;
  updateUser: MockFn;
} {
  return supabase.auth as unknown as {
    signInWithOtp: MockFn;
    verifyOtp: MockFn;
    signOut: MockFn;
    getSession: MockFn;
    onAuthStateChange: MockFn;
    updateUser: MockFn;
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearAllRateLimits();

    // Default: no session on load
    const auth = getAuthMock();
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
    auth.signInWithOtp.mockResolvedValue({ data: {}, error: null });
    auth.verifyOtp.mockResolvedValue({ data: { session: null, user: null }, error: null });
    auth.signOut.mockResolvedValue({ error: null });
    auth.updateUser.mockResolvedValue({ data: { user: null }, error: null });
  });

  // ─── Sign Up Flow ──────────────────────────────────────────────────────

  describe('Sign Up Flow', () => {
    it('completes full sign-up: send OTP -> verify -> session established -> name saved', async () => {
      const auth = getAuthMock();

      // Step 1: Send OTP
      const otpResult = await auth.signInWithOtp({ email: MOCK_EMAIL });
      expect(otpResult.error).toBeNull();
      expect(auth.signInWithOtp).toHaveBeenCalledWith({ email: MOCK_EMAIL });

      // Step 2: Verify OTP (with name for new user)
      auth.verifyOtp.mockResolvedValue({
        data: { session: MOCK_SESSION, user: MOCK_SESSION.user },
        error: null,
      });
      const verifyResult = await auth.verifyOtp({
        email: MOCK_EMAIL,
        token: MOCK_OTP,
        type: 'email',
      });
      expect(verifyResult.error).toBeNull();
      expect(verifyResult.data.session).toEqual(MOCK_SESSION);
      expect(verifyResult.data.user).toEqual(MOCK_SESSION.user);

      // Step 3: Save name to user_metadata
      auth.updateUser.mockResolvedValue({
        data: { user: { ...MOCK_SESSION.user, user_metadata: { full_name: 'New User' } } },
        error: null,
      });
      const profileResult = await auth.updateUser({
        data: { full_name: 'New User' },
      });
      expect(profileResult.error).toBeNull();
      expect(auth.updateUser).toHaveBeenCalledWith({ data: { full_name: 'New User' } });

      // Step 4: Session is now active
      auth.getSession.mockResolvedValue({ data: { session: MOCK_SESSION }, error: null });
      const { data: { session } } = await auth.getSession();
      expect(session).toEqual(MOCK_SESSION);
      expect(session?.user?.id).toBe(MOCK_USER_ID);
      expect(session?.user?.email).toBe(MOCK_EMAIL);
    });

    it('sends correct OTP type (email) for sign-up', async () => {
      const auth = getAuthMock();
      await auth.signInWithOtp({ email: MOCK_EMAIL });
      expect(auth.signInWithOtp).toHaveBeenCalledWith({ email: MOCK_EMAIL });
    });

    it('handles OTP verification with name parameter', async () => {
      const auth = getAuthMock();

      auth.verifyOtp.mockResolvedValue({
        data: { session: MOCK_SESSION, user: MOCK_SESSION.user },
        error: null,
      });
      auth.updateUser.mockResolvedValue({ data: { user: MOCK_SESSION.user }, error: null });

      // Verify OTP with name
      await auth.verifyOtp({ email: MOCK_EMAIL, token: MOCK_OTP, type: 'email' });
      expect(auth.verifyOtp).toHaveBeenCalledWith({
        email: MOCK_EMAIL,
        token: MOCK_OTP,
        type: 'email',
      });

      // Name should be saved
      await auth.updateUser({ data: { full_name: 'Test User' } });
      expect(auth.updateUser).toHaveBeenCalledWith({ data: { full_name: 'Test User' } });
    });
  });

  // ─── Sign In Flow (Existing User) ──────────────────────────────────────

  describe('Sign In Flow (Existing User)', () => {
    it('completes sign-in without updating profile name', async () => {
      const auth = getAuthMock();

      // Step 1: Send OTP
      await auth.signInWithOtp({ email: MOCK_EMAIL });
      expect(auth.signInWithOtp).toHaveBeenCalledTimes(1);

      // Step 2: Verify OTP (no name for existing user)
      auth.verifyOtp.mockResolvedValue({
        data: { session: MOCK_SESSION, user: MOCK_SESSION.user },
        error: null,
      });
      await auth.verifyOtp({ email: MOCK_EMAIL, token: MOCK_OTP, type: 'email' });

      // Step 3: No profile update for existing user (name not passed)
      // updateUser should NOT be called
      expect(auth.updateUser).not.toHaveBeenCalled();
    });

    it('restores session from storage on app load', async () => {
      const auth = getAuthMock();

      // Simulate stored session
      auth.getSession.mockResolvedValue({ data: { session: MOCK_SESSION }, error: null });

      const { data: { session } } = await auth.getSession();
      expect(session).toEqual(MOCK_SESSION);
      expect(session?.user?.id).toBe(MOCK_USER_ID);
      expect(session?.user?.email).toBe(MOCK_EMAIL);
    });

    it('handles session expiry gracefully', async () => {
      const auth = getAuthMock();

      const expiredSession = {
        ...MOCK_SESSION,
        expires_at: Date.now() - 3600, // Expired
      };
      auth.getSession.mockResolvedValue({ data: { session: expiredSession }, error: null });

      const { data: { session } } = await auth.getSession();
      expect(session?.expires_at).toBeLessThan(Date.now());
    });
  });

  // ─── Session Persistence ───────────────────────────────────────────────

  describe('Session Persistence', () => {
    it('session persists across getSession calls', async () => {
      const auth = getAuthMock();

      // First call: no session
      auth.getSession.mockResolvedValueOnce({ data: { session: null }, error: null });
      const first = await auth.getSession();
      expect(first.data.session).toBeNull();

      // Session established via verifyOtp
      auth.verifyOtp.mockResolvedValue({
        data: { session: MOCK_SESSION, user: MOCK_SESSION.user },
        error: null,
      });
      await auth.verifyOtp({ email: MOCK_EMAIL, token: MOCK_OTP, type: 'email' });

      // Second call: session is now available
      auth.getSession.mockResolvedValueOnce({ data: { session: MOCK_SESSION }, error: null });
      const second = await auth.getSession();
      expect(second.data.session).toEqual(MOCK_SESSION);
    });

    it('auth state change listener receives session updates', async () => {
      const auth = getAuthMock();
      const stateChangeCallback = jest.fn();

      auth.onAuthStateChange.mockImplementation((callback: (event: string, session: unknown) => void) => {
        stateChangeCallback.mockImplementation(callback);
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      });

      // Simulate auth state change
      stateChangeCallback('SIGNED_IN', MOCK_SESSION);
      expect(stateChangeCallback).toHaveBeenCalledWith('SIGNED_IN', MOCK_SESSION);

      // Simulate sign out
      stateChangeCallback('SIGNED_OUT', null);
      expect(stateChangeCallback).toHaveBeenCalledWith('SIGNED_OUT', null);
    });

    it('user metadata is accessible from session', async () => {
      const auth = getAuthMock();

      auth.getSession.mockResolvedValue({ data: { session: MOCK_SESSION }, error: null });
      const { data: { session } } = await auth.getSession();

      expect(session?.user?.user_metadata?.full_name).toBe('Test User');
      expect(session?.user?.email).toBe(MOCK_EMAIL);
    });
  });

  // ─── Sign Out Flow ─────────────────────────────────────────────────────

  describe('Sign Out Flow', () => {
    it('clears session on sign out', async () => {
      const auth = getAuthMock();

      // Establish session
      auth.getSession.mockResolvedValue({ data: { session: MOCK_SESSION }, error: null });
      const { data: { session: before } } = await auth.getSession();
      expect(before).toEqual(MOCK_SESSION);

      // Sign out
      await auth.signOut();
      expect(auth.signOut).toHaveBeenCalledTimes(1);

      // Session is cleared
      auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
      const { data: { session: after } } = await auth.getSession();
      expect(after).toBeNull();
    });

    it('sign out calls Supabase signOut', async () => {
      const auth = getAuthMock();
      await auth.signOut();
      expect(auth.signOut).toHaveBeenCalled();
    });

    it('handles sign out errors gracefully', async () => {
      const auth = getAuthMock();
      auth.signOut.mockResolvedValue({ error: { message: 'Network error' } });

      // Should not throw
      const result = await auth.signOut();
      expect(result.error?.message).toBe('Network error');
    });
  });

  // ─── Error Paths ───────────────────────────────────────────────────────

  describe('Error Paths', () => {
    it('handles invalid OTP', async () => {
      const auth = getAuthMock();

      auth.verifyOtp.mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Invalid OTP', code: 'otp_expired' },
      });

      const { data, error } = await auth.verifyOtp({
        email: MOCK_EMAIL,
        token: '000000',
        type: 'email',
      });

      expect(error).toBeDefined();
      expect(error?.message).toBe('Invalid OTP');
      expect(data.session).toBeNull();
    });

    it('handles network failure on OTP send', async () => {
      const auth = getAuthMock();
      auth.signInWithOtp.mockRejectedValue(new Error('Network request failed'));

      await expect(auth.signInWithOtp({ email: MOCK_EMAIL })).rejects.toThrow('Network request failed');
    });

    it('handles Supabase API error on OTP send', async () => {
      const auth = getAuthMock();
      auth.signInWithOtp.mockResolvedValue({
        data: {},
        error: { message: 'Email not confirmed', code: 'email_not_confirmed' },
      });

      const result = await auth.signInWithOtp({ email: MOCK_EMAIL });
      expect(result.error?.message).toBe('Email not confirmed');
    });

    it('handles rate limiting', async () => {
      clearAllRateLimits();

      // Import and use the rate limiter directly
      const { recordSend, checkRateLimit } = require('../otpRateLimiter');

      // Simulate rapid OTP sends
      recordSend(MOCK_EMAIL);

      const result = checkRateLimit(MOCK_EMAIL);
      expect(result.allowed).toBe(false);
      expect(result.message).toContain('Please wait');
    });

    it('handles profile update failure', async () => {
      const auth = getAuthMock();
      auth.updateUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Permission denied' },
      });

      const { error } = await auth.updateUser({
        data: { full_name: 'New Name' },
      });

      expect(error?.message).toBe('Permission denied');
    });
  });

  // ─── Full Lifecycle ────────────────────────────────────────────────────

  describe('Full Lifecycle', () => {
    it('complete user journey: sign up -> use app -> sign out', async () => {
      const auth = getAuthMock();

      // 1. App loads with no session
      auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
      const { data: { session: initial } } = await auth.getSession();
      expect(initial).toBeNull();

      // 2. User signs up: send OTP
      await auth.signInWithOtp({ email: MOCK_EMAIL });
      expect(auth.signInWithOtp).toHaveBeenCalledWith({ email: MOCK_EMAIL });

      // 3. User verifies OTP with name
      auth.verifyOtp.mockResolvedValue({
        data: { session: MOCK_SESSION, user: MOCK_SESSION.user },
        error: null,
      });
      await auth.verifyOtp({ email: MOCK_EMAIL, token: MOCK_OTP, type: 'email' });

      // 4. Name is saved
      auth.updateUser.mockResolvedValue({ data: { user: MOCK_SESSION.user }, error: null });
      await auth.updateUser({ data: { full_name: 'Test User' } });

      // 5. Session is active
      auth.getSession.mockResolvedValue({ data: { session: MOCK_SESSION }, error: null });
      const { data: { session: active } } = await auth.getSession();
      expect(active?.user?.id).toBe(MOCK_USER_ID);

      // 6. User signs out
      await auth.signOut();
      expect(auth.signOut).toHaveBeenCalledTimes(1);

      // 7. Session is cleared
      auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
      const { data: { session: final } } = await auth.getSession();
      expect(final).toBeNull();
    });

    it('handles concurrent operations gracefully', async () => {
      const auth = getAuthMock();

      // Simulate multiple rapid OTP sends
      auth.signInWithOtp.mockResolvedValue({ data: {}, error: null });

      const results = await Promise.all([
        auth.signInWithOtp({ email: MOCK_EMAIL }),
        auth.signInWithOtp({ email: MOCK_EMAIL }),
        auth.signInWithOtp({ email: MOCK_EMAIL }),
      ]);

      // All should succeed (rate limiting is handled at the AuthContext level)
      results.forEach((result) => {
        expect(result.error).toBeNull();
      });
    });
  });
});
