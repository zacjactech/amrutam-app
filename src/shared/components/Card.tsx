// Card Component

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
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
