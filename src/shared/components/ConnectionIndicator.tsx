// Connection Status Indicator

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../components/AppText';
import { useConnectionStatus } from '../../infrastructure/connectivity/connectionManager';
import { useThemeColors, useThemeSpacing } from '../components/ThemeProvider';

export function ConnectionIndicator() {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { status } = useConnectionStatus();

  if (status === 'online') {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.status.error, paddingVertical: spacing.xs, paddingHorizontal: spacing.md }]}>
      <AppText variant="caption" style={{ color: '#FFFFFF', fontWeight: '600' }}>
        {status === 'offline' ? 'You are offline' : 'Checking connection...'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
