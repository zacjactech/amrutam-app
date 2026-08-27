// Button Component

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}: ButtonProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  const buttonStyles: ViewStyle[] = [
    styles.base,
    { borderRadius: spacing.sm },
    variant === 'primary' && { backgroundColor: colors.action.primary },
    variant === 'secondary' && { backgroundColor: colors.action.primarySoft },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.action.primary,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    size === 'small' && { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    size === 'medium' && { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    size === 'large' && { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
    disabled && styles.disabled,
    style,
  ].filter((s): s is ViewStyle => s !== null && s !== undefined && s !== false);

  const textStyles: TextStyle[] = [
    styles.text,
    variant === 'primary' && { color: colors.surface.default },
    variant === 'secondary' && { color: colors.action.primary },
    variant === 'outline' && { color: colors.action.primary },
    variant === 'ghost' && { color: colors.action.primary },
    size === 'small' && { fontSize: 14 },
    size === 'medium' && { fontSize: 16 },
    size === 'large' && { fontSize: 18 },
    disabled && styles.disabledText,
    textStyle,
  ].filter((s): s is TextStyle => s !== null && s !== undefined && s !== false);

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.surface.default : colors.action.primary}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.7,
  },
});
