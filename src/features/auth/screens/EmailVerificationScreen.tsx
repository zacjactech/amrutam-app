// Auth Module - Email Verification Screen

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Alert, TextInput, TouchableOpacity, Keyboard, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { AuthHeader } from '../components/AuthHeader';

interface EmailVerificationScreenProps {
  route: { params: { email: string; name?: string } };
  navigation: {
    navigate: (screen: string) => void;
    reset: (state: { index: number; routes: { name: string }[] }) => void;
  };
}

export function EmailVerificationScreen({ route, navigation }: EmailVerificationScreenProps) {
  const colors = useThemeColors();
  const { verifyEmailOtp, sendEmailOtp, otpCooldownSeconds } = useAuthContext();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const { email, name } = route.params;

  useEffect(() => {
    // Focus first input
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
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

  const handleOtpChange = useCallback((text: string, index: number) => {
    const newOtp = [...otp];
    if (text.length > 1) {
      // Pasted entire code
      const chars = text.slice(0, 6).split('');
      chars.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(index + chars.length, 5);
      inputRefs.current[focusIndex]?.focus();
      if (focusIndex === 5) Keyboard.dismiss();
    } else {
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      if (index === 5 && text) {
        Keyboard.dismiss();
      }
    }
  }, [otp]);

  const handleKeyPress = useCallback((e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  }, [otp]);

  const handleVerify = useCallback(async () => {
    Keyboard.dismiss();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      Alert.alert('Invalid Code', 'Please enter the complete 6-digit code.');
      return;
    }

    setIsVerifying(true);
    const { error } = await verifyEmailOtp(email, fullOtp, name);
    setIsVerifying(false);

    if (error) {
      Alert.alert('Verification failed', error);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  }, [otp, email, name, verifyEmailOtp, navigation]);

  const handleResendOtp = async () => {
    if (cooldown > 0) {
      Alert.alert('Please wait', `You can request another code in ${cooldown} second${cooldown === 1 ? '' : 's'}.`);
      return;
    }

    const { error } = await sendEmailOtp(email);
    if (error) {
      Alert.alert('Failed to resend', error);
      return;
    }

    Alert.alert('Code Sent', `A new verification code has been sent to ${email}.`);
    startCooldownTimer();
  };

  // Mask email for display: ananya@email.com -> a***@email.com
  const maskedEmail = email.replace(/(.{1})(.*)(@.*)/, '$1***$3');

  return (
    <AuthLayout
      footer={
        <>
          <Button
            title={isVerifying ? 'Verifying...' : 'Verify'}
            onPress={handleVerify}
            variant="primary"
            size="large"
            disabled={isVerifying || otp.join('').length < 6}
            loading={isVerifying}
          />
        </>
      }
    >
      <AuthHeader
        title="Verify your email"
        description={`Enter the 6-digit code sent to\n${maskedEmail}`}
      />
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
              styles.otpBox,
              { 
                borderColor: digit ? colors.action.primary : colors.border.default,
                color: colors.text.primary,
                backgroundColor: colors.surface.default,
              }
            ]}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={index === 0 ? 6 : 1}
            selectTextOnFocus
          />
        ))}
      </View>
      
      <View style={styles.resendContainer}>
        {cooldown > 0 ? (
          <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
            Resend code in {cooldown}s
          </AppText>
        ) : (
          <TouchableOpacity onPress={handleResendOtp}>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
              Didn&apos;t receive code? <AppText variant="bodySmall" style={{ color: colors.action.primary, fontWeight: '600' }}>Resend</AppText>
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    marginBottom: 16,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
});
