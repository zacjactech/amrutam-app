// AppEmptyState - Standardized empty state

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Button } from './Button';
import { AppText } from './AppText';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

interface AppEmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function AppEmptyState({
  title,
  message,
  actionLabel,
  onAction,
  style,
}: AppEmptyStateProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { padding: spacing.xxl }, style]}>
      <AppText variant="h3" style={[styles.title, { color: colors.text.primary, marginBottom: spacing.sm }]}>
        {title}
      </AppText>
      {message !== undefined && (
        <AppText variant="body" style={[styles.message, { color: colors.text.secondary, marginBottom: spacing.lg }]}>
          {message}
        </AppText>
      )}
      {actionLabel !== undefined && onAction !== undefined && (
        <Button title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {},
  message: {
    textAlign: 'center',
  },
});
