// Country Codes Data Tests

import { countryCodes, defaultCountry, CountryCode } from '../countryCodes';

describe('countryCodes', () => {
  it('exports an array of country codes', () => {
    expect(Array.isArray(countryCodes)).toBe(true);
    expect(countryCodes.length).toBeGreaterThan(0);
  });

  it('each country has required fields', () => {
    countryCodes.forEach((country) => {
      expect(country).toHaveProperty('name');
      expect(country).toHaveProperty('flag');
      expect(country).toHaveProperty('dialCode');
      expect(country).toHaveProperty('isoCode');
      expect(country).toHaveProperty('minLength');
      expect(country).toHaveProperty('maxLength');
    });
  });

  it('each country has a valid dial code format', () => {
    countryCodes.forEach((country) => {
      // Dial code must start with + and be 1-4 digits
      expect(country.dialCode).toMatch(/^\+\d{1,4}$/);
    });
  });

  it('each country has a 2-letter ISO code', () => {
    countryCodes.forEach((country) => {
      expect(country.isoCode).toMatch(/^[A-Z]{2}$/);
    });
  });

  it('each country has a flag emoji', () => {
    countryCodes.forEach((country) => {
      // Flag emojis are typically 2 regional indicator symbols (4 bytes each)
      expect(country.flag.length).toBeGreaterThan(0);
    });
  });

  it('each country has valid min/max length', () => {
    countryCodes.forEach((country) => {
      expect(country.minLength).toBeGreaterThan(0);
      expect(country.maxLength).toBeGreaterThanOrEqual(country.minLength);
    });
  });

  it('has India as the first country', () => {
    const first = countryCodes[0]!;
    expect(first.name).toBe('India');
    expect(first.dialCode).toBe('+91');
    expect(first.isoCode).toBe('IN');
  });

  it('has United States in the list', () => {
    const us = countryCodes.find((c) => c.isoCode === 'US');
    expect(us).toBeDefined();
    expect(us?.name).toBe('United States');
    expect(us?.dialCode).toBe('+1');
  });

  it('has United Kingdom in the list', () => {
    const uk = countryCodes.find((c) => c.isoCode === 'GB');
    expect(uk).toBeDefined();
    expect(uk?.name).toBe('United Kingdom');
    expect(uk?.dialCode).toBe('+44');
  });

  it('has unique ISO codes', () => {
    const isoCodes = countryCodes.map((c) => c.isoCode);
    const uniqueCodes = new Set(isoCodes);
    expect(uniqueCodes.size).toBe(isoCodes.length);
  });

  it('can find country by dial code', () => {
    const found = countryCodes.find((c) => c.dialCode === '+91');
    expect(found).toBeDefined();
    expect(found?.name).toBe('India');
  });

  it('can find country by ISO code', () => {
    const found = countryCodes.find((c) => c.isoCode === 'JP');
    expect(found).toBeDefined();
    expect(found?.name).toBe('Japan');
  });
});

describe('defaultCountry', () => {
  it('is defined and is a valid country', () => {
    expect(defaultCountry).toBeDefined();
    expect(defaultCountry.name).toBe('India');
    expect(defaultCountry.dialCode).toBe('+91');
  });

  it('is the same object reference as the first country in the array', () => {
    expect(defaultCountry).toBe(countryCodes[0]);
  });
});

describe('CountryCode type compatibility', () => {
  it('all countries conform to the CountryCode interface', () => {
    countryCodes.forEach((country) => {
      const typed: CountryCode = country;
      expect(typed.name).toBeDefined();
      expect(typed.flag).toBeDefined();
      expect(typed.dialCode).toBeDefined();
      expect(typed.isoCode).toBeDefined();
    });
  });
});
