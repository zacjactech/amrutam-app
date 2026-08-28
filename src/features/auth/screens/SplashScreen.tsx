// Auth Module - Splash Screen

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import { SplashIllustration } from '../../../shared/components/Illustrations';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';

interface SplashScreenProps {
  navigation: {
    reset: (state: { index: number; routes: { name: string }[] }) => void;
  };
}

export function SplashScreen({ navigation }: SplashScreenProps) {
  const colors = useThemeColors();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, navigation]);

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
