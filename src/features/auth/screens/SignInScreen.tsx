// Auth Module - Sign In Screen

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

interface SignInScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
    goBack: () => void;
  };
}

export function SignInScreen({ navigation }: SignInScreenProps) {
  const colors = useThemeColors();
  const { signInWithPhone } = useAuthContext();
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { selectedCountry, setSelectedCountry, recentCountries } = usePersistedCountryCode();
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleSendOtp = async () => {
    Keyboard.dismiss();
    
    // Build full phone number with country code
    const fullPhone = `${selectedCountry.dialCode}${phone}`;
    const raw = toE164Phone(fullPhone);
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
        description="Enter your phone number to continue"
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
            onSubmitEditing={handleSendOtp}
          />
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
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
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
