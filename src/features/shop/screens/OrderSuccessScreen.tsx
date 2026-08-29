// Shop Module - Order Success Screen (S12)

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { SuccessCheckCircle } from '../../../shared/assets/icons';
import { Truck } from '../../../shared/assets/icons';
import { ShopNavigation } from '../types';

interface OrderSuccessScreenProps {
  navigation: ShopNavigation;
}

export function OrderSuccessScreen({ navigation }: OrderSuccessScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  const orderNumber = useMemo(() => `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`, []);

  const deliveryDate = useMemo(() => {
    const now = new Date();
    const minDays = 3;
    const maxDays = 7;
    const minDate = new Date(now.getTime() + minDays * 24 * 60 * 60 * 1000);
    const maxDate = new Date(now.getTime() + maxDays * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `${fmt(minDate)} - ${fmt(maxDate)}`;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center' }}>
          <SuccessCheckCircle width={56} height={56} color="#2D6A4F" />
        </View>

        <AppText variant="h2" style={{ color: colors.action.primary, textAlign: 'center', marginTop: spacing.xl }}>
          Order confirmed!
        </AppText>

        <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 22 }}>
          Your order {orderNumber} has been placed successfully. We'll send you updates via SMS.
        </AppText>

        <Card variant="elevated" style={{ marginTop: spacing.xl, width: '100%' }}>
          <View style={styles.deliveryRow}>              <Truck width={32} height={32} color={colors.action.primary} />
            <View style={styles.deliveryInfo}>
              <AppText variant="body" style={{ color: colors.text.secondary }}>Estimated delivery</AppText>
              <AppText variant="h4" style={{ color: colors.text.primary, fontWeight: '700', marginTop: 2 }}>
                {deliveryDate}
              </AppText>
            </View>
          </View>
        </Card>
      </View>

      <View style={[styles.actions, { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }]}>
        <Button
          title="View Order"
          variant="primary"
          size="large"
          onPress={() => navigation.goBack()}
          style={{ width: '100%' }}
        />
        <Button
          title="Continue Shopping"
          variant="outline"
          size="large"
          onPress={() => {
            navigation.navigate('ShopHome');
          }}
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
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  deliveryInfo: {
    flex: 1,
  },
  actions: {
    gap: 12,
  },
});
