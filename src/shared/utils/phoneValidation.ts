// E.164 Phone Number Validation Utility

/**
 * Validates a phone number in E.164 format.
 *
 * E.164 format: +[country code][subscriber number]
 * - Must start with '+'
 * - Country code: 1-3 digits (1-999)
 * - Subscriber number: 1-14 digits
 * - Total digits after '+': 2-15
 *
 * Examples: +14155552671, +919876543210, +447911123456
 */
export function isValidE164Phone(phone: string): boolean {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone.trim());
}

/**
 * Validates a phone number and returns a user-friendly error message if invalid.
 * Returns null if the number is valid.
 */
export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();

  if (!trimmed) {
    return 'Phone number is required.';
  }

  if (!trimmed.startsWith('+')) {
    return 'Phone number must start with + and country code (e.g. +919876543210).';
  }

  const digitsAfterPlus = trimmed.slice(1);

  if (!/^\d+$/.test(digitsAfterPlus)) {
    return 'Phone number can only contain digits after the + sign.';
  }

  if (digitsAfterPlus.length < 2) {
    return 'Phone number is too short. Include country code (e.g. +919876543210).';
  }

  if (digitsAfterPlus.length > 15) {
    return 'Phone number is too long. Maximum 15 digits allowed.';
  }

  if (!isValidE164Phone(trimmed)) {
    return 'Invalid phone number format. Use E.164 format (e.g. +919876543210).';
  }

  return null;
}

/**
 * Formats a phone number for display, masking the middle digits.
 * Example: +919876543210 → +91****43210
 */
export function formatPhoneForDisplay(phone: string): string {
  if (phone.length <= 11) return phone;
  const start = phone.slice(0, 4);
  const end = phone.slice(-5);
  const maskLength = Math.min(phone.length - 9, 6);
  if (maskLength <= 2) return phone;
  const masked = '*'.repeat(maskLength);
  return `${start}${masked}${end}`;
}
