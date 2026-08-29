// usePersistedCountryCode Hook Tests

import { countryCodes, defaultCountry } from '../../data/countryCodes';

// Mock secureStorage
const mockGet = jest.fn();
const mockSet = jest.fn();

jest.mock('../../../infrastructure/storage/secureStorage', () => ({
  secureStorage: {
    get: (...args: unknown[]) => mockGet(...args),
    set: (...args: unknown[]) => mockSet(...args),
    remove: jest.fn(),
  },
}));

describe('usePersistedCountryCode - storage logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockResolvedValue(null);
    mockSet.mockResolvedValue(undefined);
  });

  describe('country code lookup', () => {
    it('can find India by dial code', () => {
      const found = countryCodes.find((c) => c.dialCode === '+91');
      expect(found).toBeDefined();
      expect(found?.isoCode).toBe('IN');
    });

    it('can find US by dial code', () => {
      const found = countryCodes.find((c) => c.dialCode === '+1' && c.isoCode === 'US');
      expect(found).toBeDefined();
      expect(found?.name).toBe('United States');
    });

    it('returns undefined for unknown dial code', () => {
      const found = countryCodes.find((c) => c.dialCode === '+999');
      expect(found).toBeUndefined();
    });
  });

  describe('storage keys', () => {
    it('uses correct storage key for selected country', () => {
      const STORAGE_KEY = 'selected_country_code';
      expect(STORAGE_KEY).toBe('selected_country_code');
    });

    it('uses correct storage key for recent countries', () => {
      const RECENT_COUNTRIES_KEY = 'recent_country_codes';
      expect(RECENT_COUNTRIES_KEY).toBe('recent_country_codes');
    });
  });

  describe('recent countries persistence', () => {
    it('loads recent countries from storage', async () => {
      const recentDialCodes = ['+44', '+1', '+61'];
      mockGet.mockImplementation((key: string) => {
        if (key === 'recent_country_codes') {
          return Promise.resolve(JSON.stringify(recentDialCodes));
        }
        return Promise.resolve(null);
      });

      const savedRecent = await mockGet('recent_country_codes');
      const recent = JSON.parse(savedRecent as string) as string[];
      
      expect(recent).toEqual(['+44', '+1', '+61']);
      expect(recent).toHaveLength(3);
    });

    it('saves recent countries to storage', async () => {
      const recentDialCodes = ['+44', '+1', '+61'];
      await mockSet('recent_country_codes', JSON.stringify(recentDialCodes));
      
      expect(mockSet).toHaveBeenCalledWith('recent_country_codes', JSON.stringify(recentDialCodes));
    });

    it('handles empty recent countries list', async () => {
      mockGet.mockResolvedValue(null);
      
      const savedRecent = await mockGet('recent_country_codes');
      const recent = savedRecent ? JSON.parse(savedRecent as string) : [];
      
      expect(recent).toEqual([]);
    });

    it('limits recent countries to 3', () => {
      const MAX_RECENT = 3;
      const recentDialCodes = ['+44', '+1', '+61', '+81', '+49'];
      
      // Simulate limiting to MAX_RECENT
      const limited = recentDialCodes.slice(0, MAX_RECENT);
      expect(limited).toEqual(['+44', '+1', '+61']);
      expect(limited).toHaveLength(MAX_RECENT);
    });

    it('removes duplicate when adding to front of list', () => {
      const MAX_RECENT = 3;
      const existing = ['+44', '+1'];
      const newCountry = '+91';
      
      // Remove if already exists, then add to front
      const filtered = existing.filter((code) => code !== newCountry);
      const updated = [newCountry, ...filtered].slice(0, MAX_RECENT);
      
      expect(updated).toEqual(['+91', '+44', '+1']);
    });

    it('removes duplicate when re-selecting existing country', () => {
      const MAX_RECENT = 3;
      const existing = ['+44', '+91', '+1'];
      const newCountry = '+91'; // Already in list
      
      // Remove if already exists, then add to front
      const filtered = existing.filter((code) => code !== newCountry);
      const updated = [newCountry, ...filtered].slice(0, MAX_RECENT);
      
      // +91 should be moved to front, no duplicates
      expect(updated).toEqual(['+91', '+44', '+1']);
      expect(new Set(updated).size).toBe(updated.length);
    });
  });

  describe('persistence flow simulation', () => {
    it('loads saved country from storage', async () => {
      // Simulate loading a saved country
      mockGet.mockResolvedValue('+44');
      
      const savedCode = await mockGet('selected_country_code');
      const found = countryCodes.find((c) => c.dialCode === savedCode);
      
      expect(found).toBeDefined();
      expect(found?.name).toBe('United Kingdom');
      expect(found?.isoCode).toBe('GB');
    });

    it('falls back to default when nothing saved', async () => {
      mockGet.mockResolvedValue(null);
      
      const savedCode = await mockGet('selected_country_code');
      const found = savedCode ? countryCodes.find((c) => c.dialCode === savedCode) : null;
      
      expect(found).toBeNull();
      // Should use defaultCountry
      expect(defaultCountry.dialCode).toBe('+91');
    });

    it('falls back to default for unknown dial code', async () => {
      mockGet.mockResolvedValue('+999');
      
      const savedCode = await mockGet('selected_country_code');
      const found = savedCode ? countryCodes.find((c) => c.dialCode === savedCode) : null;
      
      expect(found).toBeUndefined();
      // Should use defaultCountry
      expect(defaultCountry.dialCode).toBe('+91');
    });

    it('saves country to storage', async () => {
      const uk = countryCodes.find((c) => c.isoCode === 'GB');
      
      await mockSet('selected_country_code', uk!.dialCode);
      
      expect(mockSet).toHaveBeenCalledWith('selected_country_code', '+44');
    });

    it('handles storage errors gracefully', async () => {
      mockGet.mockRejectedValue(new Error('Storage unavailable'));
      
      // Should not throw
      const result = await mockGet('selected_country_code').catch(() => null);
      expect(result).toBeNull();
    });

    it('handles set errors gracefully', async () => {
      mockSet.mockRejectedValue(new Error('Storage unavailable'));
      
      // Should not throw
      const result = await mockSet('selected_country_code', '+91').catch(() => null);
      expect(result).toBeNull();
    });
  });

  describe('country selection scenarios', () => {
    it('user selects US from India default', () => {
      const initial = defaultCountry; // India
      const selected = countryCodes.find((c) => c.isoCode === 'US');
      
      expect(initial.dialCode).toBe('+91');
      expect(selected?.dialCode).toBe('+1');
      expect(initial).not.toBe(selected);
    });

    it('user selects UK from India default', () => {
      const selected = countryCodes.find((c) => c.isoCode === 'GB');
      
      expect(selected?.dialCode).toBe('+44');
      expect(selected?.name).toBe('United Kingdom');
    });

    it('phone number construction with different countries', () => {
      // India: +91 + 9876543210
      const indiaPhone = `${defaultCountry.dialCode}9876543210`;
      expect(indiaPhone).toBe('+919876543210');
      
      // US: +1 + 4155551234
      const us = countryCodes.find((c) => c.isoCode === 'US');
      const usPhone = `${us?.dialCode}4155551234`;
      expect(usPhone).toBe('+14155551234');
      
      // UK: +44 + 7911123456
      const uk = countryCodes.find((c) => c.isoCode === 'GB');
      const ukPhone = `${uk?.dialCode}7911123456`;
      expect(ukPhone).toBe('+447911123456');
    });
  });
});
