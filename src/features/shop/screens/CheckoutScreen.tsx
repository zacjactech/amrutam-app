// Shop Module - Checkout Screen (S11)

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useCart } from '../hooks';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { Card } from '../../../shared/components/Card';
import { Separator } from '../../../shared/components/Separator';
import { getProductCache } from '../generator';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

type PaymentMethod = 'upi' | 'card';

interface CheckoutScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string) => void;
  };
}

export function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { data: cartItems = [], clearCart } = useCart();
  const productCache = getProductCache();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  const getProduct = useCallback(
    (productId: string) => productCache.find((p) => p.id === productId),
    [productCache],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [cartItems],
  );
  const deliveryFee = 0;
  const discount = Math.round(subtotal * 0.05);
  const total = subtotal - discount + deliveryFee;

  const handlePlaceOrder = useCallback(() => {
    void clearCart.mutate();
    navigation.navigate('OrderSuccess');
  }, [clearCart, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md, borderBottomColor: colors.border.default }]}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={navigation.goBack} hitSlop={8}>
            <AppText variant="h1">←</AppText>
          </TouchableOpacity>
          <AppText variant="h3" style={{ fontWeight: '700' }}>Checkout</AppText>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <Card variant="elevated" style={{ margin: spacing.lg, marginTop: spacing.lg }}>
          <AppText variant="h4" style={{ marginBottom: spacing.md }}>Order Items</AppText>
          {cartItems.map((item) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            return (
              <View key={item.productId} style={[styles.orderItem, { borderBottomColor: colors.border.default, paddingVertical: spacing.sm }]}>
                <View style={styles.orderItemInfo}>
                  <AppText variant="body" style={{ color: colors.text.primary }} numberOfLines={1}>
                    {product.name}
                  </AppText>
                  <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
                    x{item.quantity}
                  </AppText>
                </View>
                <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>
                  ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                </AppText>
              </View>
            );
          })}
        </Card>

        <Card variant="elevated" style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }}>
          <View style={styles.addressHeader}>
            <AppText variant="h4">Delivery Address</AppText>
            <TouchableOpacity>
              <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>[Change]</AppText>
            </TouchableOpacity>
          </View>
          <AppText variant="body" style={{ color: colors.text.secondary, lineHeight: 22 }}>
            Priya Sharma{'\n'}
            42, MG Road, Indiranagar{'\n'}
            Bangalore, Karnataka - 560038{'\n'}
            Phone: +91 98765 43210
          </AppText>
        </Card>

        <Card variant="elevated" style={{ marginHorizontal: spacing.lg, marginBottom: spacing.md }}>
          <AppText variant="h4" style={{ marginBottom: spacing.md }}>Price Details</AppText>
          <View style={styles.summaryRow}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>Subtotal</AppText>
            <AppText variant="body" style={{ color: colors.text.primary }}>₹{subtotal.toLocaleString('en-IN')}</AppText>
          </View>
          <View style={[styles.summaryRow, { marginTop: spacing.sm }]}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>Delivery Fee</AppText>
            <AppText variant="body" style={{ color: colors.status.success, fontWeight: '600' }}>FREE</AppText>
          </View>
          <View style={[styles.summaryRow, { marginTop: spacing.sm }]}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>Discount</AppText>
            <AppText variant="body" style={{ color: colors.status.error }}>-₹{discount.toLocaleString('en-IN')}</AppText>
          </View>
          <Separator />
          <View style={styles.summaryRow}>
            <AppText variant="h4" style={{ color: colors.text.primary }}>Total Amount</AppText>
            <AppText variant="h4" style={{ color: colors.action.primary, fontWeight: '700' }}>
              ₹{total.toLocaleString('en-IN')}
            </AppText>
          </View>
        </Card>

        <Card variant="elevated" style={{ marginHorizontal: spacing.lg, marginBottom: spacing.lg }}>
          <AppText variant="h4" style={{ marginBottom: spacing.md }}>Select Payment Method</AppText>
          <TouchableOpacity
            style={[styles.paymentOption, { borderColor: paymentMethod === 'upi' ? colors.action.primary : colors.border.default, backgroundColor: paymentMethod === 'upi' ? colors.action.primarySoft : 'transparent' }]}
            onPress={() => setPaymentMethod('upi')}
          >
            <View style={[styles.radio, { borderColor: paymentMethod === 'upi' ? colors.action.primary : colors.text.disabled }]}>
              {paymentMethod === 'upi' && <View style={[styles.radioInner, { backgroundColor: colors.action.primary }]} />}
            </View>
            <AppText variant="body" style={{ color: colors.text.primary }}>UPI (Google Pay, PhonePe, etc.)</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentOption, { borderColor: paymentMethod === 'card' ? colors.action.primary : colors.border.default, backgroundColor: paymentMethod === 'card' ? colors.action.primarySoft : 'transparent' }]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={[styles.radio, { borderColor: paymentMethod === 'card' ? colors.action.primary : colors.text.disabled }]}>
              {paymentMethod === 'card' && <View style={[styles.radioInner, { backgroundColor: colors.action.primary }]} />}
            </View>
            <AppText variant="body" style={{ color: colors.text.primary }}>Credit / Debit Card</AppText>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <View style={[styles.stickyBottom, { backgroundColor: colors.surface.default, borderTopColor: colors.border.default, padding: spacing.lg }]}>
        <View style={styles.bottomSummary}>
          <AppText variant="body" style={{ color: colors.text.secondary }}>Total</AppText>
          <AppText variant="h3" style={{ color: colors.action.primary, fontWeight: '700' }}>
            ₹{total.toLocaleString('en-IN')}
          </AppText>
        </View>
        <Button
          title={`Place Order · ₹${total.toLocaleString('en-IN')}`}
          variant="primary"
          size="large"
          onPress={handlePlaceOrder}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  orderItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    gap: 12,
  },
  bottomSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
