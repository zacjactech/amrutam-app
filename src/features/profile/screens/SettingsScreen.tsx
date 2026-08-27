// Profile Module - Settings Screen

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface SettingsScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="h1" style={{ color: colors.text.primary }}>
          Settings
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md }}>
          App preferences and account settings
        </AppText>
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
