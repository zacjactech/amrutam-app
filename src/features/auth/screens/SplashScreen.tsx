// Auth Module - Splash Screen

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { useIconEntrance, useTextEntrance } from '../../../shared/hooks/useEntranceAnimation';
import LogoIconBg from '../../../../assets/icons/logo-icon-bg.svg';

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
          routes: [{ name: 'SignIn' }],
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
        <LogoIconBg width={80} height={80} />
      </Animated.View>
      <Animated.View style={titleStyle}>
        <AppText variant="h1" style={styles.logo}>
          Amrutam
        </AppText>
      </Animated.View>
      <Animated.View style={taglineStyle}>
        <AppText variant="bodySmall" style={styles.tagline}>
          Ayurvedic Wellness
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
    color: '#FFFFFF',
    marginTop: 24,
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
});
