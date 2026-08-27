// Profile Module - Notifications Screen

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface NotificationsScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText variant="h1" style={{ color: colors.text.primary }}>
          Notifications
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md }}>
          Manage your notification preferences
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
