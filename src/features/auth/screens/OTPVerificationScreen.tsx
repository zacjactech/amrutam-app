// Auth Module - OTP Verification Screen (Email OTP)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { AuthHeader } from '../components/AuthHeader';

interface OTPVerificationScreenProps {
  route: { params: { email: string; name?: string } };
  navigation: {
    navigate: (screen: string) => void;
    reset: (state: { index: number; routes: { name: string }[] }) => void;
  };
}

export function OTPVerificationScreen({ route, navigation }: OTPVerificationScreenProps) {
  const colors = useThemeColors();
  const { verifyOtp, signInWithEmail, otpCooldownSeconds } = useAuthContext();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpInputRef = useRef<TextInput>(null);

  const email = route.params.email;
  const name = route.params.name;

  useEffect(() => {
    const timer = setTimeout(() => {
      otpInputRef.current?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const startCooldownTimer = useCallback(() => {
    if (cooldownRef.current) {
      clearInterval(cooldownRef.current);
    }

    const remaining = otpCooldownSeconds(email);
    if (remaining <= 0) {
      setCooldown(0);
      return;
    }

    setCooldown(remaining);

    cooldownRef.current = setInterval(() => {
      const newRemaining = otpCooldownSeconds(email);
      setCooldown(newRemaining);

      if (newRemaining <= 0 && cooldownRef.current) {
        clearInterval(cooldownRef.current);
        cooldownRef.current = null;
      }
    }, 1000);
  }, [email, otpCooldownSeconds]);

  useEffect(() => {
    startCooldownTimer();
    return () => {
      if (cooldownRef.current) {
        clearInterval(cooldownRef.current);
      }
    };
  }, [startCooldownTimer]);

  const handleVerify = useCallback(async () => {
    const trimmedOtp = otp.trim();
    if (!trimmedOtp || trimmedOtp.length < 8) {
      Alert.alert('Invalid OTP', 'Please enter the complete 8-digit OTP code.');
      return;
    }

    setIsVerifying(true);
    const { error } = await verifyOtp(email, trimmedOtp, name);
    setIsVerifying(false);

    if (error) {
      Alert.alert('Verification failed', error);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  }, [email, otp, name, verifyOtp, navigation]);

  const handleOtpChange = useCallback((text: string) => {
    setOtp(text);
    if (text.length === 8) {
      setTimeout(() => {
        handleVerify();
      }, 150);
    }
  }, [handleVerify]);

  const handleResendOtp = async () => {
    if (cooldown > 0) {
      Alert.alert('Please wait', `You can request another OTP in ${cooldown} second${cooldown === 1 ? '' : 's'}.`);
      return;
    }

    setIsResending(true);
    const { error } = await signInWithEmail(email);
    setIsResending(false);

    if (error) {
      Alert.alert('Failed to resend OTP', error);
      return;
    }

    Alert.alert('OTP Sent', 'A new OTP has been sent to your email.');
    startCooldownTimer();
  };

  const resendTitle = cooldown > 0
    ? `Resend OTP (${cooldown}s)`
    : isResending
      ? 'Sending...'
      : 'Resend OTP';

  // Mask email for display: j***n@example.com
  const maskedEmail = email.includes('@')
    ? email[0] + '***' + email.slice(email.indexOf('@'))
    : email;

  return (
    <AuthLayout
      footer={
        <>
          <Button
            title={isVerifying ? 'Verifying...' : 'Verify'}
            onPress={handleVerify}
            variant="primary"
            size="large"
            disabled={isVerifying || otp.length < 8}
            loading={isVerifying}
          />
          <Button
            title={resendTitle}
            onPress={handleResendOtp}
            variant="secondary"
            size="large"
            disabled={isResending || cooldown > 0}
          />
        </>
      }
    >
      <AuthHeader
        title="Verify your email"
        description={`Enter the 8-digit code sent to\n${maskedEmail}`}
      />
      <View style={styles.form}>
        <Input
          ref={otpInputRef}
          value={otp}
          onChangeText={handleOtpChange}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          maxLength={8}
          returnKeyType="done"
          onSubmitEditing={handleVerify}
        />
        <AppText variant="bodySmall" style={{ color: colors.text.tertiary, textAlign: 'center' }}>
          Didn&apos;t receive the code? Check your spam folder.
        </AppText>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
});
