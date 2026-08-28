// Auth Module - Sign In Screen

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { DoctorIllustration } from '../../../shared/components/Illustrations';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { validatePhone } from '../../../shared/utils/phoneValidation';

interface SignInScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
  };
}

export function SignInScreen({ navigation }: SignInScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { signInWithPhone } = useAuthContext();
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendOtp = async () => {
    const trimmed = phone.trim();
    const validationError = validatePhone(trimmed);
    if (validationError) {
      Alert.alert('Invalid phone number', validationError);
      return;
    }

    setIsSending(true);
    const { error } = await signInWithPhone(trimmed);
    setIsSending(false);

    if (error) {
      Alert.alert('Failed to send OTP', error);
      return;
    }

    navigation.navigate('OTPVerification', { phone: trimmed });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <View style={styles.illustrationWrapper}>
          <DoctorIllustration size={120} />
        </View>
        <AppText variant="h1" style={{ color: colors.text.primary, textAlign: 'center' }}>
          Welcome back
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm, textAlign: 'center' }}>
          Enter your phone number to continue
        </AppText>
        <View style={{ marginTop: spacing.lg }}>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number (e.g. +919876543210)"
            keyboardType="phone-pad"
          />
        </View>
      </View>
      <View style={styles.buttons}>
        <Button
          title={isSending ? 'Sending OTP...' : 'Send OTP'}
          onPress={handleSendOtp}
          variant="primary"
          disabled={isSending}
        />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate('SignUp')}
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
  illustrationWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  buttons: {
    gap: 12,
  },
});
