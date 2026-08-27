// Auth Module - Sign In Screen

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface SignInScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

export function SignInScreen({ navigation }: SignInScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [phone, setPhone] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <AppText variant="h1" style={{ color: colors.text.primary }}>
          Sign In
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm }}>
          Enter your phone number to continue
        </AppText>
        <View style={{ marginTop: spacing.lg }}>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
          />
        </View>
      </View>
      <View style={styles.buttons}>
        <Button
          title="Send OTP"
          onPress={() => navigation.navigate('OTPVerification')}
          variant="primary"
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
  buttons: {
    gap: 12,
  },
});
