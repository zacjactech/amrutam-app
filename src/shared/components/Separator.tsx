// Separator - Horizontal divider line

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

interface SeparatorProps {
  style?: ViewStyle;
}

export function Separator({ style }: SeparatorProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View
      style={[
        styles.separator,
        {
          height: 1,
          backgroundColor: colors.border.default,
          marginVertical: spacing.md,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    width: '100%',
  },
});
