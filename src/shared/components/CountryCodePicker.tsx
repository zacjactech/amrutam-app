// Country Code Picker Component
// Bottom sheet selector for choosing country dial code with recently used section

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { SearchBar } from './SearchBar';
import { useThemeColors } from './ThemeProvider';
import { countryCodes, CountryCode, defaultCountry } from '../data/countryCodes';

interface CountryCodePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: CountryCode) => void;
  selectedCountry?: CountryCode;
  recentCountries?: CountryCode[];
}

export function CountryCodePicker({
  visible,
  onClose,
  onSelect,
  selectedCountry = defaultCountry,
  recentCountries = [],
}: CountryCodePickerProps): React.JSX.Element {
  const colors = useThemeColors();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countryCodes;
    }
    const query = searchQuery.toLowerCase();
    return countryCodes.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.dialCode.includes(query) ||
        c.isoCode.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  // Filter recent countries based on search query
  const filteredRecentCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return recentCountries;
    }
    const query = searchQuery.toLowerCase();
    return recentCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.dialCode.includes(query) ||
        c.isoCode.toLowerCase().includes(query),
    );
  }, [recentCountries, searchQuery]);

  const handleSelect = (country: CountryCode): void => {
    onSelect(country);
    onClose();
  };

  const renderCountryItem = (country: CountryCode): React.JSX.Element => {
    const isSelected = country.isoCode === selectedCountry.isoCode;
    return (
      <TouchableOpacity
        key={country.isoCode}
        style={[
          styles.countryItem,
          {
            backgroundColor: isSelected
              ? colors.action.primarySoft
              : 'transparent',
            borderBottomColor: colors.border.light,
          },
        ]}
        onPress={() => handleSelect(country)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{country.flag}</Text>
        <View style={styles.countryInfo}>
          <Text
            style={[
              styles.countryName,
              { color: colors.text.primary },
            ]}
          >
            {country.name}
          </Text>
          <Text
            style={[
              styles.dialCode,
              { color: colors.text.secondary },
            ]}
          >
            {country.dialCode}
          </Text>
        </View>
        {isSelected && (
          <Text style={[styles.checkmark, { color: colors.action.primary }]}>✓</Text>
        )}
      </TouchableOpacity>
    );
  };

  const showRecentSection = filteredRecentCountries.length > 0 && !searchQuery.trim();
  const showAllCountriesSection = filteredCountries.length > 0;
  const showEmptyState = filteredCountries.length === 0 && filteredRecentCountries.length === 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Select Country"
    >
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search country..."
        />
      </View>

      <View style={styles.list}>
        {/* Recently Used Section */}
        {showRecentSection && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
              RECENTLY USED
            </Text>
            {filteredRecentCountries.map(renderCountryItem)}
            <View style={[styles.separator, { backgroundColor: colors.border.default }]} />
          </>
        )}

        {/* All Countries Section */}
        {showAllCountriesSection && (
          <>
            {showRecentSection && (
              <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
                ALL COUNTRIES
              </Text>
            )}
            {filteredCountries.map(renderCountryItem)}
          </>
        )}

        {/* Empty State */}
        {showEmptyState && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
              No countries found
            </Text>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 8,
  },
  list: {
    gap: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  dialCode: {
    fontSize: 14,
    fontWeight: '400',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
