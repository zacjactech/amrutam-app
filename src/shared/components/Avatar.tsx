// Avatar - Circular avatar component

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColors } from './ThemeProvider';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: { uri: string } | number;
  initials?: string;
  size?: AvatarSize;
  showOnline?: boolean;
  ring?: boolean;
  style?: ViewStyle;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const FONT_SIZE_MAP: Record<AvatarSize, number> = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 32,
};

const DOT_SIZE_MAP: Record<AvatarSize, number> = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
};

export function Avatar({
  source,
  initials,
  size = 'md',
  showOnline = false,
  ring = false,
  style,
}: AvatarProps): React.JSX.Element {
  const colors = useThemeColors();
  const dimension = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];
  const dotSize = DOT_SIZE_MAP[size];

  const containerStyle: ViewStyle[] = [
    styles.container,
    {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
      backgroundColor: colors.action.primarySoft,
    },
    ...(ring
      ? [{ borderWidth: 2, borderColor: colors.action.primary }]
      : []),
    ...(style ? [style] : []),
  ];

  const initialsText = initials?.slice(0, 2).toUpperCase() ?? '?';

  return (
    <View style={containerStyle}>
      {source !== undefined ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            },
          ]}
        />
      ) : (
        <Text style={[styles.initials, { fontSize, color: colors.action.primary }]}>
          {initialsText}
        </Text>
      )}

      {showOnline && (
        <View
          style={[
            styles.onlineDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: colors.status.success,
              borderColor: colors.surface.default,
              borderWidth: 2,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
