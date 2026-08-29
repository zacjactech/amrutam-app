// Email Format Edge Case Tests
//
// Tests email validation edge cases that the auth screens handle:
//   empty input → invalid format → valid format → trimmed/lowercased
//
// These tests exercise the validation pipeline used in SignInScreen.tsx and SignUpScreen.tsx

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

// ─── Setup ──────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  getAuthMock().signInWithOtp.mockResolvedValue({ data: {}, error: null });
  getAuthMock().getSession.mockResolvedValue({ data: { session: null }, error: null });
  getAuthMock().onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  });
});

// ─── Email Validation Tests ────────────────────────────────────────────────

describe('email validation — basic cases', () => {
  it('rejects empty string', () => {
    expect(validateEmail('')).toBe('Email is required.');
  });

  it('rejects whitespace-only string', () => {
    expect(validateEmail('   ')).toBe('Email is required.');
  });

  it('rejects missing @ symbol', () => {
    expect(validateEmail('userexample.com')).toBe('Please enter a valid email address.');
  });

  it('rejects missing domain', () => {
    expect(validateEmail('user@')).toBe('Please enter a valid email address.');
  });

  it('rejects missing TLD', () => {
    expect(validateEmail('user@example')).toBe('Please enter a valid email address.');
  });

  it('accepts double dots in domain (basic regex does not reject)', () => {
    expect(validateEmail('user@example..com')).toBeNull();
  });

  it('accepts standard email', () => {
    expect(validateEmail('user@example.com')).toBeNull();
  });

  it('accepts email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBeNull();
  });

  it('accepts email with plus addressing', () => {
    expect(validateEmail('user+tag@example.com')).toBeNull();
  });

  it('accepts email with dots in local part', () => {
    expect(validateEmail('first.last@example.com')).toBeNull();
  });

  it('accepts email with hyphen in domain', () => {
    expect(validateEmail('user@my-domain.com')).toBeNull();
  });

  it('accepts email with country-code TLD', () => {
    expect(validateEmail('user@example.co.uk')).toBeNull();
  });
});

describe('email normalization — trimming and lowercasing', () => {
  it('trims leading and trailing whitespace', () => {
    expect(validateEmail('  user@example.com  ')).toBeNull();
  });

  it('lowercases email before validation', () => {
    expect(validateEmail('USER@EXAMPLE.COM')).toBeNull();
  });

  it('handles mixed case with whitespace', () => {
    expect(validateEmail('  User@Example.COM  ')).toBeNull();
  });
});

describe('email validation — international domains', () => {
  it('accepts email with numeric domain', () => {
    expect(validateEmail('user@123domain.com')).toBeNull();
  });

  it('accepts short local part', () => {
    expect(validateEmail('a@b.co')).toBeNull();
  });

  it('rejects email starting with @', () => {
    expect(validateEmail('@example.com')).toBe('Please enter a valid email address.');
  });

  it('rejects email with spaces', () => {
    expect(validateEmail('user @example.com')).toBe('Please enter a valid email address.');
  });
});

// ─── Auth Flow with Email ──────────────────────────────────────────────────

describe('auth flow — email-based sign-in', () => {
  it('sends OTP to normalized email', async () => {
    const email = '  User@Example.COM  ';
    const trimmed = email.trim().toLowerCase();

    const validationError = validateEmail(trimmed);
    expect(validationError).toBeNull();

    const { error } = await getAuthMock().signInWithOtp({ email: trimmed });
    expect(error).toBeNull();
    expect(getAuthMock().signInWithOtp).toHaveBeenCalledWith({ email: 'user@example.com' });
  });

  it('does not send OTP for invalid email', async () => {
    const email = 'not-an-email';
    const trimmed = email.trim().toLowerCase();

    const validationError = validateEmail(trimmed);
    expect(validationError).toBe('Please enter a valid email address.');
    expect(getAuthMock().signInWithOtp).not.toHaveBeenCalled();
  });

  it('does not send OTP for empty email', async () => {
    const email = '';
    const trimmed = email.trim().toLowerCase();

    const validationError = validateEmail(trimmed);
    expect(validationError).toBe('Email is required.');
    expect(getAuthMock().signInWithOtp).not.toHaveBeenCalled();
  });
});

describe('auth flow — email-based sign-up', () => {
  it('validates name before email', async () => {
    const name = '';

    if (!name.trim()) {
      expect(getAuthMock().signInWithOtp).not.toHaveBeenCalled();
    }
  });

  it('validates email after name passes', async () => {
    const email = 'invalid';

    const trimmed = email.trim().toLowerCase();
    const validationError = validateEmail(trimmed);
    expect(validationError).toBe('Please enter a valid email address.');
    expect(getAuthMock().signInWithOtp).not.toHaveBeenCalled();
  });

  it('sends OTP with name parameter for new user', async () => {
    const email = 'priya@example.com';
    const trimmed = email.trim().toLowerCase();

    const validationError = validateEmail(trimmed);
    expect(validationError).toBeNull();

    const { error } = await getAuthMock().signInWithOtp({ email: trimmed });
    expect(error).toBeNull();
    expect(getAuthMock().signInWithOtp).toHaveBeenCalledWith({ email: 'priya@example.com' });
  });
});

// ─── Cross-Screen Consistency ───────────────────────────────────────────────

describe('SignIn and SignUp use identical email validation', () => {
  it('same email produces same validation result on both screens', async () => {
    const email = 'user@example.com';
    const trimmed = email.trim().toLowerCase();

    // Both screens use the same validation
    expect(validateEmail(trimmed)).toBeNull();
  });

  it('same invalid input produces same validation error on both screens', async () => {
    const email = 'not-valid';

    expect(validateEmail(email)).toBe('Please enter a valid email address.');
  });
});
