// AppEmptyState - Standardized empty state with icon

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

interface AppEmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  iconBgColor?: string;
  style?: ViewStyle;
}

export function AppEmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon,
  iconBgColor,
  style,
}: AppEmptyStateProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { padding: spacing.xxl }, style]}>
      {icon !== undefined && (
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: iconBgColor ?? colors.action.primarySoft, marginBottom: spacing.lg },
          ]}
        >
          {icon}
        </View>
      )}
      <AppText variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, textAlign: 'center' }}>
        {title}
      </AppText>
      {message !== undefined && (
        <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textAlign: 'center' }}>
          {message}
        </AppText>
      )}
      {actionLabel !== undefined && onAction !== undefined && (
        <Button title={actionLabel} onPress={onAction} variant="outline" size="medium" />
      )}
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
});
