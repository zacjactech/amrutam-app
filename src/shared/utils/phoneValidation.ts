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
 * Formats phone input as the user types.
 * Auto-prefixes +91 (India) and formats as +91 XXXXX XXXXX.
 * Returns the formatted string for display.
 *
 * Examples:
 *   "9" → "+91 9"
 *   "9876543210" → "+91 98765 43210"
 *   "+919876543210" → "+91 98765 43210"
 *   "44" → "+91 44"
 */
export function formatPhoneInput(raw: string): string {
  // Strip everything except digits
  const digits = raw.replace(/\D/g, '');

  // If empty, show just the prefix
  if (digits.length === 0) {
    return '+91 ';
  }

  // Auto-prefix: if first digit is 9, assume Indian mobile and prepend country code
  let digitsToFormat = digits;
  if (digits[0] === '9' && !digits.startsWith('91')) {
    digitsToFormat = '91' + digits;
  } else if (digits.startsWith('91') && digits.length > 2) {
    // Already has country code
    digitsToFormat = digits;
  }

  const withoutCode = digitsToFormat.replace(/^91/, '');

  if (withoutCode.length <= 5) {
    return `+91 ${withoutCode}`;
  }
  return `+91 ${withoutCode.slice(0, 5)} ${withoutCode.slice(5, 10)}`;
}

/**
 * Extracts the raw E.164 phone number from a formatted display string.
 * Strips all non-digit characters and prepends +.
 */
export function toE164Phone(formatted: string): string {
  const digits = formatted.replace(/\D/g, '');
  return `+${digits}`;
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
