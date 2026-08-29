// Auth Module - Sign In Screen

import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, Alert, TouchableOpacity } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
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
  const { signIn, signInWithGoogle } = useAuthContext();
  const colors = useThemeColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    Keyboard.dismiss();

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }

    setIsSigningIn(true);
    const { error } = await signIn(trimmed, password);
    setIsSigningIn(false);

    if (error) {
      Alert.alert('Sign In Failed', error);
      return;
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    const { error } = await signInWithGoogle();
    setIsSigningIn(false);

    if (error) {
      Alert.alert('Google Sign In Failed', error);
    }
  };

  return (
    <AuthLayout
      footer={
        <>
          <Button
            title={isSigningIn ? 'Signing In...' : 'Sign In'}
            onPress={handleSignIn}
            variant="primary"
            size="large"
            disabled={isSigningIn}
            loading={isSigningIn}
          />
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border.default }]} />
            <AppText variant="bodySmall" style={{ color: colors.text.tertiary }}>or</AppText>
            <View style={[styles.dividerLine, { backgroundColor: colors.border.default }]} />
          </View>
          <Button
            title="Continue with Google"
            onPress={handleGoogleSignIn}
            variant="outline"
            size="large"
            disabled={isSigningIn}
          />
          <View style={styles.bottomLink}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>
              New here?{' '}
            </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} accessibilityLabel="Create account" accessibilityRole="button">
              <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>
                Create account
              </AppText>
            </TouchableOpacity>
          </View>
        </>
      }
    >
      <AuthHeader
        title="Welcome back"
        description="Sign in to your ayurvedic wellness journal"
      />
      <View style={styles.form}>
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
        <View>
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />
          <TouchableOpacity style={styles.forgotPassword} accessibilityLabel="Forgot password" accessibilityRole="button">
            <AppText variant="bodySmall" style={{ color: colors.action.primary }}>
              Forgot password?
            </AppText>
          </TouchableOpacity>
        </View>
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  bottomLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});
