// AppErrorState - Error state with retry

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button } from './Button';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';
import { classifyApiError } from '../errors/errorClasses';

interface AppErrorStateProps {
  error?: unknown;
  title?: string;
  message?: string;
  type?: 'retryable' | 'validation' | 'conflict' | 'session' | 'offline' | 'unknown';
  onRetry?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  style?: ViewStyle;
}

export function AppErrorState({
  error,
  title,
  message,
  type,
  onRetry,
  onAction,
  actionLabel = 'Retry',
  style,
}: AppErrorStateProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const classified = error ? classifyApiError(error) : null;

  const displayTitle = title ?? classified?.title ?? 'Something went wrong';
  const displayMessage = message ?? (classified?.message ?? 'Please try again later.');
  const displayType = type ?? classified?.category ?? 'unknown';
  const isRetryable = type === 'retryable' || (classified?.retryable ?? false);

  return (
    <View style={[styles.container, { padding: spacing.xxl }, style]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.status.errorSoft, marginBottom: spacing.lg }]}>
        <Text style={[styles.errorIcon, { color: colors.status.error }]}>✕</Text>
      </View>
      <Text style={[styles.title, { color: colors.text.primary, marginBottom: spacing.sm }]}>
        {displayTitle}
      </Text>
      <Text style={[styles.message, { color: colors.text.secondary, marginBottom: spacing.xl }]}>
        {displayMessage}
      </Text>
      <View style={styles.actions}>
        {isRetryable && onRetry && (
          <Button title={actionLabel} variant="outline" size="medium" onPress={onRetry} />
        )}
        {displayType === 'conflict' && onAction && (
          <Button title={actionLabel} variant="outline" size="medium" onPress={onAction} />
        )}
        {displayType === 'session' && (
          <Button title="Log in again" variant="primary" size="medium" onPress={onAction ?? (() => {})} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIcon: {
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
