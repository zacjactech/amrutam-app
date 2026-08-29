// Profile Module - Settings Screen
// Profile editing with name update and email display

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useTheme, useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';

interface SettingsScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { mode, setMode } = useTheme();
  const { user, updateProfile } = useAuthContext();

  // Profile fields
  const currentName = (user?.user_metadata?.full_name as string) ?? '';
  const currentEmail = user?.email ?? '';

  const [name, setName] = useState(currentName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const nameSavedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (nameSavedTimeoutRef.current) {
        clearTimeout(nameSavedTimeoutRef.current);
      }
    };
  }, []);

  // ─── Name Save ──────────────────────────────────────────────────────────

  const handleSaveName = async () => {
    const trimmed = name.trim();
    if (trimmed === currentName) return;

    if (!trimmed) {
      const { Alert } = require('react-native');
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }

    setIsSavingName(true);
    const { error } = await updateProfile({ full_name: trimmed });
    setIsSavingName(false);

    if (error) {
      const { Alert } = require('react-native');
      Alert.alert('Failed to save name', error);
      return;
    }

    setNameSaved(true);
    if (nameSavedTimeoutRef.current) {
      clearTimeout(nameSavedTimeoutRef.current);
    }
    nameSavedTimeoutRef.current = setTimeout(() => setNameSaved(false), 2000);
  };

  const nameHasChanges = name.trim() !== currentName && name.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ─── Header ──────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AppText variant="body" style={{ color: colors.action.primary }}>
              Back
            </AppText>
          </TouchableOpacity>
          <AppText variant="h2" style={{ color: colors.text.primary }}>
            Edit Profile
          </AppText>
          <View style={{ width: 40 }} />
        </View>

        {/* ─── Name Section ───────────────────────────────────── */}
        <View style={[styles.section, { backgroundColor: colors.surface.default, borderColor: colors.border.default }]}>
          <AppText variant="label" style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            Full Name
          </AppText>
          <View style={styles.fieldRow}>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              containerStyle={styles.input}
            />
          </View>
          {nameHasChanges && (
            <Button
              title={isSavingName ? 'Saving...' : nameSaved ? 'Saved!' : 'Save Name'}
              onPress={handleSaveName}
              variant="primary"
              disabled={isSavingName || nameSaved}
              style={styles.saveButton}
            />
          )}
        </View>

        {/* ─── Email Section ──────────────────────────────────── */}
        <View style={[styles.section, { backgroundColor: colors.surface.default, borderColor: colors.border.default }]}>
          <AppText variant="label" style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            Email
          </AppText>
          <View style={styles.fieldRow}>
            <AppText variant="body" style={{ color: colors.text.primary, flex: 1 }}>
              {currentEmail || 'Not set'}
            </AppText>
          </View>
        </View>

        {/* ─── Appearance ────────────────────────────────────── */}
        <View style={[styles.section, { backgroundColor: colors.surface.default, borderColor: colors.border.default }]}>
          <AppText variant="label" style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            Appearance
          </AppText>

          <View style={[styles.themeToggleContainer, { borderRadius: spacing.sm, borderColor: colors.border.default, borderWidth: 1, overflow: 'hidden' }]}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                {
                  backgroundColor: mode === 'light' ? colors.action.primary : 'transparent',
                  borderRadius: spacing.sm,
                },
              ]}
              onPress={() => setMode('light')}
              activeOpacity={0.7}
              accessibilityLabel="Light mode"
              accessibilityRole="radio"
              accessibilityState={{ checked: mode === 'light' }}
            >
              <AppText
                variant="body"
                style={{
                  color: mode === 'light' ? colors.text.inverse : colors.text.primary,
                  fontWeight: mode === 'light' ? '600' : '400',
                }}
              >
                ☀ Light
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                {
                  backgroundColor: mode === 'dark' ? colors.action.primary : 'transparent',
                  borderRadius: spacing.sm,
                },
              ]}
              onPress={() => setMode('dark')}
              activeOpacity={0.7}
              accessibilityLabel="Dark mode"
              accessibilityRole="radio"
              accessibilityState={{ checked: mode === 'dark' }}
            >
              <AppText
                variant="body"
                style={{
                  color: mode === 'dark' ? colors.text.inverse : colors.text.primary,
                  fontWeight: mode === 'dark' ? '600' : '400',
                }}
              >
                🌙 Dark
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Account Info ───────────────────────────────────── */}
        <View style={[styles.section, { backgroundColor: colors.surface.default, borderColor: colors.border.default }]}>
          <AppText variant="label" style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            Account
          </AppText>
          <View style={styles.fieldRow}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>Email</AppText>
            <AppText variant="body" style={{ color: colors.text.primary }}>
              {currentEmail || 'Not set'}
            </AppText>
          </View>
          <View style={styles.fieldRow}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>User ID</AppText>
            <AppText variant="caption" style={{ color: colors.text.secondary }}>
              {user?.id?.slice(0, 8)}...
            </AppText>
          </View>
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
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  saveButton: {
    marginTop: 4,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    padding: 3,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
