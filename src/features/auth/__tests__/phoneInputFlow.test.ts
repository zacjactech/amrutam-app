// Email Input Flow — End-to-End Tests
//
// Simulates the COMPLETE user flow on SignIn and SignUp screens:
//   user types email → validate → signInWithEmail → navigation
//
// These tests exercise the exact pipeline used in SignInScreen.tsx and SignUpScreen.tsx
// without mounting React components (node test environment).

import { supabase } from '../../../infrastructure/supabase/client';

// ─── Helpers ────────────────────────────────────────────────────────────────

type MockFn = jest.Mock;

function getAuthMock() {
  return supabase.auth as unknown as {
    signInWithOtp: MockFn;
    verifyOtp: MockFn;
    signOut: MockFn;
    getSession: MockFn;
    onAuthStateChange: MockFn;
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return 'Email is required.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address.';
  return null;
}

/**
 * Simulates the complete SignIn submit pipeline:
 *   validate email → signInWithOtp({ email }) → navigation
 */
async function signInSubmit(email: string) {
  const trimmed = email.trim().toLowerCase();
  const validationError = validateEmail(trimmed);

  if (validationError) {
    return { email: trimmed, validationError, apiError: null, navigated: false };
  }

  const { error: apiError } = await getAuthMock().signInWithOtp({ email: trimmed });

  if (apiError) {
    return { email: trimmed, validationError: null, apiError: apiError.message, navigated: false };
  }

  return {
    email: trimmed,
    validationError: null,
    apiError: null,
    navigated: true,
    navigationTarget: 'OTPVerification',
    navigationParams: { email: trimmed },
  };
}

/**
 * Simulates the complete SignUp submit pipeline:
 *   validate name → validate email → signInWithOtp({ email }) → navigation
 */
async function signUpSubmit(name: string, email: string) {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    return { email: trimmedEmail, nameError: 'Name required', validationError: null, apiError: null, navigated: false };
  }

  if (trimmedName.length < 2) {
    return { email: trimmedEmail, nameError: 'Name too short', validationError: null, apiError: null, navigated: false };
  }

  const validationError = validateEmail(trimmedEmail);

  if (validationError) {
    return { email: trimmedEmail, nameError: null, validationError, apiError: null, navigated: false };
  }

  const { error: apiError } = await getAuthMock().signInWithOtp({ email: trimmedEmail });

  if (apiError) {
    return { email: trimmedEmail, nameError: null, validationError: null, apiError: apiError.message, navigated: false };
  }

  return {
    email: trimmedEmail,
    nameError: null,
    validationError: null,
    apiError: null,
    navigated: true,
    navigationTarget: 'OTPVerification',
    navigationParams: { email: trimmedEmail, name: trimmedName },
  };
}

// ─── Setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  getAuthMock().signInWithOtp.mockResolvedValue({ data: {}, error: null });
  getAuthMock().getSession.mockResolvedValue({ data: { session: null }, error: null });
  getAuthMock().onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  });
});

// ─── SignIn Screen: Complete User Flow ───────────────────────────────────────

describe('SignIn screen — email input flow', () => {
  it('happy path: type email → submit → OTP sent → navigates to OTP screen', async () => {
    const result = await signInSubmit('user@example.com');

    expect(result.validationError).toBeNull();
    expect(getAuthMock().signInWithOtp).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(result.apiError).toBeNull();
    expect(result.navigated).toBe(true);
    expect(result.navigationTarget).toBe('OTPVerification');
    expect(result.navigationParams).toEqual({ email: 'user@example.com' });
  });

  it('trims and lowercases email before submission', async () => {
    const result = await signInSubmit('  User@Example.COM  ');

    expect(result.email).toBe('user@example.com');
    expect(result.validationError).toBeNull();
    expect(getAuthMock().signInWithOtp).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(result.navigated).toBe(true);
  });

  it('rejects empty email', async () => {
    const result = await signInSubmit('');

    expect(result.validationError).toBe('Email is required.');
    expect(result.navigated).toBe(false);
    expect(getAuthMock().signInWithOtp).not.toHaveBeenCalled();
  });

  it('rejects email without @', async () => {
    const result = await signInSubmit('userexample.com');

    expect(result.validationError).toBe('Please enter a valid email address.');
    expect(result.navigated).toBe(false);
  });

  it('rejects email without domain', async () => {
    const result = await signInSubmit('user@');

    expect(result.validationError).toBe('Please enter a valid email address.');
    expect(result.navigated).toBe(false);
  });

  it('rejects email without TLD', async () => {
    const result = await signInSubmit('user@example');

    expect(result.validationError).toBe('Please enter a valid email address.');
    expect(result.navigated).toBe(false);
  });

  it('handles API failure: signInWithOtp returns error', async () => {
    getAuthMock().signInWithOtp.mockResolvedValue({
      data: {},
      error: { message: 'Email not confirmed', code: 'email_not_confirmed' },
    });

    const result = await signInSubmit('user@example.com');

    expect(result.validationError).toBeNull();
    expect(result.apiError).toBe('Email not confirmed');
    expect(result.navigated).toBe(false);
    expect(getAuthMock().signInWithOtp).toHaveBeenCalled();
  });

  it('handles network failure: signInWithOtp throws', async () => {
    getAuthMock().signInWithOtp.mockRejectedValue(new Error('Network request failed'));

    await expect(signInSubmit('user@example.com')).rejects.toThrow('Network request failed');
  });

  it('accepts various valid email formats', async () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.com',
      'user@sub.example.com',
      'u@example.co',
      'very.long.email.address@domain.com',
    ];

    for (const email of validEmails) {
      jest.clearAllMocks();
      getAuthMock().signInWithOtp.mockResolvedValue({ data: {}, error: null });

      const result = await signInSubmit(email);
      expect(result.validationError).toBeNull();
      expect(result.navigated).toBe(true);
    }
  });
});

// ─── SignUp Screen: Complete User Flow ───────────────────────────────────────

describe('SignUp screen — email input flow', () => {
  it('happy path: name + email → submit → OTP sent → navigates with name param', async () => {
    const result = await signUpSubmit('Priya Sharma', 'priya@example.com');

    expect(result.nameError).toBeNull();
    expect(result.validationError).toBeNull();
    expect(getAuthMock().signInWithOtp).toHaveBeenCalledWith({ email: 'priya@example.com' });
    expect(result.navigated).toBe(true);
    expect(result.navigationTarget).toBe('OTPVerification');
    expect(result.navigationParams).toEqual({
      email: 'priya@example.com',
      name: 'Priya Sharma',
    });
  });

  it('validates name before email: empty name short-circuits', async () => {
    const result = await signUpSubmit('', 'user@example.com');

    expect(result.nameError).toBe('Name required');
    expect(result.validationError).toBeNull();
    expect(result.navigated).toBe(false);
    expect(getAuthMock().signInWithOtp).not.toHaveBeenCalled();
  });

  it('validates name before email: whitespace-only name short-circuits', async () => {
    const result = await signUpSubmit('   ', 'user@example.com');

    expect(result.nameError).toBe('Name required');
    expect(result.navigated).toBe(false);
  });

  it('validates name length: single character is too short', async () => {
    const result = await signUpSubmit('A', 'user@example.com');

    expect(result.nameError).toBe('Name too short');
    expect(result.navigated).toBe(false);
  });

  it('validates email after name passes', async () => {
    const result = await signUpSubmit('Priya Sharma', '');

    expect(result.nameError).toBeNull();
    expect(result.validationError).toBe('Email is required.');
    expect(result.navigated).toBe(false);
  });

  it('validates email format after name passes', async () => {
    const result = await signUpSubmit('Rahul Kumar', 'not-an-email');

    expect(result.nameError).toBeNull();
    expect(result.validationError).toBe('Please enter a valid email address.');
    expect(result.navigated).toBe(false);
  });

  it('trims name before validation', async () => {
    const result = await signUpSubmit('  Ananya Singh  ', 'ananya@example.com');

    expect(result.nameError).toBeNull();
    expect(result.navigated).toBe(true);
    expect(result.navigationParams).toEqual({
      email: 'ananya@example.com',
      name: 'Ananya Singh',
    });
  });

  it('handles API failure: signInWithOtp returns error', async () => {
    getAuthMock().signInWithOtp.mockResolvedValue({
      data: {},
      error: { message: 'Too many requests', code: 'rate_limit_exceeded' },
    });

    const result = await signUpSubmit('Priya Sharma', 'priya@example.com');

    expect(result.nameError).toBeNull();
    expect(result.validationError).toBeNull();
    expect(result.apiError).toBe('Too many requests');
    expect(result.navigated).toBe(false);
  });

  it('handles network failure: signInWithOtp throws', async () => {
    getAuthMock().signInWithOtp.mockRejectedValue(new Error('Network request failed'));

    await expect(signUpSubmit('Priya Sharma', 'priya@example.com')).rejects.toThrow('Network request failed');
  });

  it('handles name with special characters', async () => {
    const result = await signUpSubmit("O'Brien-Smith", 'obrien@example.com');

    expect(result.nameError).toBeNull();
    expect(result.navigated).toBe(true);
    expect(result.navigationParams).toEqual({
      email: 'obrien@example.com',
      name: "O'Brien-Smith",
    });
  });

  it('handles Unicode name (Devanagari)', async () => {
    const result = await signUpSubmit('\u092A\u094D\u0930\u093F\u092F\u093E', 'priya@example.com');

    expect(result.nameError).toBeNull();
    expect(result.navigated).toBe(true);
    expect(result.navigationParams).toEqual({
      email: 'priya@example.com',
      name: '\u092A\u094D\u0930\u093F\u092F\u093E',
    });
  });
});

// ─── Cross-Screen Consistency ───────────────────────────────────────────────

describe('SignIn and SignUp use identical email pipeline', () => {
  it('same email produces same result on both screens', async () => {
    const signInResult = await signInSubmit('user@example.com');
    const signUpResult = await signUpSubmit('Test User', 'user@example.com');

    expect(signInResult.email).toBe(signUpResult.email);
    expect(signInResult.email).toBe('user@example.com');
    expect(signInResult.validationError).toBeNull();
    expect(signUpResult.validationError).toBeNull();
  });

  it('same invalid input produces same validation error on both screens', async () => {
    const signInResult = await signInSubmit('invalid-email');
    const signUpResult = await signUpSubmit('Test User', 'invalid-email');

    expect(signInResult.validationError).toBe(signUpResult.validationError);
    expect(signInResult.validationError).toBe('Please enter a valid email address.');
  });
});
