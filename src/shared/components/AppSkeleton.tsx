// AppSkeleton - Loading placeholder

import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { useThemeColors } from './ThemeProvider';

interface AppSkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function AppSkeleton({
  width = 100,
  height = 16,
  borderRadius = 4,
  style,
}: AppSkeletonProps): React.JSX.Element {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border.default,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {},
});
