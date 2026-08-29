// Auth Module - Splash Screen

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { useIconEntrance, useTextEntrance } from '../../../shared/hooks/useEntranceAnimation';
import LogoIconBgLight from '../../../../assets/icons/logo-icon-bg-light.svg';

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

  const iconStyle = useIconEntrance({ delay: 100, duration: 600 });
  const titleStyle = useTextEntrance({ delay: 350, duration: 500 });
  const taglineStyle = useTextEntrance({ delay: 500, duration: 500 });

  return (
    <View style={[styles.container, { backgroundColor: colors.action.primary }]}>
      <Animated.View style={[styles.logoWrapper, iconStyle]}>
        <LogoIconBgLight width={80} height={80} />
      </Animated.View>
      <Animated.View style={titleStyle}>
        <AppText variant="h1" style={[styles.logo, { color: colors.text.inverse }]}>
          Amrutam
        </AppText>
      </Animated.View>
      <Animated.View style={taglineStyle}>
        <AppText variant="body" style={[styles.tagline, { color: colors.text.inverse, opacity: 0.8 }]}>
          Your complete Ayurvedic wellness companion
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    width: 80,
    height: 80,
  },
  logo: {
    marginTop: 24,
  },
  tagline: {
    marginTop: 8,
  },
});
