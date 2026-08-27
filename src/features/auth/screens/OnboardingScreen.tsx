// Auth Module - Onboarding Screen

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface OnboardingScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <AppText variant="h1" style={{ color: colors.text.primary }}>
          Discover Ayurveda
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md }}>
          Connect with experienced Ayurvedic doctors and explore authentic products for your wellness journey.
        </AppText>
      </View>
      <View style={styles.buttons}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('SignIn')}
          variant="primary"
        />
        <Button
          title="Skip"
          onPress={() => navigation.navigate('MainTabs')}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 80,
    paddingBottom: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  buttons: {
    gap: 12,
  },
});
