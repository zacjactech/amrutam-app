// Auth Module - OTP Verification Screen

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface OTPVerificationScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
    reset: (state: { index: number; routes: { name: string }[] }) => void;
  };
}

export function OTPVerificationScreen({ navigation }: OTPVerificationScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <AppText variant="h1" style={{ color: colors.text.primary }}>
          Verify OTP
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm }}>
          Enter the 6-digit code sent to your phone
        </AppText>
        <View style={{ marginTop: spacing.lg }}>
          <Input
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP"
          />
        </View>
      </View>
      <View style={styles.buttons}>
        <Button
          title="Verify"
          onPress={handleVerify}
          variant="primary"
        />
        <Button
          title="Resend OTP"
          onPress={() => {}}
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
  buttons: {
    gap: 12,
  },
});
