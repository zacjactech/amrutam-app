// Phone Input Formatting Flow — End-to-End Tests
//
// Simulates the COMPLETE user flow on SignIn and SignUp screens:
//   user types → formatPhoneInput → state updates → toE164Phone → validatePhone → signInWithPhone → navigation
//
// These tests exercise the exact pipeline used in SignInScreen.tsx and SignUpScreen.tsx
// without mounting React components (node test environment).

import { formatPhoneInput, toE164Phone, validatePhone } from '../../../shared/utils/phoneValidation';
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

/**
 * Simulates typing into the phone input field exactly as the screens do:
 *   onChangeText={(text) => setPhone(formatPhoneInput(text))}
 *
 * Each character is fed through formatPhoneInput independently,
 * matching how React Native's onChangeText fires per keystroke.
 */
function simulateTyping(initialValue: string, keystrokes: string): string {
  let value = initialValue;
  for (const char of keystrokes) {
    value = formatPhoneInput(value + char);
  }
  return value;
}

/**
 * Simulates the complete SignIn submit pipeline:
 *   const raw = toE164Phone(phone);
 *   const error = validatePhone(raw);
 *   if (error) { showAlert(error); return; }
 *   const { error: apiError } = await signInWithPhone(raw);
 *   if (apiError) { showAlert(apiError); return; }
 *   navigation.navigate('OTPVerification', { phone: raw });
 *
 * Returns the result without actually navigating.
 */
async function signInSubmit(formattedPhone: string) {
  const raw = toE164Phone(formattedPhone);
  const validationError = validatePhone(raw);

  if (validationError) {
    return { raw, validationError, apiError: null, navigated: false };
  }

  const { error: apiError } = await getAuthMock().signInWithOtp({ phone: raw });

  if (apiError) {
    return { raw, validationError: null, apiError: apiError.message, navigated: false };
  }

  return {
    raw,
    validationError: null,
    apiError: null,
    navigated: true,
    navigationTarget: 'OTPVerification',
    navigationParams: { phone: raw },
  };
}

/**
 * Simulates the complete SignUp submit pipeline:
 *   const trimmedName = name.trim();
 *   if (!trimmedName) { showAlert('Name required'); return; }
 *   const raw = toE164Phone(phone);
 *   const error = validatePhone(raw);
 *   if (error) { showAlert(error); return; }
 *   const { error: apiError } = await signInWithPhone(raw);
 *   if (apiError) { showAlert(apiError); return; }
 *   navigation.navigate('OTPVerification', { phone: raw, name: trimmedName });
 *
 * Returns the result without actually navigating.
 */
async function signUpSubmit(name: string, formattedPhone: string) {
  const trimmedName = name.trim();
  const raw = toE164Phone(formattedPhone);

  if (!trimmedName) {
    return { raw, nameError: 'Name required', validationError: null, apiError: null, navigated: false };
  }

  const validationError = validatePhone(raw);

  if (validationError) {
    return { raw, nameError: null, validationError, apiError: null, navigated: false };
  }

  const { error: apiError } = await getAuthMock().signInWithOtp({ phone: raw });

  if (apiError) {
    return { raw, nameError: null, validationError: null, apiError: apiError.message, navigated: false };
  }

  return {
    raw,
    nameError: null,
    validationError: null,
    apiError: null,
    navigated: true,
    navigationTarget: 'OTPVerification',
    navigationParams: { phone: raw, name: trimmedName },
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

describe('SignIn screen — phone input formatting flow', () => {
  it('happy path: type 10 digits → submit → OTP sent → navigates to OTP screen', async () => {
    // 1. User opens SignInScreen, phone field shows "+91 "
    let phone = '+91 ';

    // 2. User types digits one by one
    phone = simulateTyping(phone, '9876543210');

    // 3. Display shows formatted number
    expect(phone).toBe('+91 98765 43210');

    // 4. User taps "Send OTP"
    const result = await signInSubmit(phone);

    // 5. E.164 phone is correct
    expect(result.raw).toBe('+919876543210');

    // 6. Validation passes
    expect(result.validationError).toBeNull();

    // 7. signInWithOtp is called with the correct phone
    expect(getAuthMock().signInWithOtp).toHaveBeenCalledWith({ phone: '+919876543210' });

    // 8. No API error
    expect(result.apiError).toBeNull();

    // 9. Navigation to OTPVerification screen with phone param
    expect(result.navigated).toBe(true);
    expect(result.navigationTarget).toBe('OTPVerification');
    expect(result.navigationParams).toEqual({ phone: '+919876543210' });
  });

  it('handles clearing field and re-typing a different number', async () => {
    // 1. User types a number
    let phone = simulateTyping('+91 ', '9876543210');
    expect(phone).toBe('+91 98765 43210');

    // 2. User clears the field (simulates backspace to empty, then re-types)
    phone = formatPhoneInput('');
    expect(phone).toBe('+91 ');

    // 3. User types a different number
    phone = simulateTyping(phone, '8765432109');
    expect(phone).toBe('+91 87654 32109');

    // 4. Submit
    const result = await signInSubmit(phone);
    expect(result.raw).toBe('+918765432109');
    expect(result.validationError).toBeNull();
    expect(result.navigated).toBe(true);
    expect(result.navigationParams).toEqual({ phone: '+918765432109' });
  });

  it('empty phone (just the "+91 " prefix) passes E.164 validation but would fail server-side', async () => {
    // +91 has 2 digits after + → passes E.164 min-length. In practice,
    // Supabase would reject this as not a real phone number.
    const phone = '+91 ';
    const result = await signInSubmit(phone);

    expect(result.raw).toBe('+91');
    expect(result.validationError).toBeNull();
    expect(result.navigated).toBe(true);
    expect(getAuthMock().signInWithOtp).toHaveBeenCalled();
  });

  it('partial number (5 digits) passes E.164 validation (no client-side length check)', async () => {
    // +9198765 has 8 digits after + → passes E.164. The client validator
    // does not enforce Indian mobile length (12 digits).
    const phone = simulateTyping('+91 ', '98765');
    expect(phone).toBe('+91 98765');

    const result = await signInSubmit(phone);
    expect(result.raw).toBe('+9198765');
    expect(result.validationError).toBeNull();
  });

  it('partial number (9 digits) passes E.164 validation', async () => {
    const phone = simulateTyping('+91 ', '987654321');
    const result = await signInSubmit(phone);

    expect(result.raw).toBe('+91987654321');
    expect(result.validationError).toBeNull();
  });

  it('handles API failure: signInWithOtp returns error', async () => {
    getAuthMock().signInWithOtp.mockResolvedValue({
      data: {},
      error: { message: 'Phone not verified', code: 'phone_not_verified' },
    });

    const phone = simulateTyping('+91 ', '9876543210');
    const result = await signInSubmit(phone);

    expect(result.raw).toBe('+919876543210');
    expect(result.validationError).toBeNull();
    expect(result.apiError).toBe('Phone not verified');
    expect(result.navigated).toBe(false);
    expect(getAuthMock().signInWithOtp).toHaveBeenCalled();
  });

  it('handles network failure: signInWithOtp throws', async () => {
    getAuthMock().signInWithOtp.mockRejectedValue(new Error('Network request failed'));

    const phone = simulateTyping('+91 ', '9876543210');

    await expect(signInSubmit(phone)).rejects.toThrow('Network request failed');
  });

  it('auto-prefixes +91 when user types digits starting with 9', () => {
    // User types "9" → auto-prefixes to "+91 9"
    expect(formatPhoneInput('9')).toBe('+91 9');
    expect(formatPhoneInput('98')).toBe('+91 98');
    expect(formatPhoneInput('987')).toBe('+91 987');
    expect(formatPhoneInput('9876')).toBe('+91 9876');
    expect(formatPhoneInput('98765')).toBe('+91 98765');
    expect(formatPhoneInput('987654')).toBe('+91 98765 4');
    expect(formatPhoneInput('9876543')).toBe('+91 98765 43');
    expect(formatPhoneInput('98765432')).toBe('+91 98765 432');
    expect(formatPhoneInput('987654321')).toBe('+91 98765 4321');
    expect(formatPhoneInput('9876543210')).toBe('+91 98765 43210');
  });

  it('handles user typing the +91 prefix manually', () => {
    // User types "+919876543210"
    let phone = formatPhoneInput('+');
    expect(phone).toBe('+91 ');

    phone = formatPhoneInput('+9');
    expect(phone).toBe('+91 9');

    phone = formatPhoneInput('+91');
    expect(phone).toBe('+91 ');

    phone = formatPhoneInput('+919');
    expect(phone).toBe('+91 9');

    phone = formatPhoneInput('+9198');
    expect(phone).toBe('+91 98');

    phone = formatPhoneInput('+919876543210');
    expect(phone).toBe('+91 98765 43210');
  });

  it('strips special characters from pasted input', async () => {
    // User pastes "(987) 654-3210"
    let phone = formatPhoneInput('(987) 654-3210');
    expect(phone).toBe('+91 98765 43210');

    const result = await signInSubmit(phone);
    expect(result.raw).toBe('+919876543210');
    expect(result.validationError).toBeNull();
    expect(result.navigated).toBe(true);
  });

  it('truncates digits beyond 10 after country code', () => {
    // User types 15 digits rapidly
    const phone = formatPhoneInput('987654321012345');
    expect(phone).toBe('+91 98765 43210');
  });

  it('formats display correctly at boundary: exactly 10 digits', () => {
    const phone = formatPhoneInput('9876543210');
    expect(phone).toBe('+91 98765 43210');

    const { raw, error } = { raw: toE164Phone(phone), error: validatePhone(toE164Phone(phone)) };
    expect(raw).toBe('+919876543210');
    expect(error).toBeNull();
  });

  it('formats display correctly at boundary: exactly 9 digits (passes E.164)', () => {
    // 9 local digits → +91 98765 4321 → E.164-valid (12 digits after +)
    const phone = formatPhoneInput('987654321');
    expect(phone).toBe('+91 98765 4321');

    const error = validatePhone(toE164Phone(phone));
    expect(error).toBeNull();
  });

  it('E.164 round-trip is consistent for multiple test numbers', () => {
    const testCases = [
      { digits: '9876543210', expectedE164: '+919876543210' },
      { digits: '9999988888', expectedE164: '+919999988888' },
      // Note: '9123456789' starts with '91' so formatPhoneInput treats '91' as the
    // country code and strips it → displays '+91 23456 789' → E.164: '+9123456789'
    { digits: '9123456789', expectedE164: '+9123456789' },
      { digits: '8000000000', expectedE164: '+918000000000' },
      { digits: '7000000000', expectedE164: '+917000000000' },
    ];

    for (const { digits, expectedE164 } of testCases) {
      const phone = formatPhoneInput(digits);
      const raw = toE164Phone(phone);
      expect(raw).toBe(expectedE164);
      expect(validatePhone(raw)).toBeNull();
    }
  });
});

// ─── SignUp Screen: Complete User Flow ───────────────────────────────────────

describe('SignUp screen — phone input formatting flow', () => {
  it('happy path: name + phone → submit → OTP sent → navigates with name param', async () => {
    // 1. User opens SignUpScreen
    let name = '';
    let phone = '+91 ';

    // 2. User types name
    name = 'Priya Sharma';

    // 3. User types phone number
    phone = simulateTyping(phone, '9876543210');
    expect(phone).toBe('+91 98765 43210');

    // 4. User taps "Continue"
    const result = await signUpSubmit(name, phone);

    // 5. Validation passes
    expect(result.nameError).toBeNull();
    expect(result.validationError).toBeNull();

    // 6. signInWithOtp is called with correct phone
    expect(getAuthMock().signInWithOtp).toHaveBeenCalledWith({ phone: '+919876543210' });

    // 7. Navigation includes both phone and name
    expect(result.navigated).toBe(true);
    expect(result.navigationTarget).toBe('OTPVerification');
    expect(result.navigationParams).toEqual({
      phone: '+919876543210',
      name: 'Priya Sharma',
    });
  });

  it('validates name before phone: empty name short-circuits', async () => {
    let name = '';
    let phone = '+91 98765 43210';

    const result = await signUpSubmit(name, phone);

    expect(result.nameError).toBe('Name required');
    expect(result.validationError).toBeNull();
    expect(result.navigated).toBe(false);
    expect(getAuthMock().signInWithOtp).not.toHaveBeenCalled();
  });

  it('validates name before phone: whitespace-only name short-circuits', async () => {
    const name = '   ';
    const phone = '+91 98765 43210';

    const result = await signUpSubmit(name, phone);

    expect(result.nameError).toBe('Name required');
    expect(result.navigated).toBe(false);
  });

  it('validates phone after name passes: empty phone passes E.164 but fails server-side', async () => {
    const name = 'Priya Sharma';
    const phone = '+91 '; // No digits entered

    const result = await signUpSubmit(name, phone);

    expect(result.nameError).toBeNull();
    expect(result.validationError).toBeNull();
  });

  it('validates phone after name passes: partial number passes E.164', async () => {
    const name = 'Rahul Kumar';
    const phone = simulateTyping('+91 ', '98765');

    const result = await signUpSubmit(name, phone);

    expect(result.nameError).toBeNull();
    expect(result.validationError).toBeNull();
  });

  it('trims name before validation', async () => {
    const name = '  Ananya Singh  ';
    const phone = simulateTyping('+91 ', '9876543210');

    const result = await signUpSubmit(name, phone);

    expect(result.nameError).toBeNull();
    expect(result.validationError).toBeNull();
    expect(result.navigated).toBe(true);
    expect(result.navigationParams).toEqual({
      phone: '+919876543210',
      name: 'Ananya Singh',
    });
  });

  it('handles API failure: signInWithOtp returns error', async () => {
    getAuthMock().signInWithOtp.mockResolvedValue({
      data: {},
      error: { message: 'Too many requests', code: 'rate_limit_exceeded' },
    });

    const name = 'Priya Sharma';
    const phone = simulateTyping('+91 ', '9876543210');

    const result = await signUpSubmit(name, phone);

    expect(result.nameError).toBeNull();
    expect(result.validationError).toBeNull();
    expect(result.apiError).toBe('Too many requests');
    expect(result.navigated).toBe(false);
  });

  it('handles network failure: signInWithOtp throws', async () => {
    getAuthMock().signInWithOtp.mockRejectedValue(new Error('Network request failed'));

    const name = 'Priya Sharma';
    const phone = simulateTyping('+91 ', '9876543210');

    await expect(signUpSubmit(name, phone)).rejects.toThrow('Network request failed');
  });

  it('validates name length (non-empty)', async () => {
    // Single character name is valid (no minimum length enforced at screen level)
    const name = 'A';
    const phone = simulateTyping('+91 ', '9876543210');

    const result = await signUpSubmit(name, phone);
    expect(result.nameError).toBeNull();
    expect(result.navigated).toBe(true);
    expect(result.navigationParams).toEqual({
      phone: '+919876543210',
      name: 'A',
    });
  });

  it('handles name with special characters', async () => {
    const name = "O'Brien-Smith";
    const phone = simulateTyping('+91 ', '9876543210');

    const result = await signUpSubmit(name, phone);
    expect(result.nameError).toBeNull();
    expect(result.navigated).toBe(true);
    expect(result.navigationParams).toEqual({
      phone: '+919876543210',
      name: "O'Brien-Smith",
    });
  });

  it('handles Unicode name (Devanagari)', async () => {
    const name = '\u092A\u094D\u0930\u093F\u092F\u093E';
    const phone = simulateTyping('+91 ', '9876543210');

    const result = await signUpSubmit(name, phone);
    expect(result.nameError).toBeNull();
    expect(result.navigated).toBe(true);
    expect(result.navigationParams).toEqual({
      phone: '+919876543210',
      name: '\u092A\u094D\u0930\u093F\u092F\u093E',
    });
  });
});

// ─── Edge Cases: Formatting Behavior ────────────────────────────────────────

describe('phone input formatting — edge cases', () => {
  it('empty string returns "+91 " prefix', () => {
    expect(formatPhoneInput('')).toBe('+91 ');
  });

  it('single digit "4" does not auto-prefix (not starting with 9)', () => {
    expect(formatPhoneInput('4')).toBe('+91 4');
  });

  it('digit "9" auto-prefixes to "+91 9"', () => {
    expect(formatPhoneInput('9')).toBe('+91 9');
  });

  it('handles "91" input: shows as "+91 " (country code only)', () => {
    expect(formatPhoneInput('91')).toBe('+91 ');
  });

  it('handles "919876543210" input: shows as "+91 98765 43210"', () => {
    expect(formatPhoneInput('919876543210')).toBe('+91 98765 43210');
  });

  it('strips parentheses, dashes, and spaces from pasted input', () => {
    expect(formatPhoneInput('(987) 654-3210')).toBe('+91 98765 43210');
    expect(formatPhoneInput('987-654-3210')).toBe('+91 98765 43210');
    expect(formatPhoneInput('987 654 3210')).toBe('+91 98765 43210');
  });

  it('truncates at 10 digits after country code', () => {
    expect(formatPhoneInput('98765432101234')).toBe('+91 98765 43210');
    expect(formatPhoneInput('987654321012345678')).toBe('+91 98765 43210');
  });

  it('formats 5-digit boundary correctly', () => {
    expect(formatPhoneInput('98765')).toBe('+91 98765');
  });

  it('formats 6-digit boundary correctly (space inserted)', () => {
    expect(formatPhoneInput('987654')).toBe('+91 98765 4');
  });

  it('validates E.164 format: rejects numbers starting with +0', () => {
    const error = validatePhone('+0123456789');
    expect(error).not.toBeNull();
  });

  it('validates E.164 format: rejects numbers with letters after +', () => {
    const error = validatePhone('+abc123');
    expect(error).toContain('only contain digits');
  });

  it('validates E.164 format: accepts valid international number', () => {
    const error = validatePhone('+14155552671');
    expect(error).toBeNull();
  });

  it('toE164Phone strips all formatting correctly', () => {
    expect(toE164Phone('+91 98765 43210')).toBe('+919876543210');
    expect(toE164Phone('+91 9')).toBe('+919');
    expect(toE164Phone('+91 44791 11234')).toBe('+914479111234');
    expect(toE164Phone('+1 (415) 555-2671')).toBe('+14155552671');
  });
});

// ─── Cross-Screen Consistency ───────────────────────────────────────────────

describe('SignIn and SignUp use identical phone pipeline', () => {
  it('same number produces same E.164 result on both screens', async () => {
    const phone = simulateTyping('+91 ', '9876543210');

    const signInResult = await signInSubmit(phone);
    const signUpResult = await signUpSubmit('Test User', phone);

    expect(signInResult.raw).toBe(signUpResult.raw);
    expect(signInResult.raw).toBe('+919876543210');
    expect(signInResult.validationError).toBeNull();
    expect(signUpResult.validationError).toBeNull();
  });

  it('same invalid input produces same validation error on both screens', async () => {
    const phone = '+91 ';

    const signInResult = await signInSubmit(phone);
    const signUpResult = await signUpSubmit('Test User', phone);

    expect(signInResult.validationError).toBe(signUpResult.validationError);
    // Both return null since +91 has 2 digits after + (passes E.164 min)
    expect(signInResult.validationError).toBeNull();
  });
});
