// Phone Validation Tests

import { isValidE164Phone, validatePhone, formatPhoneForDisplay, formatPhoneInput, toE164Phone } from '../phoneValidation';

describe('isValidE164Phone', () => {
  it('accepts valid E.164 numbers', () => {
    expect(isValidE164Phone('+14155552671')).toBe(true);  // US
    expect(isValidE164Phone('+919876543210')).toBe(true);  // India
    expect(isValidE164Phone('+447911123456')).toBe(true);  // UK
    expect(isValidE164Phone('+8613800138000')).toBe(true); // China
    expect(isValidE164Phone('+5511999998888')).toBe(true); // Brazil
  });

  it('accepts minimum length numbers', () => {
    expect(isValidE164Phone('+12')).toBe(true);   // 2 digits total
    expect(isValidE164Phone('+123')).toBe(true);  // 3 digits total
  });

  it('accepts maximum length numbers (15 digits)', () => {
    expect(isValidE164Phone('+123456789012345')).toBe(true); // 15 digits
  });

  it('rejects numbers without + prefix', () => {
    expect(isValidE164Phone('14155552671')).toBe(false);
    expect(isValidE164Phone('919876543210')).toBe(false);
  });

  it('rejects numbers starting with +0', () => {
    expect(isValidE164Phone('+0123')).toBe(false);
  });

  it('rejects numbers that are too short', () => {
    expect(isValidE164Phone('+1')).toBe(false);  // only 1 digit
  });

  it('rejects numbers that are too long (over 15 digits)', () => {
    expect(isValidE164Phone('+1234567890123456')).toBe(false); // 16 digits
  });

  it('rejects numbers with non-digit characters', () => {
    expect(isValidE164Phone('+1415555abcde')).toBe(false);
    expect(isValidE164Phone('+1415-555-2671')).toBe(false);
    expect(isValidE164Phone('+1 (415) 555-2671')).toBe(false);
  });

  it('rejects empty strings', () => {
    expect(isValidE164Phone('')).toBe(false);
  });

  it('handles whitespace trimming', () => {
    expect(isValidE164Phone('  +919876543210  ')).toBe(true);
  });
});

describe('validatePhone', () => {
  it('returns null for valid E.164 numbers', () => {
    expect(validatePhone('+919876543210')).toBeNull();
    expect(validatePhone('+14155552671')).toBeNull();
    expect(validatePhone('+447911123456')).toBeNull();
  });

  it('returns error for empty input', () => {
    const error = validatePhone('');
    expect(error).toBe('Phone number is required.');
  });

  it('returns error for missing + prefix', () => {
    const error = validatePhone('919876543210');
    expect(error).toContain('must start with +');
  });

  it('returns error for non-digit characters after +', () => {
    const error = validatePhone('+1abc');
    expect(error).toContain('only contain digits');
  });

  it('returns error for too-short numbers', () => {
    const error = validatePhone('+1');
    expect(error).toContain('too short');
  });

  it('returns error for too-long numbers', () => {
    const error = validatePhone('+1234567890123456');
    expect(error).toContain('too long');
  });
});

describe('formatPhoneInput', () => {
  it('returns prefix when empty', () => {
    expect(formatPhoneInput('')).toBe('+91 ');
  });

  it('auto-prefixes +91 when user types digits starting with 9', () => {
    expect(formatPhoneInput('9')).toBe('+91 9');
    expect(formatPhoneInput('98')).toBe('+91 98');
    expect(formatPhoneInput('98765')).toBe('+91 98765');
  });

  it('formats full 10-digit Indian number', () => {
    expect(formatPhoneInput('9876543210')).toBe('+91 98765 43210');
  });

  it('handles user typing +91 prefix manually', () => {
    // +91 → digits = "91" → starts with 91 → withoutCode = ""
    expect(formatPhoneInput('+91')).toBe('+91 ');
    // +9198 → digits = "9198" → starts with 91 → withoutCode = "98"
    expect(formatPhoneInput('+9198')).toBe('+91 98');
    // +919876543210 → digits = "919876543210" → starts with 91 → withoutCode = "9876543210"
    expect(formatPhoneInput('+919876543210')).toBe('+91 98765 43210');
  });

  it('formats non-Indian numbers after +91 prefix', () => {
    // User types "44" → not starting with 9 → no auto-prefix
    expect(formatPhoneInput('44')).toBe('+91 44');
    expect(formatPhoneInput('44791112345')).toBe('+91 44791 11234');
  });

  it('strips non-digit characters', () => {
    expect(formatPhoneInput('987-654-3210')).toBe('+91 98765 43210');
    expect(formatPhoneInput('(987) 654-3210')).toBe('+91 98765 43210');
  });

  it('truncates at 10 digits after country code', () => {
    expect(formatPhoneInput('98765432101234')).toBe('+91 98765 43210');
  });
});

describe('toE164Phone', () => {
  it('converts formatted phone to E.164', () => {
    expect(toE164Phone('+91 98765 43210')).toBe('+919876543210');
    expect(toE164Phone('+91 9')).toBe('+919');
    expect(toE164Phone('+91 44791 11234')).toBe('+914479111234');
  });

  it('strips all non-digit characters', () => {
    expect(toE164Phone('+91 (987) 654-3210')).toBe('+919876543210');
  });
});

describe('formatPhoneForDisplay', () => {
  it('masks middle digits of phone number', () => {
    expect(formatPhoneForDisplay('+919876543210')).toBe('+919****43210');
    expect(formatPhoneForDisplay('+14155552671')).toBe('+141***52671');
  });

  it('returns short numbers unchanged (11 chars or fewer)', () => {
    expect(formatPhoneForDisplay('+1')).toBe('+1');
    expect(formatPhoneForDisplay('+12')).toBe('+12');
    expect(formatPhoneForDisplay('+1234')).toBe('+1234');
    expect(formatPhoneForDisplay('+12345')).toBe('+12345');
    expect(formatPhoneForDisplay('+123456')).toBe('+123456');
    expect(formatPhoneForDisplay('+123456789')).toBe('+123456789');
    expect(formatPhoneForDisplay('+1234567890')).toBe('+1234567890');
  });

  it('masks 12+ char numbers', () => {
    // +123456789012 is 13 chars → start='+123', end='89012', mask=4
    expect(formatPhoneForDisplay('+123456789012')).toBe('+123****89012');
    // +12345678901 is 12 chars → start='+123', end='78901', mask=3
    expect(formatPhoneForDisplay('+12345678901')).toBe('+123***78901');
  });
});
