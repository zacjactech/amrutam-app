// Shared Authentication Header Component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import Leaf from '../../../../assets/icons/leaf.svg';

interface AuthHeaderProps {
  title: string;
  description: string;
  /** Override the default icon size */
  iconSize?: number;
}

export function AuthHeader({ title, description, iconSize = 56 }: AuthHeaderProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { width: 96, height: 96, borderRadius: 48 }]}>
        <Leaf width={iconSize} height={iconSize} color="#2D6A4F" />
      </View>
      <AppText
        variant="h1"
        style={[styles.title, { color: colors.text.primary, marginTop: spacing.lg }]}
      >
        {title}
      </AppText>
      <AppText
        variant="body"
        style={[styles.description, { color: colors.text.secondary, marginTop: spacing.sm }]}
      >
        {description}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
