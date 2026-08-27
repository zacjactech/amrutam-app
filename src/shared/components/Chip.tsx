// Chip - Filter/selection chip

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

type ChipVariant = 'outlined' | 'filled';

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  count?: number;
  showRemove?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  selected?: boolean;
  style?: ViewStyle;
}

export function Chip({
  label,
  variant = 'outlined',
  count,
  showRemove = false,
  onPress,
  onRemove,
  selected = false,
  style,
}: ChipProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  const isFilled = variant === 'filled' || selected;

  const containerStyle: ViewStyle[] = [
    styles.container,
    {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 999,
      borderColor: isFilled ? colors.action.primary : colors.border.default,
      backgroundColor: isFilled ? colors.action.primary : 'transparent',
    },
    ...(style ? [style] : []),
  ];

  const textStyle = {
    color: isFilled ? colors.text.inverse : colors.text.primary,
    fontSize: 14,
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={onPress === undefined}
    >
      <Text style={[styles.label, textStyle]} numberOfLines={1}>
        {label}
      </Text>

      {count !== undefined && (
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: isFilled ? 'rgba(255,255,255,0.3)' : colors.border.light,
              marginLeft: spacing.xs,
            },
          ]}
        >
          <Text
            style={[
              styles.countText,
              { color: isFilled ? colors.text.inverse : colors.text.secondary },
            ]}
          >
            {count}
          </Text>
        </View>
      )}

      {showRemove && (
        <TouchableOpacity
          onPress={onRemove}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          style={[styles.removeBtn, { marginLeft: spacing.xs }]}
        >
          <Text style={[styles.removeIcon, { color: isFilled ? colors.text.inverse : colors.text.secondary }]}>
            ✕
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  label: {
    fontWeight: '500',
  },
  countBadge: {
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
  },
  removeBtn: {
    padding: 2,
  },
  removeIcon: {
    fontSize: 12,
    fontWeight: '600',
  },
});
