// Text Input Component

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  Animated,
  AccessibilityInfo,
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

function useShakeAnimation(error: string | undefined): Animated.Value {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const reducedMotionRef = useRef(false);
  const prevErrorRef = useRef(error);

  useEffect(() => {
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        reducedMotionRef.current = enabled;
      },
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const hasError = error !== undefined && error.length > 0;
    const prevHadError =
      prevErrorRef.current !== undefined && prevErrorRef.current.length > 0;
    prevErrorRef.current = error;

    // Only shake when error transitions from none → present
    if (!hasError || prevHadError || reducedMotionRef.current) {
      if (!hasError) shakeAnim.setValue(0);
      return;
    }

    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -4, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [error, shakeAnim]);

  return shakeAnim;
}

export function Input({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerStyle,
  secureTextEntry,
  ...textInputProps
}: InputProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const shakeAnim = useShakeAnimation(error);

  const containerStyles: (ViewStyle | undefined)[] = [
    styles.container,
    {
      borderColor: colors.border.default,
      backgroundColor: colors.surface.default,
    },
    isFocused
      ? {
          borderColor: colors.action.primary,
          shadowColor: colors.action.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          elevation: 0,
        }
      : undefined,
    error !== undefined
      ? {
          borderColor: colors.status.error,
          shadowColor: colors.status.error,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          elevation: 0,
        }
      : undefined,
    ...(Array.isArray(containerStyle) ? containerStyle : [containerStyle]),
  ];

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
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <View style={containerStyles}>
          {leftIcon !== undefined && (
            <View style={[styles.iconLeft, { marginRight: spacing.sm }]}>
              {leftIcon}
            </View>
          )}
          <TextInput
            style={[
              styles.input,
              { color: colors.text.primary, paddingVertical: spacing.sm },
            ]}
            placeholderTextColor={colors.text.tertiary}
            onFocus={(e) => {
              setIsFocused(true);
              textInputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              textInputProps.onBlur?.(e);
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
      </Animated.View>
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
}

const styles = StyleSheet.create({
  wrapper: {},
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
    paddingVertical: 0,
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
