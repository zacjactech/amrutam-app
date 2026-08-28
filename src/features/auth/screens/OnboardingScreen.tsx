// Auth Module - Onboarding Screen

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import { useIconEntrance, useTextEntrance, useButtonEntrance } from '../../../shared/hooks/useEntranceAnimation';
import Leaf from '../../../../assets/icons/leaf.svg';

interface OnboardingScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const colors = useThemeColors();

  const iconStyle = useIconEntrance({ delay: 200, duration: 600 });
  const titleStyle = useTextEntrance({ delay: 500, duration: 500 });
  const bodyStyle = useTextEntrance({ delay: 650, duration: 500 });
  const buttonStyle = useButtonEntrance({ delay: 800, duration: 400 });

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <View style={styles.illustrationArea}>
          <Animated.View style={[styles.iconCircle, iconStyle]}>
            <Leaf width={64} height={64} color="#2D6A4F" />
          </Animated.View>
        </View>
        <Animated.View style={titleStyle}>
          <AppText variant="h1" style={[styles.title, { color: colors.text.primary }]}>
            Discover Ayurveda
          </AppText>
        </Animated.View>
        <Animated.View style={bodyStyle}>
          <AppText variant="body" style={[styles.description, { color: colors.text.secondary }]}>
            Connect with experienced Ayurvedic doctors and explore authentic products for your wellness journey.
          </AppText>
        </Animated.View>
        <Animated.View style={buttonStyle}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('SignIn')}
            variant="primary"
            size="large"
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
