// AppErrorState - Error state with retry

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';
import { classifyApiError } from '../errors/errorClasses';
import { AlertCircle } from '../assets/icons';

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
        <AlertCircle width={32} height={32} color={colors.status.error} />
      </View>
      <AppText variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, textAlign: 'center' }}>
        {displayTitle}
      </AppText>
      <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, textAlign: 'center' }}>
        {displayMessage}
      </AppText>
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
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
