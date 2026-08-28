// Badge - Status badge component

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeSpacing } from './ThemeProvider';

type BadgeVariant = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'info';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  style?: ViewStyle;
}

const BADGE_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  confirmed: { bg: '#D1FAE5', text: '#2D6A4F' },
  pending: { bg: '#FEF3C7', text: '#F59E0B' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626' },
  completed: { bg: '#E5E7EB', text: '#6B7280' },
  info: { bg: '#DBEAFE', text: '#3B82F6' },
};

export function Badge({ variant, label, style }: BadgeProps): React.JSX.Element {
  const spacing = useThemeSpacing();
  const colors = BADGE_COLORS[variant];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: colors.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 999,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
});
