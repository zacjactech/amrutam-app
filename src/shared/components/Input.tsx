// Text Input Component

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: View['props']['style'];
}

export function Input({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerStyle,
  secureTextEntry,
  ...textInputProps
}: InputProps): React.JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const containerStyles: View['props']['style'][] = [
    styles.container,
    isFocused && styles.containerFocused,
    error && styles.containerError,
    containerStyle,
  ];

  return (
    <View style={styles.wrapper}>
      {label !== undefined && <Text style={styles.label}>{label}</Text>}
      <View style={containerStyles}>
        {leftIcon !== undefined && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor="#9E9E9E"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          {...textInputProps}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={styles.iconRight}
          >
            <Text style={styles.toggleText}>{isSecure ? 'Show' : 'Hide'}</Text>
          </TouchableOpacity>
        )}
        {rightIcon !== undefined && !secureTextEntry && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>
      {error !== undefined ? (
        <Text style={styles.error}>{error}</Text>
      ) : helper !== undefined ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#17251D',
    marginBottom: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  containerFocused: {
    borderColor: '#1B5E3A',
  },
  containerError: {
    borderColor: '#D32F2F',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#17251D',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  toggleText: {
    color: '#1B5E3A',
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
  helper: {
    fontSize: 12,
    color: '#5B6B61',
    marginTop: 4,
  },
});
