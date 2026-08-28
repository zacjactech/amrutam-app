// Auth Module - OTP Verification Screen

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { useIconEntrance, useTextEntrance, useButtonEntrance } from '../../../shared/hooks/useEntranceAnimation';
import Leaf from '../../../../assets/icons/leaf.svg';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';

interface OTPVerificationScreenProps {
  route?: { params?: { phone?: string; name?: string } };
  navigation?: {
    navigate: (screen: string) => void;
    reset: (state: { index: number; routes: { name: string }[] }) => void;
  };
}

export function OTPVerificationScreen({ route, navigation }: OTPVerificationScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { verifyOtp, signInWithPhone, otpCooldownSeconds } = useAuthContext();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phone = route?.params?.phone ?? '';
  const name = route?.params?.name;

  const startCooldownTimer = useCallback(() => {
    // Clear any existing timer
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

  // Start cooldown timer on mount
  useEffect(() => {
    startCooldownTimer();
    return () => {
      if (cooldownRef.current) {
        clearInterval(cooldownRef.current);
      }
    };
  }, [startCooldownTimer]);

  const handleVerify = async () => {
    if (!phone) {
      Alert.alert('Error', 'Phone number not found. Please go back and try again.');
      return;
    }

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

    // Auth state change will be handled by AuthContext listener
    navigation?.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const handleResendOtp = async () => {
    if (!phone) {
      Alert.alert('Error', 'Phone number not found. Please go back and try again.');
      return;
    }

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

  const iconStyle = useIconEntrance({ delay: 100, duration: 500 });
  const titleStyle = useTextEntrance({ delay: 300, duration: 450 });
  const bodyStyle = useTextEntrance({ delay: 400, duration: 450 });
  const buttonStyle = useButtonEntrance({ delay: 500, duration: 400 });

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <Animated.View style={[styles.iconCircle, iconStyle]}>
          <Leaf width={56} height={56} color="#2D6A4F" />
        </Animated.View>
        <Animated.View style={titleStyle}>
          <AppText variant="h1" style={{ color: colors.text.primary, textAlign: 'center' }}>
            Verify your phone
          </AppText>
        </Animated.View>
        <Animated.View style={bodyStyle}>
          <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm, textAlign: 'center' }}>
            Enter the 6-digit code sent to{'\n'}{phone || 'your phone'}
          </AppText>
        </Animated.View>
        <View style={{ marginTop: spacing.lg }}>
          <Input
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>
      </ScrollView>
      <Animated.View style={[styles.buttons, buttonStyle]}>
        <Button
          title={isVerifying ? 'Verifying...' : 'Verify'}
          onPress={handleVerify}
          variant="primary"
          disabled={isVerifying}
        />
        <Button
          title={resendTitle}
          onPress={handleResendOtp}
          variant="secondary"
          disabled={isResending || cooldown > 0}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttons: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    paddingTop: 12,
    gap: 12,
  },
});
