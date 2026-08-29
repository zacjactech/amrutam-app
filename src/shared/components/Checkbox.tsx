// Checkbox Component

import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useThemeColors } from './ThemeProvider';
import { IconCheckContainer } from '../assets/icons';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: React.ReactNode;
}

export function Checkbox({ checked, onPress, label }: CheckboxProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={typeof label === 'string' ? label : undefined}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? colors.action.primary : colors.border.default,
            backgroundColor: checked ? colors.action.primary : colors.surface.default,
          },
        ]}
      >
        {checked && <IconCheckContainer color={colors.text.inverse} width={12} height={12} />}
      </View>
      {label !== undefined && <View style={styles.labelContainer}>{label}</View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 1,
    marginLeft: 12,
  },
});
