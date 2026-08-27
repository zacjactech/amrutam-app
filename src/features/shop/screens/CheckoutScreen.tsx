// Shop Module - Checkout Summary Screen

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useCart } from '../hooks';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { getProductCache } from '../generator';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface CheckoutScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { data: cartItems = [], clearCart } = useCart();
  const productCache = getProductCache();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    void clearCart.mutate();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { padding: spacing.lg, borderBottomColor: colors.border.default }]}>
        <AppText variant="h2">Checkout Summary</AppText>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface.default, padding: spacing.lg, marginTop: spacing.md }]}>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>Order Items</AppText>
        {cartItems.map((item) => {
          const product = productCache.find((p) => p.id === item.productId);
          if (!product) return null;
          return (
            <View
              key={item.productId}
              style={[
                styles.orderItem,
                { paddingVertical: spacing.sm, borderBottomColor: colors.border.default },
              ]}
            >
              <View style={styles.orderItemInfo}>
                <AppText variant="body" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                  {product.name}
                </AppText>
                <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
                  ₹{item.unitPrice.toLocaleString('en-IN')} x {item.quantity}
                </AppText>
              </View>
              <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>
                ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
              </AppText>
            </View>
          );
        })}
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface.default, padding: spacing.lg, marginTop: spacing.md }]}>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>Payment Summary</AppText>
        <View style={[styles.summaryRow, { marginBottom: spacing.md }]}>
          <AppText variant="body" style={{ color: colors.text.secondary }}>Subtotal</AppText>
          <AppText variant="body" style={{ color: colors.text.primary }}>₹{subtotal.toLocaleString('en-IN')}</AppText>
        </View>
        <View style={[styles.summaryRow, { marginBottom: spacing.md }]}>
          <AppText variant="body" style={{ color: colors.text.secondary }}>Shipping</AppText>
          <AppText variant="body" style={{ color: colors.text.primary }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</AppText>
        </View>
        <View style={[styles.summaryRow, styles.totalRow, { marginTop: spacing.sm, paddingTop: spacing.md, borderTopColor: colors.border.default, marginBottom: spacing.lg }]}>
          <AppText variant="h3" style={{ color: colors.text.primary }}>Total</AppText>
          <AppText variant="h3" style={{ color: colors.action.primary }}>₹{total.toLocaleString('en-IN')}</AppText>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface.default, padding: spacing.lg, marginTop: spacing.md }]}>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>Shipping Address</AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, lineHeight: 22 }}>
          123, Ayurveda Enclave{'\n'}
          Koramangala, Bangalore{'\n'}
          Karnataka, India - 560034{'\n'}
          Phone: +91 98765 43210
        </AppText>
      </View>

      <View style={[styles.actions, { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md }]}>
        <Button
          title="Place Order"
          variant="primary"
          size="large"
          onPress={handlePlaceOrder}
          style={styles.placeOrderButton}
        />
        <Button
          title="Back to Cart"
          variant="ghost"
          size="medium"
          onPress={navigation.goBack}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  section: {},
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRow: {
    borderTopWidth: 1,
  },
  actions: {},
  placeOrderButton: {
    width: '100%',
  },
});
