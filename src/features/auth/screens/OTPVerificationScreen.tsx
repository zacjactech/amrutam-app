// Auth Module - OTP Verification Screen

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
  route: { params: { phone: string; name?: string } };
  navigation: {
    navigate: (screen: string) => void;
    reset: (state: { index: number; routes: { name: string }[] }) => void;
  };
}

export function OTPVerificationScreen({ route, navigation }: OTPVerificationScreenProps) {
  const colors = useThemeColors();
  const { verifyOtp, signInWithPhone, otpCooldownSeconds } = useAuthContext();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpInputRef = useRef<TextInput>(null);

  const phone = route.params.phone;
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
  }, [phone, otpCooldownSeconds]);

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
    if (!trimmedOtp || trimmedOtp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the complete OTP code.');
      return;
    }

    setIsVerifying(true);
    const { error } = await verifyOtp(phone, trimmedOtp, name);
    setIsVerifying(false);

    if (error) {
      Alert.alert('Verification failed', error);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  }, [phone, otp, name, verifyOtp, navigation]);

  const handleOtpChange = useCallback((text: string) => {
    setOtp(text);
    if (text.length === 6) {
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
    const { error } = await signInWithPhone(phone);
    setIsResending(false);

    if (error) {
      Alert.alert('Failed to resend OTP', error);
      return;
    }

    Alert.alert('OTP Sent', 'A new OTP has been sent to your phone.');
    startCooldownTimer();
  };

  const resendTitle = cooldown > 0
    ? `Resend OTP (${cooldown}s)`
    : isResending
      ? 'Sending...'
      : 'Resend OTP';

  const maskedPhone = phone.length > 6
    ? phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4)
    : phone;

  return (
    <AuthLayout
      footer={
        <>
          <Button
            title={isVerifying ? 'Verifying...' : 'Verify'}
            onPress={handleVerify}
            variant="primary"
            size="large"
            disabled={isVerifying || otp.length < 4}
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
        title="Verify your phone"
        description={`Enter the 6-digit code sent to\n${maskedPhone}`}
      />
      <View style={styles.form}>
        <Input
          ref={otpInputRef}
          value={otp}
          onChangeText={handleOtpChange}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          maxLength={6}
          returnKeyType="done"
          onSubmitEditing={handleVerify}
        />
        <AppText variant="bodySmall" style={{ color: colors.text.tertiary, textAlign: 'center' }}>
          Didn't receive the code? Check your messages.
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
