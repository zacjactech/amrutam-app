// Hook to persist selected country code across app sessions
// Uses SecureStore to remember the user's last selected country and recently used countries

import { useState, useEffect, useCallback } from 'react';
import { secureStorage } from '../../infrastructure/storage/secureStorage';
import { CountryCode, countryCodes, defaultCountry } from '../data/countryCodes';
import { logger } from '../../infrastructure/logging/logger';

const STORAGE_KEY = 'selected_country_code';
const RECENT_COUNTRIES_KEY = 'recent_country_codes';
const MAX_RECENT_COUNTRIES = 3;

/**
 * Hook that manages the selected country code with persistence.
 * Also tracks recently used countries for quick access in the picker.
 */
export function usePersistedCountryCode(): {
  selectedCountry: CountryCode;
  setSelectedCountry: (country: CountryCode) => void;
  recentCountries: CountryCode[];
  isLoaded: boolean;
} {
  const [selectedCountry, setSelectedCountryState] = useState<CountryCode>(defaultCountry);
  const [recentCountries, setRecentCountries] = useState<CountryCode[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved country and recent countries on mount
  useEffect(() => {
    let mounted = true;

    async function loadSavedData() {
      try {
        // Load selected country
        const savedCode = await secureStorage.get(STORAGE_KEY);
        if (savedCode && mounted) {
          const found = countryCodes.find((c) => c.dialCode === savedCode);
          if (found) {
            setSelectedCountryState(found);
          }
        }

        // Load recent countries
        const savedRecent = await secureStorage.get(RECENT_COUNTRIES_KEY);
        if (savedRecent && mounted) {
          const recentDialCodes: string[] = JSON.parse(savedRecent);
          const recent = recentDialCodes
            .map((code) => countryCodes.find((c) => c.dialCode === code))
            .filter((c): c is CountryCode => c !== undefined);
          setRecentCountries(recent);
        }
      } catch (error) {
        // Silently fail - use defaults
        logger.warn('Failed to load saved country data', {
          feature: 'settings',
          action: 'load_country_data',
          error: error instanceof Error ? error.message : String(error),
        });
      } finally {
        if (mounted) {
          setIsLoaded(true);
        }
      }
    }

    loadSavedData();

    return () => {
      mounted = false;
    };
  }, []);

  // Update recently used countries list
  const updateRecentCountries = useCallback(async (country: CountryCode) => {
    setRecentCountries((prev) => {
      // Remove if already exists, then add to front
      const filtered = prev.filter((c) => c.dialCode !== country.dialCode);
      const updated = [country, ...filtered].slice(0, MAX_RECENT_COUNTRIES);
      
      // Save to storage
      secureStorage.set(RECENT_COUNTRIES_KEY, JSON.stringify(updated.map((c) => c.dialCode)))
        .catch((error) => {
          logger.warn('Failed to save recent countries', {
            feature: 'settings',
            action: 'save_recent_countries',
            error: error instanceof Error ? error.message : String(error),
          });
        });
      
      return updated;
    });
  }, []);

  // Save country when it changes
  const setSelectedCountry = useCallback(async (country: CountryCode) => {
    setSelectedCountryState(country);
    
    // Update both selected and recent countries
    try {
      await secureStorage.set(STORAGE_KEY, country.dialCode);
      await updateRecentCountries(country);
    } catch (error) {
      // Silently fail - the in-memory state is still updated
      logger.warn('Failed to save country code', {
        feature: 'settings',
        action: 'save_country_code',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, [updateRecentCountries]);

  return {
    selectedCountry,
    setSelectedCountry,
    recentCountries,
    isLoaded,
  };
}
