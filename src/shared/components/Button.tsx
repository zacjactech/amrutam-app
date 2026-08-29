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
  accessibilityLabel?: string;
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
  accessibilityLabel,
  style,
  textStyle,
  testID,
}: ButtonProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  const isDisabled = disabled || loading;

  const buttonStyles: ViewStyle[] = [
    styles.base,
    { borderRadius: spacing.sm },
    variant === 'primary' && {
      backgroundColor: isDisabled ? colors.text.disabled : colors.action.primary,
    },
    variant === 'secondary' && {
      backgroundColor: isDisabled ? colors.background.secondary : colors.action.primarySoft,
    },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: isDisabled ? colors.text.disabled : colors.action.primary,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    size === 'small' && {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      minHeight: 36,
    },
    size === 'medium' && {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      minHeight: 48,
    },
    size === 'large' && {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      minHeight: 52,
    },
    isDisabled && styles.disabled,
    style,
  ].filter((s): s is ViewStyle => s !== null && s !== undefined && s !== false);

  const textStyles: TextStyle[] = [
    styles.text,
    variant === 'primary' && { color: colors.text.inverse },
    variant === 'secondary' && { color: colors.action.primary },
    variant === 'outline' && { color: isDisabled ? colors.text.disabled : colors.action.primary },
    variant === 'ghost' && { color: colors.action.primary },
    size === 'small' && { fontSize: 14 },
    size === 'medium' && { fontSize: 16 },
    size === 'large' && { fontSize: 16 },
    isDisabled && styles.disabledText,
    textStyle,
  ].filter((s): s is TextStyle => s !== null && s !== undefined && s !== false);

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.text.inverse : colors.action.primary}
          size="small"
          style={styles.loader}
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
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.8,
  },
  loader: {
    marginVertical: 2,
  },
});
