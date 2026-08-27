// Profile Module - Profile Main Screen

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Avatar } from '../../../shared/components/Avatar';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface ProfileMainScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export function ProfileMainScreen({ navigation }: ProfileMainScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar size="xl" />
          <AppText variant="h1" style={{ color: colors.text.primary, marginTop: spacing.md }}>
            User Name
          </AppText>
          <AppText variant="body" style={{ color: colors.text.secondary }}>
            +91 98765 43210
          </AppText>
        </View>
        <View style={[styles.section, { backgroundColor: colors.surface.default, borderColor: colors.border.default }]}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Settings')}
          >
            <AppText variant="body" style={{ color: colors.text.primary }}>Settings</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Notifications')}
          >
            <AppText variant="body" style={{ color: colors.text.primary }}>Notifications</AppText>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
});
