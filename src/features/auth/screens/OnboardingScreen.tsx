// Auth Module - Onboarding Screen

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { useIconEntrance, useTextEntrance, useButtonEntrance } from '../../../shared/hooks/useEntranceAnimation';
import Leaf from '../../../../assets/icons/leaf.svg';

interface OnboardingScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  const iconStyle = useIconEntrance({ delay: 200, duration: 600 });
  const titleStyle = useTextEntrance({ delay: 500, duration: 500 });
  const bodyStyle = useTextEntrance({ delay: 650, duration: 500 });
  const buttonStyle = useButtonEntrance({ delay: 800, duration: 400 });

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.illustrationArea}>
        <Animated.View style={[styles.iconCircle, iconStyle]}>
          <Leaf width={64} height={64} color="#2D6A4F" />
        </Animated.View>
      </View>
      <Animated.View style={titleStyle}>
        <AppText variant="h1" style={{ color: colors.text.primary, textAlign: 'center' }}>
          Discover Ayurveda
        </AppText>
      </Animated.View>
      <Animated.View style={bodyStyle}>
        <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md, textAlign: 'center' }}>
          Connect with experienced Ayurvedic doctors and explore authentic products for your wellness journey.
        </AppText>
      </Animated.View>
      <Animated.View style={[styles.buttons, buttonStyle]}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('SignIn')}
          variant="primary"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 60,
  },
  illustrationArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingVertical: 24,
  },
  buttons: {
    gap: 12,
  },
});
