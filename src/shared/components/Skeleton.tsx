// Skeleton - Animated skeleton loader with shimmer

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, ViewStyle } from 'react-native';
import { useThemeColors } from './ThemeProvider';

interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  variant?: 'rect' | 'circle';
  style?: ViewStyle;
}

export function Skeleton({
  width = 100,
  height = 16,
  borderRadius,
  variant = 'rect',
  style,
}: SkeletonProps): React.JSX.Element {
  const colors = useThemeColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => {
      pulse.stop();
    };
  }, [opacity]);

  const resolvedBorderRadius =
    borderRadius !== undefined
      ? borderRadius
      : variant === 'circle'
        ? Math.max(width, height) / 2
        : 4;

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: resolvedBorderRadius,
          backgroundColor: colors.skeleton,
          opacity,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {},
});
