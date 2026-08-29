// Text Input Component

import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';
import IconEye from '../../../assets/icons/icon-eye.svg';
import IconEyeOff from '../../../assets/icons/icon-eye-off.svg';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle | ViewStyle[];
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    helper,
    leftIcon,
    rightIcon,
    containerStyle,
    secureTextEntry,
    onFocus,
    onBlur,
    ...textInputProps
  },
  ref,
): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const borderColor = error
    ? colors.status.error
    : isFocused
      ? colors.action.primary
      : colors.border.default;

  return (
    <View style={[styles.wrapper, { marginBottom: spacing.md }]}>
      {label !== undefined && (
        <Text
          style={[
            styles.label,
            { color: colors.text.primary, marginBottom: spacing.xs },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          { borderColor, backgroundColor: colors.surface.default },
          ...(Array.isArray(containerStyle) ? containerStyle : [containerStyle]),
        ]}
      >
        {leftIcon !== undefined && (
          <View style={[styles.iconLeft, { marginRight: spacing.sm }]}>
            {leftIcon}
          </View>
        )}
        <TextInput
          ref={ref}
          style={[styles.input, { color: colors.text.primary }]}
          placeholderTextColor={colors.text.tertiary}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          secureTextEntry={isSecure}
          {...textInputProps}
        />
        {secureTextEntry !== undefined && secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={[styles.iconRight, { marginLeft: spacing.sm, padding: spacing.xs }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isSecure ? (
              <IconEye width={18} height={18} color={colors.text.tertiary} />
            ) : (
              <IconEyeOff width={18} height={18} color={colors.action.primary} />
            )}
          </TouchableOpacity>
        )}
        {rightIcon !== undefined &&
          (secureTextEntry === undefined || !secureTextEntry) && (
            <View style={[styles.iconRight, { marginLeft: spacing.sm }]}>
              {rightIcon}
            </View>
          )}
      </View>
      {error !== undefined ? (
        <Text
          style={[
            styles.error,
            { color: colors.status.error, marginTop: spacing.xs },
          ]}
        >
          {error}
        </Text>
      ) : helper !== undefined ? (
        <Text
          style={[
            styles.helper,
            { color: colors.text.secondary, marginTop: spacing.xs },
          ]}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    height: 48,
    paddingVertical: 12,
    margin: 0,
  },
  iconLeft: {},
  iconRight: {},
  error: {
    fontSize: 12,
    lineHeight: 16,
  },
  helper: {
    fontSize: 12,
    lineHeight: 16,
  },
});
