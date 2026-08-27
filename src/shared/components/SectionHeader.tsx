// SectionHeader - Section header with optional "See all" link

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  style,
}: SectionHeaderProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }, style]}>
      <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>
        {title}
      </Text>
      {actionLabel !== undefined && onAction !== undefined && (
        <TouchableOpacity onPress={onAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.action, { color: colors.action.primary }]}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
  },
});
