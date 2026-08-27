// Auth Module - Sign Up Screen

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { DoctorIllustration } from '../../../shared/components/Illustrations';

interface SignUpScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.illustrationWrapper}>
          <DoctorIllustration size={120} />
        </View>
        <AppText variant="h1" style={{ color: colors.text.primary, textAlign: 'center' }}>
          Create your account
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm, textAlign: 'center' }}>
          Fill in your details to get started
        </AppText>
        <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Full name"
          />
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
          />
        </View>
      </ScrollView>
      <View style={styles.buttons}>
        <Button
          title="Continue"
          onPress={() => navigation.navigate('OTPVerification')}
          variant="primary"
        />
        <Button
          title="Already have an account? Sign In"
          onPress={() => navigation.goBack()}
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
  },
  illustrationWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  buttons: {
    gap: 12,
  },
});
