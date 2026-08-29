// Card Component

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';
import { lightTheme } from '../design-system/theme';

const themeShadows = lightTheme.shadows;

type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export function Card({
  children,
  variant = 'elevated',
  onPress,
  style,
  testID,
}: CardProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  const cardStyles: ViewStyle[] = [
    styles.base,
    { borderRadius: spacing.md, padding: spacing.md },
    variant === 'elevated' && {
      backgroundColor: colors.surface.default,
      ...themeShadows.md,
    },
    variant === 'outlined' && {
      backgroundColor: colors.surface.default,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    variant === 'filled' && {
      backgroundColor: colors.background.secondary,
    },
    style,
  ].filter((s): s is ViewStyle => s !== undefined && s !== false);

  if (onPress !== undefined) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel="Card"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
});
