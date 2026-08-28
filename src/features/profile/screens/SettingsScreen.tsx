// Profile Module - Settings Screen
// Profile editing with name update and phone number change (OTP-verified)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useTheme, useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { validatePhone, formatPhoneForDisplay } from '../../../shared/utils/phoneValidation';

interface SettingsScreenProps {
  navigation: {
    goBack: () => void;
  };
}

type PhoneChangeStep = 'idle' | 'entering' | 'otp_sent' | 'verifying';

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { mode, setMode } = useTheme();
  const {
    user,
    updateProfile,
    sendPhoneChangeOtp,
    verifyPhoneChange,
    otpCooldownSeconds,
  } = useAuthContext();

  // Profile fields
  const currentName = (user?.user_metadata?.full_name as string) ?? '';
  const currentPhone = user?.phone ?? '';

  const [name, setName] = useState(currentName);
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  // Phone change flow
  const [phoneStep, setPhoneStep] = useState<PhoneChangeStep>('idle');
  const [newPhone, setNewPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nameSavedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startCooldownTimer = useCallback((phone: string) => {
    if (cooldownRef.current) {
      clearInterval(cooldownRef.current);
    }

    const remaining = otpCooldownSeconds(phone);
    if (remaining <= 0) {
      setCooldown(0);
      return;
    }

    setCooldown(remaining);

    cooldownRef.current = setInterval(() => {
      const newRemaining = otpCooldownSeconds(phone);
      setCooldown(newRemaining);
      if (newRemaining <= 0 && cooldownRef.current) {
        clearInterval(cooldownRef.current);
        cooldownRef.current = null;
      }
    }, 1000);
  }, [otpCooldownSeconds]);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) {
        clearInterval(cooldownRef.current);
      }
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
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }

    setIsSavingName(true);
    const { error } = await updateProfile({ full_name: trimmed });
    setIsSavingName(false);

    if (error) {
      Alert.alert('Failed to save name', error);
      return;
    }

    setNameSaved(true);
    if (nameSavedTimeoutRef.current) {
      clearTimeout(nameSavedTimeoutRef.current);
    }
    nameSavedTimeoutRef.current = setTimeout(() => setNameSaved(false), 2000);
  };

  // ─── Phone Change Flow ──────────────────────────────────────────────────

  const handleStartPhoneChange = () => {
    setPhoneStep('entering');
    setNewPhone('');
    setPhoneOtp('');
    setPhoneError('');
  };

  const handleSendPhoneOtp = async () => {
    const validationError = validatePhone(newPhone);
    if (validationError) {
      setPhoneError(validationError);
      return;
    }

    if (newPhone === currentPhone) {
      setPhoneError('This is already your current phone number.');
      return;
    }

    setPhoneError('');
    const { error } = await sendPhoneChangeOtp(newPhone);
    if (error) {
      setPhoneError(error);
      return;
    }

    setPhoneStep('otp_sent');
    startCooldownTimer(newPhone);
  };

  const handleVerifyPhoneChange = async () => {
    const trimmedOtp = phoneOtp.trim();
    if (!trimmedOtp || trimmedOtp.length < 4) {
      setPhoneError('Please enter the complete OTP code.');
      return;
    }

    setPhoneStep('verifying');
    setPhoneError('');

    const { error } = await verifyPhoneChange(newPhone, trimmedOtp);
    if (error) {
      setPhoneStep('otp_sent');
      setPhoneError(error);
      return;
    }

    // Success — reset state
    setPhoneStep('idle');
    setNewPhone('');
    setPhoneOtp('');
    Alert.alert('Phone Updated', 'Your phone number has been changed successfully.');
  };

  const handleResendPhoneOtp = async () => {
    if (cooldown > 0) {
      Alert.alert('Please wait', `You can request another OTP in ${cooldown} second${cooldown === 1 ? '' : 's'}.`);
      return;
    }

    const { error } = await sendPhoneChangeOtp(newPhone);
    if (error) {
      setPhoneError(error);
      return;
    }

    Alert.alert('OTP Sent', 'A new OTP has been sent to your new phone number.');
    startCooldownTimer(newPhone);
  };

  const handleCancelPhoneChange = () => {
    setPhoneStep('idle');
    setNewPhone('');
    setPhoneOtp('');
    setPhoneError('');
  };

  const nameHasChanges = name.trim() !== currentName && name.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
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
          <View style={styles.fieldRow}>              <Input
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

        {/* ─── Phone Section ──────────────────────────────────── */}
        <View style={[styles.section, { backgroundColor: colors.surface.default, borderColor: colors.border.default }]}>
          <AppText variant="label" style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            Phone Number
          </AppText>

          {phoneStep === 'idle' && (
            <>
              <View style={styles.fieldRow}>
                <AppText variant="body" style={{ color: colors.text.primary, flex: 1 }}>
                  {formatPhoneForDisplay(currentPhone)}
                </AppText>
                <TouchableOpacity onPress={handleStartPhoneChange}>
                  <AppText variant="body" style={{ color: colors.action.primary }}>
                    Change
                  </AppText>
                </TouchableOpacity>
              </View>
            </>
          )}

          {phoneStep === 'entering' && (
            <View style={styles.phoneChangeForm}>
              <Input
                value={newPhone}
                onChangeText={setNewPhone}
                placeholder="New phone (e.g. +919876543210)"
                keyboardType="phone-pad"
                containerStyle={styles.input}
              />
              {phoneError ? (
                <AppText variant="caption" style={{ color: colors.action.destructive, marginTop: spacing.xs }}>
                  {phoneError}
                </AppText>
              ) : null}
              <View style={styles.phoneChangeActions}>
                <Button
                  title="Send OTP"
                  onPress={handleSendPhoneOtp}
                  variant="primary"
                  style={styles.halfButton}
                />
                <Button
                  title="Cancel"
                  onPress={handleCancelPhoneChange}
                  variant="secondary"
                  style={styles.halfButton}
                />
              </View>
            </View>
          )}

          {(phoneStep === 'otp_sent' || phoneStep === 'verifying') && (
            <View style={styles.phoneChangeForm}>
              <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                Enter the OTP sent to{'\n'}{formatPhoneForDisplay(newPhone)}
              </AppText>
              <Input
                value={phoneOtp}
                onChangeText={setPhoneOtp}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                maxLength={6}
                containerStyle={styles.input}
              />
              {phoneError ? (
                <AppText variant="caption" style={{ color: colors.action.destructive, marginTop: spacing.xs }}>
                  {phoneError}
                </AppText>
              ) : null}
              <View style={styles.phoneChangeActions}>
                <Button
                  title={phoneStep === 'verifying' ? 'Verifying...' : 'Verify & Change'}
                  onPress={handleVerifyPhoneChange}
                  variant="primary"
                  disabled={phoneStep === 'verifying'}
                  style={styles.halfButton}
                />
                <Button
                  title={cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend OTP'}
                  onPress={handleResendPhoneOtp}
                  variant="secondary"
                  disabled={cooldown > 0}
                  style={styles.halfButton}
                />
              </View>
              <TouchableOpacity onPress={handleCancelPhoneChange} style={{ marginTop: spacing.sm }}>
                <AppText variant="caption" style={{ color: colors.text.secondary, textAlign: 'center' }}>
                  Cancel phone change
                </AppText>
              </TouchableOpacity>
            </View>
          )}
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
              {user?.email ?? 'Not set'}
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
  phoneChangeForm: {
    gap: 8,
  },
  phoneChangeActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  halfButton: {
    flex: 1,
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
