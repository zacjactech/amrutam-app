// SearchBar - Search input component

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';
import { Search, Close } from '../assets/icons';

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
          borderRadius: 999,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        },
        isFocused && { backgroundColor: colors.surface.default, borderWidth: 1.5, borderColor: colors.action.primary },
        style,
      ]}
    >
      <Search width={18} height={18} color={colors.text.tertiary} style={{ marginRight: spacing.sm }} />
      <TextInput
        style={[styles.input, { color: colors.text.primary, fontSize: 16 }]}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        value={displayValue}
        onChangeText={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {displayValue.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={[styles.clearBtn, { backgroundColor: colors.border.default }]}
          accessibilityLabel="Clear search"
        >
          <Close width={12} height={12} color={colors.text.secondary} />
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
  input: {
    flex: 1,
    paddingVertical: 2,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
