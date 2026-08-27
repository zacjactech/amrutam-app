// StatusRow - Key-value row for detail screens

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';
import { Separator } from './Separator';

interface StatusRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  showSeparator?: boolean;
  style?: ViewStyle;
}

export function StatusRow({
  icon,
  label,
  value,
  showSeparator = true,
  style,
}: StatusRowProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <>
      <View style={[styles.container, { paddingVertical: spacing.md, paddingHorizontal: spacing.lg }, style]}>
        {icon !== undefined && <View style={[styles.icon, { marginRight: spacing.md }]}>{icon}</View>}
        <Text style={[styles.label, { color: colors.text.secondary }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.value, { color: colors.text.primary }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
      {showSeparator && <Separator style={{ marginVertical: 0 }} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },
});
