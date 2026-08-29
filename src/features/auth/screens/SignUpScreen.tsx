// Auth Module - Sign Up Screen

import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { AuthHeader } from '../components/AuthHeader';
import { Checkbox } from '../../../shared/components/Checkbox';

interface SignUpScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
  };
}

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const { signUp, sendEmailOtp, signInWithGoogle } = useAuthContext();
  const colors = useThemeColors();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);

  const handleSignUp = async () => {
    Keyboard.dismiss();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedName || trimmedName.length < 2) {
      Alert.alert('Name required', 'Please enter your full name (at least 2 characters).');
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Terms required', 'Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsSending(true);

    // First create the account
    const { error: signUpError } = await signUp(trimmedEmail, trimmedPassword, trimmedName);
    if (signUpError) {
      setIsSending(false);
      Alert.alert('Sign Up Failed', signUpError);
      return;
    }

    // Then send OTP to email
    const { error: otpError } = await sendEmailOtp(trimmedEmail);
    setIsSending(false);

    if (otpError) {
      Alert.alert('OTP Failed', otpError);
      return;
    }

    navigation.navigate('EmailVerification', { email: trimmedEmail, name: trimmedName });
  };

  const handleGoogleSignUp = async () => {
    setIsSigningInWithGoogle(true);
    const { error } = await signInWithGoogle();
    setIsSigningInWithGoogle(false);

    if (error) {
      Alert.alert('Google Sign Up Failed', error);
    }
  };

  return (
    <AuthLayout
      footer={
        <>
          <Button
            title={isSending ? 'Creating Account...' : 'Create Account'}
            onPress={handleSignUp}
            variant="primary"
            size="large"
            disabled={isSending || isSigningInWithGoogle}
            loading={isSending}
          />
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border.default }]} />
            <AppText variant="bodySmall" style={{ color: colors.text.tertiary }}>or</AppText>
            <View style={[styles.dividerLine, { backgroundColor: colors.border.default }]} />
          </View>
          <Button
            title="Continue with Google"
            onPress={handleGoogleSignUp}
            variant="outline"
            size="large"
            disabled={isSending || isSigningInWithGoogle}
          />
          <View style={styles.bottomLink}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>
              Already have an account?{' '}
            </AppText>
            <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Go to sign in" accessibilityRole="button">
              <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>
                Sign In
              </AppText>
            </TouchableOpacity>
          </View>
        </>
      }
    >
      <AuthHeader
        title="Create your account"
        description="Join Amrutam and start your Ayurvedic journey"
      />
      <View style={styles.form}>
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Ananya Gupta"
          returnKeyType="next"
          textContentType="name"
          autoCapitalize="words"
        />
        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="ananya@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
        />

        <Checkbox
          checked={agreedToTerms}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
          label={
            <AppText variant="bodySmall" style={{ color: colors.text.secondary, flex: 1 }}>
              I agree to the{' '}
              <AppText variant="bodySmall" style={{ color: colors.action.primary, fontWeight: '600' }}>
                Terms of Service
              </AppText>{' '}
              and{' '}
              <AppText variant="bodySmall" style={{ color: colors.action.primary, fontWeight: '600' }}>
                Privacy Policy
              </AppText>
            </AppText>
          }
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 16,
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  bottomLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});
