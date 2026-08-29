// Auth Module - Sign Up Screen (Email OTP)

import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, Alert } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { AuthHeader } from '../components/AuthHeader';

interface SignUpScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
  };
}

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const { signInWithEmail } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleContinue = async () => {
    Keyboard.dismiss();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter your full name.');
      return;
    }

    if (trimmedName.length < 2) {
      Alert.alert('Name too short', 'Please enter your full name (at least 2 characters).');
      return;
    }

    if (!trimmedEmail) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    const { error } = await signInWithEmail(trimmedEmail);
    setIsSending(false);

    if (error) {
      Alert.alert('Failed to send OTP', error);
      return;
    }

    navigation.navigate('OTPVerification', { email: trimmedEmail, name: trimmedName });
  };

  return (
    <AuthLayout
      footer={
        <>
          <Button
            title={isSending ? 'Sending OTP...' : 'Continue'}
            onPress={handleContinue}
            variant="primary"
            size="large"
            disabled={isSending}
            loading={isSending}
          />
          <Button
            title="Already have an account? Sign In"
            onPress={() => navigation.goBack()}
            variant="secondary"
            size="large"
          />
        </>
      }
    >
      <AuthHeader
        title="Create your account"
        description="Fill in your details to get started"
      />
      <View style={styles.form}>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          returnKeyType="next"
          textContentType="name"
          autoCapitalize="words"
        />
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="done"
          onSubmitEditing={handleContinue}
        />
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
