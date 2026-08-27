// Home Module - Home Dashboard Screen

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface HomeDashboardScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

export function HomeDashboardScreen({ navigation }: HomeDashboardScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="h1" style={{ color: colors.text.primary }}>
          Welcome to Amrutam
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm }}>
          Your Ayurvedic wellness companion
        </AppText>
        <View style={{ marginTop: spacing.lg }}>
          <Button
            title="Find a Doctor"
            onPress={() => navigation.navigate('Consultations')}
            variant="primary"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
});
