// Error State Component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../components/Button';
import { AppText } from '../components/AppText';
import { useThemeColors, useThemeSpacing } from '../components/ThemeProvider';
import { classifyApiError } from '../errors/errorClasses';

interface AppErrorStateProps {
  error?: unknown;
  title?: string;
  message?: string;
  type?: 'retryable' | 'validation' | 'conflict' | 'session' | 'offline' | 'unknown';
  onRetry?: () => void;
  onAction?: () => void;
  actionLabel?: string;
}

export function AppErrorState({
  error,
  title,
  message,
  type,
  onRetry,
  onAction,
  actionLabel = 'Retry',
}: AppErrorStateProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const classified = error ? classifyApiError(error) : null;

  const displayTitle = title ?? classified?.title ?? 'Something went wrong';
  const displayMessage = message ?? (classified?.message ?? 'Please try again later.');
  const displayType = type ?? classified?.category ?? 'unknown';
  const isRetryable = (type === 'retryable') || (classified?.retryable ?? false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary, padding: spacing.lg }]}>
      <AppText variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, textAlign: 'center' }}>
        {displayTitle}
      </AppText>
      <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textAlign: 'center' }}>
        {displayMessage}
      </AppText>
      <View style={styles.actions}>
        {isRetryable && onRetry && (
          <Button title={actionLabel} variant="primary" size="medium" onPress={onRetry} style={styles.button} />
        )}
        {displayType === 'conflict' && onAction && (
          <Button title={actionLabel} variant="outline" size="medium" onPress={onAction} style={styles.button} />
        )}
        {displayType === 'session' && (
          <Button title="Log in again" variant="primary" size="medium" onPress={onAction ?? (() => {})} style={styles.button} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    minWidth: 120,
  },
});
