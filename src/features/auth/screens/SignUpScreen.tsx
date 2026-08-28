// Auth Module - Sign Up Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { CountryCodePicker } from '../../../shared/components/CountryCodePicker';
import { useThemeColors } from '../../../shared/components/ThemeProvider';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { validatePhone, formatLocalPhoneInput, toE164Phone } from '../../../shared/utils/phoneValidation';
import { usePersistedCountryCode } from '../../../shared/hooks/usePersistedCountryCode';
import { AuthLayout } from '../components/AuthLayout';
import { AuthHeader } from '../components/AuthHeader';

interface SignUpScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
  };
}

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const colors = useThemeColors();
  const { signInWithPhone } = useAuthContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { selectedCountry, setSelectedCountry, recentCountries } = usePersistedCountryCode();
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleContinue = async () => {
    Keyboard.dismiss();
    const trimmedName = name.trim();
    
    // Build full phone number with country code
    const fullPhone = `${selectedCountry.dialCode}${phone}`;
    const raw = toE164Phone(fullPhone);

    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter your full name.');
      return;
    }

    if (trimmedName.length < 2) {
      Alert.alert('Name too short', 'Please enter your full name (at least 2 characters).');
      return;
    }

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

    navigation.navigate('OTPVerification', { phone: raw, name: trimmedName });
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
        <View style={styles.phoneContainer}>
          <TouchableOpacity
            style={[
              styles.countrySelector,
              {
                borderColor: colors.border.default,
                backgroundColor: colors.surface.default,
              },
            ]}
            onPress={() => setShowCountryPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.flag}>{selectedCountry.flag}</Text>
            <Text style={[styles.dialCode, { color: colors.text.primary }]}>
              {selectedCountry.dialCode}
            </Text>
            <Text style={[styles.chevron, { color: colors.text.tertiary }]}>▼</Text>
          </TouchableOpacity>
          <View style={styles.phoneInputContainer}>
            <Input
              value={phone}
              onChangeText={(text) => setPhone(formatLocalPhoneInput(text))}
              placeholder="Phone number"
              keyboardType="phone-pad"
              maxLength={15}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </View>
        </View>
      </View>

      <CountryCodePicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={setSelectedCountry}
        selectedCountry={selectedCountry}
        recentCountries={recentCountries}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    minWidth: 100,
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 10,
    marginLeft: 6,
  },
  phoneInputContainer: {
    flex: 1,
  },
});
