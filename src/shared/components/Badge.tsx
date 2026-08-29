// Badge - Status badge component

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

type BadgeVariant = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'info';

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  style?: ViewStyle;
}

function getBadgeColors(
  variant: BadgeVariant,
  colors: ReturnType<typeof useThemeColors>,
): { bg: string; text: string } {
  switch (variant) {
    case 'confirmed':
      return { bg: colors.status.successSoft, text: colors.status.success };
    case 'pending':
      return { bg: colors.status.warningSoft, text: colors.status.warning };
    case 'cancelled':
      return { bg: colors.status.errorSoft, text: colors.status.error };
    case 'completed':
      return { bg: colors.background.secondary, text: colors.text.secondary };
    case 'info':
      return { bg: colors.status.infoSoft, text: colors.status.info };
  }
}

export function Badge({ variant, label, style }: BadgeProps): React.JSX.Element {
  const spacing = useThemeSpacing();
  const colors = useThemeColors();
  const badgeColors = getBadgeColors(variant, colors);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: badgeColors.bg,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
        },
        style,
      ]}
    >
      <AppText
        variant="caption"
        style={[styles.text, { color: badgeColors.text }]}
        numberOfLines={1}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 999,
  },
  text: {
    fontWeight: '600',
  },
});
