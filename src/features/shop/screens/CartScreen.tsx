// Shop Module - Cart Screen

import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useCart } from '../hooks';
import { CartItemComponent } from '../components/CartItem';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState } from '../../../shared/components/AppEmptyState';
import { getProductCache } from '../generator';
import { CartItem } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface CartScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

export function CartScreen({ navigation }: CartScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { data: cartItems = [], isLoading, updateCartQuantity, removeFromCart, clearCart } = useCart();
  const productCache = getProductCache();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  const getProduct = (productId: string) => productCache.find((p) => p.id === productId);

  const renderItem = ({ item }: { item: CartItem }) => {
    const product = getProduct(item.productId);
    if (!product) return null;
    return (
      <CartItemComponent
        cartItem={item}
        product={product}
        onUpdateQuantity={(productId, quantity) => {
          void updateCartQuantity.mutate({ productId, quantity });
        }}
        onRemove={(productId) => {
          void removeFromCart.mutate(productId);
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <AppText variant="body" style={{ color: colors.text.secondary }}>
          Loading cart...
        </AppText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {cartItems.length === 0 ? (
        <AppEmptyState
          title="Your cart is empty"
          message="Browse products and add them to your cart"
          actionLabel="Start Shopping"
          onAction={() => navigation.goBack()}
        />
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.productId}
            contentContainerStyle={[styles.listContent, { paddingBottom: spacing.xxl }]}
          />
          <View
            style={[
              styles.summary,
              {
                backgroundColor: colors.surface.default,
                borderTopColor: colors.border.default,
                padding: spacing.lg,
                paddingBottom: spacing.xxl,
              },
            ]}
          >
            <View style={[styles.summaryRow, { marginBottom: spacing.md }]}>
              <AppText variant="body" style={{ color: colors.text.secondary }}>
                Subtotal
              </AppText>
              <AppText variant="body" style={{ color: colors.text.primary }}>
                ₹{subtotal.toLocaleString('en-IN')}
              </AppText>
            </View>
            <View style={[styles.summaryRow, { marginBottom: spacing.md }]}>
              <AppText variant="body" style={{ color: colors.text.secondary }}>
                Shipping
              </AppText>
              <AppText variant="body" style={{ color: colors.text.primary }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </AppText>
            </View>
            <View
              style={[
                styles.summaryRow,
                styles.totalRow,
                {
                  marginTop: spacing.sm,
                  paddingTop: spacing.md,
                  borderTopColor: colors.border.default,
                  marginBottom: spacing.lg,
                },
              ]}
            >
              <AppText variant="h3" style={{ color: colors.text.primary }}>
                Total
              </AppText>
              <AppText variant="h3" style={{ color: colors.action.primary }}>
                ₹{total.toLocaleString('en-IN')}
              </AppText>
            </View>
            <View style={{ gap: spacing.md }}>
              <Button
                title="Proceed to Checkout"
                variant="primary"
                size="large"
                onPress={() => navigation.navigate('Checkout')}
                style={styles.checkoutButton}
              />
              <Button
                title="Clear Cart"
                variant="ghost"
                size="medium"
                onPress={() => clearCart.mutate()}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {},
  summary: {
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRow: {
    borderTopWidth: 1,
  },
  checkoutButton: {
    width: '100%',
  },
});
