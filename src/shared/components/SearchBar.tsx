// SearchBar - Search input component

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  style?: ViewStyle;
}

export function SearchBar({
  placeholder = 'Search...',
  value,
  onChangeText,
  onFocus,
  onBlur,
  autoFocus = false,
  style,
}: SearchBarProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (text: string): void => {
    if (onChangeText !== undefined) {
      onChangeText(text);
    } else {
      setInternalValue(text);
    }
  };

  const handleClear = (): void => {
    handleChange('');
  };

  const handleFocus = (): void => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.secondary,
          borderRadius: 24,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
        },
        isFocused && { backgroundColor: colors.surface.default, borderWidth: 1.5, borderColor: colors.action.primary },
        style,
      ]}
    >
      <View style={styles.searchIcon}>
        <Text style={[styles.magnifier, { color: colors.text.tertiary }]}>🔍</Text>
      </View>
      <TextInput
        style={[styles.input, { color: colors.text.primary }]}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        value={displayValue}
        onChangeText={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      {displayValue.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.clearBtn, { backgroundColor: colors.border.default }]}
        >
          <Text style={[styles.clearIcon, { color: colors.text.secondary }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8,
  },
  magnifier: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 12,
    fontWeight: '600',
  },
});
