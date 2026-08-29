// Auth Module - Sign In Screen (Email OTP)

import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { AuthHeader } from '../components/AuthHeader';

interface SignInScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
  };
}

export function SignInScreen({ navigation }: SignInScreenProps) {
  const { signInWithEmail } = useAuthContext();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendOtp = async () => {
    Keyboard.dismiss();

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      // Input component handles empty display; we still guard here
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      const { Alert } = require('react-native');
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    const { error } = await signInWithEmail(trimmed);
    setIsSending(false);

    if (error) {
      const { Alert } = require('react-native');
      Alert.alert('Failed to send OTP', error);
      return;
    }

    navigation.navigate('OTPVerification', { email: trimmed });
  };

  return (
    <AuthLayout
      footer={
        <>
          <Button
            title={isSending ? 'Sending OTP...' : 'Send OTP'}
            onPress={handleSendOtp}
            variant="primary"
            size="large"
            disabled={isSending}
            loading={isSending}
          />
          <Button
            title="Create Account"
            onPress={() => navigation.navigate('SignUp')}
            variant="secondary"
            size="large"
          />
        </>
      }
    >
      <AuthHeader
        title="Welcome back"
        description="Enter your email to continue"
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
        onSubmitEditing={handleSendOtp}
      />
    </AuthLayout>
  );
}
