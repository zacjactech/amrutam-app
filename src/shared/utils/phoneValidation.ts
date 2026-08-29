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
 * Auto-prefixes +91 (India) for 10-digit numbers starting with 6-9.
 * Returns the formatted string for display.
 *
 * Examples:
 *   "9" → "+91 9"
 *   "9876543210" → "+91 98765 43210"
 *   "+919876543210" → "+91 98765 43210"
 *   "44791112345" → "+44 79111 23455"
 */
export function formatPhoneInput(raw: string): string {
  // Strip everything except digits and leading +
  const hasPlus = raw.startsWith('+');
  const digits = raw.replace(/\D/g, '');

  // If empty, show just the prefix
  if (digits.length === 0) {
    return '+91 ';
  }

  // If user is typing a non-Indian number (has + and doesn't start with 91)
  // Just format with spaces, don't force +91
  if (hasPlus && !digits.startsWith('91')) {
    // International number - format with spaces every 5 digits
    if (digits.length <= 5) {
      return `+${digits}`;
    }
    return `+${digits.slice(0, 5)} ${digits.slice(5, 15)}`;
  }

  // Indian number handling
  let digitsToFormat = digits;

  // If starts with 91 already, use as-is
  if (digits.startsWith('91')) {
    digitsToFormat = digits;
  }
  // If 10-digit Indian mobile (starts with 6-9), prepend country code
  else if (digits.length === 10 && /^[6-9]/.test(digits)) {
    digitsToFormat = '91' + digits;
  }
  // If user typed without country code but with +91 prefix visible
  else if (hasPlus && digits.length > 0 && digits.length <= 10 && /^[6-9]/.test(digits[0]!)) {
    digitsToFormat = '91' + digits;
  }

  const withoutCode = digitsToFormat.replace(/^91/, '');

  if (withoutCode.length <= 5) {
    return `+91 ${withoutCode}`;
  }
  return `+91 ${withoutCode.slice(0, 5)} ${withoutCode.slice(5, 10)}`;
}

/**
 * Extracts the raw E.164 phone number from a formatted display string.
 * Handles both Indian (+91) and international numbers.
 */
export function toE164Phone(formatted: string): string {
  const digits = formatted.replace(/\D/g, '');

  // If starts with 91 (Indian country code), use as-is
  if (digits.startsWith('91')) {
    return `+${digits}`;
  }

  // Otherwise assume the digits include country code
  return `+${digits}`;
}

/**
 * Formats local phone input as the user types (without country code prefix).
 * Used with CountryCodePicker where the country code is selected separately.
 *
 * Examples:
 *   "9876543210" → "98765 43210"
 *   "98765" → "98765"
 *   "" → ""
 */
export function formatLocalPhoneInput(raw: string): string {
  // Strip everything except digits
  const digits = raw.replace(/\D/g, '');

  // Format with space after 5 digits
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)} ${digits.slice(5, 15)}`;
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
