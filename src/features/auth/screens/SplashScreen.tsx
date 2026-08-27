// Auth Module - Splash Screen

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import { SplashIllustration } from '../../../shared/components/Illustrations';

interface SplashScreenProps {
  navigation: {
    reset: (state: { index: number; routes: { name: string }[] }) => void;
  };
}

export function SplashScreen({ navigation }: SplashScreenProps) {
  const colors = useThemeColors();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.action.primary }]}>
      <SplashIllustration size={160} />
      <AppText variant="display" style={styles.logo}>
        Amrutam
      </AppText>
      <AppText variant="caption" style={styles.tagline}>
        Ayurvedic Wellness
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    marginTop: 24,
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
});
