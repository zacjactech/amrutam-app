// Profile Module - Profile Main Screen

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../../shared/components/AppText';
import { Avatar } from '../../../shared/components/Avatar';
import { Button } from '../../../shared/components/Button';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { useToast } from '../../../shared/components/Toast';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';

interface ProfileMainScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    reset: (state: { index: number; routes: { name: string }[] }) => void;
  };
}

export function ProfileMainScreen({ navigation }: ProfileMainScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { user, signOut } = useAuthContext();
  const { showToast } = useToast();

  const email = user?.email ?? 'Not available';
  const displayName = user?.user_metadata?.full_name ?? user?.email ?? 'User';

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Splash' }],
              });
            } catch {
              showToast('Failed to sign out. Please try again.', 'error');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardDismissMode="interactive">
        <View style={styles.header}>
          <Avatar size="xl" initials={displayName.charAt(0).toUpperCase()} />
          <AppText variant="h1" style={{ color: colors.text.primary, marginTop: spacing.md }}>
            {displayName}
          </AppText>
          <AppText variant="body" style={{ color: colors.text.secondary }}>
            {email}
          </AppText>
        </View>
        <View style={[styles.section, { backgroundColor: colors.surface.default, borderColor: colors.border.default }]}>
          <TouchableOpacity
            style={[styles.row, { borderBottomColor: colors.border.default }]}
            onPress={() => navigation.navigate('Settings')}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <AppText variant="body" style={{ color: colors.text.primary }}>Settings</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.row, { borderBottomColor: colors.border.default }]}
            onPress={() => navigation.navigate('Notifications')}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <AppText variant="body" style={{ color: colors.text.primary }}>Notifications</AppText>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: spacing.xl }}>
          <Button
            title="Sign Out"
            variant="outline"
            onPress={handleSignOut}
            style={{ borderColor: colors.action.destructive }}
            textStyle={{ color: colors.action.destructive }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 16,
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
  },
});
