// Shop Module - Cart Screen (S08)

import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useCart, useProductCache } from '../hooks';
import { CartItemComponent } from '../components/CartItem';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppSkeleton } from '../../../shared/components/AppSkeleton';
import { AppErrorState } from '../../../shared/components';
import { CartItem, Product, ShopNavigation } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { ShoppingBag, ArrowLeft } from '../../../shared/assets/icons';

interface CartScreenProps {
  navigation: ShopNavigation;
}

export function CartScreen({ navigation }: CartScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { data: cartItems = [], isLoading, isError, refetch, updateCartQuantity, removeFromCart } = useCart();
  const productCache = useProductCache();

  const getProduct = useCallback(
    (productId: string): Product | undefined => productCache.find((p) => p.id === productId),
    [productCache],
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [cartItems],
  );
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

  const frequentlyBought = useMemo(() => {
    return productCache.slice(20, 22);
  }, [productCache]);

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => {
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
    },
    [getProduct, updateCartQuantity, removeFromCart],
  );

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate('ProductDetails', { productId });
    },
    [navigation],
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <View style={{ padding: spacing.lg, gap: spacing.md, width: '100%' }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
              <AppSkeleton width={80} height={80} borderRadius={8} />
              <View style={{ flex: 1, gap: spacing.xs }}>
                <AppSkeleton width="80%" height={16} />
                <AppSkeleton width="40%" height={12} />
                <AppSkeleton width="30%" height={14} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <AppErrorState
          title="Failed to load cart"
          message="Could not load your cart items."
          type="retryable"
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.action.primarySoft, justifyContent: 'center', alignItems: 'center' }}>
            <ShoppingBag width={56} height={56} color={colors.action.primary} />
          </View>
          <AppText variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, marginTop: spacing.lg }}>
            Your cart is empty
          </AppText>
          <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, textAlign: 'center' }}>
            Looks like you haven't added anything to your cart yet.
          </AppText>
          <Button
            title="Start Shopping"
            variant="primary"
            size="large"
            onPress={() => navigation.goBack()}
          />
        </View>
      ) : (
        <>
          <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md }]}>
            <View style={styles.titleRow}>
              <TouchableOpacity onPress={navigation.goBack} hitSlop={8} accessibilityLabel="Go back" accessibilityRole="button">
                <ArrowLeft width={20} height={20} color={colors.text.primary} />
              </TouchableOpacity>
              <AppText variant="h1">Cart ({cartItems.length})</AppText>
              <View style={{ width: 24 }} />
            </View>
          </View>

          <FlashList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.productId}
            contentContainerStyle={[styles.listContent, { paddingBottom: spacing.xxl }]}
            ListFooterComponent={
              frequentlyBought.length > 0 ? (
                <View style={[styles.frequentlyBought, { paddingHorizontal: spacing.lg, marginTop: spacing.lg }]}>
                  <AppText variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                    Frequently bought together
                  </AppText>
                  <View style={styles.frequentlyGrid}>
                    {frequentlyBought.map((product) => (
                      <View key={product.id} style={styles.frequentlyCard}>
                        <ProductCard product={product} onPress={handleProductPress} />
                      </View>
                    ))}
                  </View>
                </View>
              ) : null
            }
          />

          <View style={[styles.stickyBottom, { backgroundColor: colors.surface.default, borderTopColor: colors.border.default, padding: spacing.lg }]}>
            <View style={styles.summaryRow}>
              <AppText variant="body" style={{ color: colors.text.secondary }}>Subtotal</AppText>
              <AppText variant="h3" style={{ color: colors.action.primary, fontWeight: '700' }}>
                ₹{total.toLocaleString('en-IN')}
              </AppText>
            </View>
            <Button
              title="Checkout"
              variant="primary"
              size="large"
              onPress={() => navigation.navigate('Checkout')}
              style={{ width: '100%' }}
            />
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {},
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContent: {},
  stickyBottom: {
    borderTopWidth: 1,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequentlyBought: {},
  frequentlyGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  frequentlyCard: {
    flex: 1,
  },
});
