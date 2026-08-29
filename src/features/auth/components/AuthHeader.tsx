// Shared Authentication Header Component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import LogoIconBg from '../../../../assets/icons/logo-icon-bg.svg';

interface AuthHeaderProps {
  title: string;
  description?: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps): React.JSX.Element {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <LogoIconBg width={32} height={32} />
        <AppText variant="h2" style={{ color: colors.action.primary, marginLeft: 8 }}>
          Amrutam
        </AppText>
      </View>
      <AppText
        variant="display"
        style={[styles.title, { color: colors.text.primary }]}
      >
        {title}
      </AppText>
      {description && (
        <AppText
          variant="bodyLarge"
          style={[styles.description, { color: colors.text.secondary }]}
        >
          {description}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'left',
    marginBottom: 4,
  },
  description: {
    textAlign: 'left',
    lineHeight: 22,
  },
});
