// Shop Module - Order Failed Screen (S13)

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { AlertCircle } from '../../../shared/assets/icons';

interface OrderFailedScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

export function OrderFailedScreen({ navigation }: OrderFailedScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' }}>
          <AlertCircle width={56} height={56} color="#DC2626" />
        </View>

        <AppText variant="h2" style={{ textAlign: 'center', marginTop: spacing.xl, color: colors.text.primary }}>
          Couldn't place order
        </AppText>

        <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 }}>
          Your payment wasn't processed. No amount was deducted.
        </AppText>

        <AppText variant="bodySmall" style={{ color: colors.text.tertiary, textAlign: 'center', marginTop: spacing.md }}>
          This can happen due to network issues or payment gateway timeout. Please try again.
        </AppText>
      </View>

      <View style={[styles.actions, { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }]}>
        <Button
          title="Try Again"
          variant="primary"
          size="large"
          onPress={navigation.goBack}
          style={{ width: '100%' }}
        />
        <Button
          title="Back to Cart"
          variant="outline"
          size="large"
          onPress={() => navigation.navigate('Cart')}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  actions: {
    gap: 12,
  },
});
