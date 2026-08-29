// Country Codes Data for Phone Input
// Contains country name, flag emoji, dial code, and ISO code

export interface CountryCode {
  name: string;
  flag: string;
  dialCode: string;
  isoCode: string;
  // Length of subscriber number (excluding country code)
  minLength: number;
  maxLength: number;
}

export const countryCodes: CountryCode[] = [
  // Popular countries
  { name: 'India', flag: '🇮🇳', dialCode: '+91', isoCode: 'IN', minLength: 10, maxLength: 10 },
  { name: 'United States', flag: '🇺🇸', dialCode: '+1', isoCode: 'US', minLength: 10, maxLength: 10 },
  { name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', isoCode: 'GB', minLength: 10, maxLength: 10 },
  { name: 'Canada', flag: '🇨🇦', dialCode: '+1', isoCode: 'CA', minLength: 10, maxLength: 10 },
  { name: 'Australia', flag: '🇦🇺', dialCode: '+61', isoCode: 'AU', minLength: 9, maxLength: 9 },
  { name: 'Germany', flag: '🇩🇪', dialCode: '+49', isoCode: 'DE', minLength: 10, maxLength: 11 },
  { name: 'France', flag: '🇫🇷', dialCode: '+33', isoCode: 'FR', minLength: 9, maxLength: 9 },
  { name: 'Japan', flag: '🇯🇵', dialCode: '+81', isoCode: 'JP', minLength: 10, maxLength: 10 },
  { name: 'Brazil', flag: '🇧🇷', dialCode: '+55', isoCode: 'BR', minLength: 10, maxLength: 11 },
  { name: 'China', flag: '🇨🇳', dialCode: '+86', isoCode: 'CN', minLength: 11, maxLength: 11 },
  { name: 'Singapore', flag: '🇸🇬', dialCode: '+65', isoCode: 'SG', minLength: 8, maxLength: 8 },
  { name: 'UAE', flag: '🇦🇪', dialCode: '+971', isoCode: 'AE', minLength: 7, maxLength: 9 },
  { name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', isoCode: 'SA', minLength: 8, maxLength: 9 },
  { name: 'South Africa', flag: '🇿🇦', dialCode: '+27', isoCode: 'ZA', minLength: 9, maxLength: 9 },
  { name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', isoCode: 'NG', minLength: 10, maxLength: 11 },
  { name: 'Kenya', flag: '🇰🇪', dialCode: '+254', isoCode: 'KE', minLength: 9, maxLength: 10 },
  { name: 'Egypt', flag: '🇪🇬', dialCode: '+20', isoCode: 'EG', minLength: 10, maxLength: 10 },
  { name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', isoCode: 'PK', minLength: 10, maxLength: 10 },
  { name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', isoCode: 'BD', minLength: 10, maxLength: 10 },
  { name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94', isoCode: 'LK', minLength: 9, maxLength: 9 },
  { name: 'Nepal', flag: '🇳🇵', dialCode: '+977', isoCode: 'NP', minLength: 10, maxLength: 10 },
  { name: 'Thailand', flag: '🇹🇭', dialCode: '+66', isoCode: 'TH', minLength: 9, maxLength: 9 },
  { name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', isoCode: 'ID', minLength: 10, maxLength: 12 },
  { name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', isoCode: 'MY', minLength: 9, maxLength: 10 },
  { name: 'Philippines', flag: '🇵🇭', dialCode: '+63', isoCode: 'PH', minLength: 10, maxLength: 10 },
  { name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', isoCode: 'NZ', minLength: 8, maxLength: 9 },
  { name: 'Ireland', flag: '🇮🇪', dialCode: '+353', isoCode: 'IE', minLength: 7, maxLength: 9 },
  { name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', isoCode: 'NL', minLength: 9, maxLength: 9 },
  { name: 'Italy', flag: '🇮🇹', dialCode: '+39', isoCode: 'IT', minLength: 9, maxLength: 11 },
  { name: 'Spain', flag: '🇪🇸', dialCode: '+34', isoCode: 'ES', minLength: 9, maxLength: 9 },
  { name: 'Mexico', flag: '🇲🇽', dialCode: '+52', isoCode: 'MX', minLength: 10, maxLength: 10 },
  { name: 'Argentina', flag: '🇦🇷', dialCode: '+54', isoCode: 'AR', minLength: 10, maxLength: 10 },
  { name: 'Turkey', flag: '🇹🇷', dialCode: '+90', isoCode: 'TR', minLength: 10, maxLength: 10 },
  { name: 'Israel', flag: '🇮🇱', dialCode: '+972', isoCode: 'IL', minLength: 9, maxLength: 9 },
  { name: 'South Korea', flag: '🇰🇷', dialCode: '+82', isoCode: 'KR', minLength: 10, maxLength: 11 },
];

export const defaultCountry: CountryCode = countryCodes[0]!; // India
