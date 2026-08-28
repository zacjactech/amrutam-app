// Connection Status Indicator

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, StatusBar } from 'react-native';
import { AppText } from '../components/AppText';
import { useConnectionStatus } from '../../infrastructure/connectivity/connectionManager';
import { useThemeColors, useThemeSpacing } from '../components/ThemeProvider';

const STATUSBAR_HEIGHT = StatusBar.currentHeight ?? 0;

export function ConnectionIndicator() {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { status } = useConnectionStatus();
  const slideAnim = useRef(new Animated.Value(status === 'online' ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: status === 'online' ? 0 : 1,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [status, slideAnim]);

  if (status !== 'offline') {
    return null;
  }

  const isError = true;
  const backgroundColor = isError ? colors.status.error : colors.status.warning;
  const textColor = '#FFFFFF';
  const message = isError ? 'You are offline' : 'Checking connection...';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: STATUSBAR_HEIGHT + spacing.xs,
          paddingBottom: spacing.xs,
          transform: [{ translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-60, 0],
          }) }],
        },
      ]}
    >
      <AppText variant="caption" style={{ color: textColor, fontWeight: '600' }}>
        {message}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
