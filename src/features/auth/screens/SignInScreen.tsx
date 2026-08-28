// Auth Module - Sign In Screen

import React, { useState } from 'react';
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
import { validatePhone, formatPhoneInput, toE164Phone } from '../../../shared/utils/phoneValidation';

interface SignInScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
  };
}

export function SignInScreen({ navigation }: SignInScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { signInWithPhone } = useAuthContext();
  const [phone, setPhone] = useState('+91 ');
  const [isSending, setIsSending] = useState(false);

  const handleSendOtp = async () => {
    const raw = toE164Phone(phone);
    const validationError = validatePhone(raw);
    if (validationError) {
      Alert.alert('Invalid phone number', validationError);
      return;
    }

    setIsSending(true);
    const { error } = await signInWithPhone(raw);
    setIsSending(false);

    if (error) {
      Alert.alert('Failed to send OTP', error);
      return;
    }

    navigation.navigate('OTPVerification', { phone: raw });
  };

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
            Welcome back
          </AppText>
        </Animated.View>
        <Animated.View style={bodyStyle}>
          <AppText variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm, textAlign: 'center' }}>
            Enter your phone number to continue
          </AppText>
        </Animated.View>
        <View style={{ marginTop: spacing.lg }}>
          <Input
            value={phone}
            onChangeText={(text) => setPhone(formatPhoneInput(text))}
            placeholder="Phone number"
            keyboardType="phone-pad"
            maxLength={15}
          />
        </View>
      </ScrollView>
      <Animated.View style={[styles.buttons, buttonStyle]}>
        <Button
          title={isSending ? 'Sending OTP...' : 'Send OTP'}
          onPress={handleSendOtp}
          variant="primary"
          disabled={isSending}
        />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate('SignUp')}
          variant="secondary"
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
