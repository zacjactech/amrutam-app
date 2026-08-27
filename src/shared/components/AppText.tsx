// AppText - Typography primitive

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeTypography, useThemeColors } from './ThemeProvider';

type AppTextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'bodyLarge' | 'body' | 'bodySmall' | 'caption' | 'button' | 'label';

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  children: React.ReactNode;
}

export function AppText({ variant = 'body', style, children, ...rest }: AppTextProps): React.JSX.Element {
  const typography = useThemeTypography();
  const colors = useThemeColors();
  const textStyle = [styles.base, typography[variant], { color: colors.text.primary }, style];

  return (
    <Text style={textStyle} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {},
});
