// Shop Module - Wishlist Screen (S07)

import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useWishlist, useCart, useProductCache } from '../hooks';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { AppSkeleton } from '../../../shared/components/AppSkeleton';
import { Product, ShopNavigation } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { ShoppingBag, ArrowLeft } from '../../../shared/assets/icons';
import { lightTheme } from '../../../shared/design-system/theme';

interface WishlistScreenProps {
  navigation: ShopNavigation;
}

export function WishlistScreen({ navigation }: WishlistScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { data: wishlistProductIds = [], isLoading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const productCache = useProductCache();

  const wishlistProducts = wishlistProductIds
    .map((id) => productCache.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  const handleMoveAllToCart = useCallback(() => {
    for (const product of wishlistProducts) {
      void addToCart.mutate({ productId: product.id, unitPrice: product.price });
      void toggleWishlist.mutate({ productId: product.id, isAdded: true });
    }
  }, [wishlistProducts, addToCart, toggleWishlist]);

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate('ProductDetails', { productId });
    },
    [navigation],
  );

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <TouchableOpacity
        style={[styles.productCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md }]}
        onPress={() => handleProductPress(item.id)}
        activeOpacity={0.7}
        accessibilityLabel={`View ${item.name}`}
        accessibilityRole="button"
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={[styles.productImage, { borderRadius: spacing.sm, backgroundColor: colors.background.secondary }]}
            contentFit="cover"
            placeholder={{ blurhash: 'LGF5?xYk^6%M%%2e2~qoJ^Rj@AjZ' }}
          />
          <TouchableOpacity
            style={[styles.heartIcon, { backgroundColor: colors.status.errorSoft }]}
            hitSlop={8}
            onPress={() => void toggleWishlist.mutate({ productId: item.id, isAdded: true })}
            accessibilityLabel={`Remove ${item.name} from wishlist`}
            accessibilityRole="button"
          >
            <AppText variant="body" style={{ color: colors.status.error }}>♥</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <AppText variant="bodySmall" style={{ color: colors.text.primary }} numberOfLines={2}>
            {item.name}
          </AppText>
          <View style={styles.ratingRow}>
            <AppText variant="caption" style={{ color: colors.status.warning }}>★</AppText>
            <AppText variant="caption" style={{ color: colors.text.secondary }}>
              {item.rating.toFixed(1)}
            </AppText>
          </View>
          <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '700' }}>
            ₹{item.price.toLocaleString('en-IN')}
          </AppText>
        </View>
      </TouchableOpacity>
    ),
    [colors, spacing, handleProductPress, toggleWishlist],
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          <AppSkeleton width="100%" height={24} />
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <AppSkeleton width="48%" height={250} borderRadius={spacing.md} />
            <AppSkeleton width="48%" height={250} borderRadius={spacing.md} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md }]}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={navigation.goBack} hitSlop={8} accessibilityLabel="Go back" accessibilityRole="button">
            <ArrowLeft width={20} height={20} color={colors.text.primary} />
          </TouchableOpacity>
          <AppText variant="h1">Wishlist ({wishlistProducts.length})</AppText>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {wishlistProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.action.primarySoft, justifyContent: 'center', alignItems: 'center' }}>
            <ShoppingBag width={56} height={56} color={colors.action.primary} />
          </View>
          <AppText variant="h3" style={{ color: colors.text.primary, marginTop: spacing.lg, marginBottom: spacing.sm }}>
            Your wishlist is empty
          </AppText>
          <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, textAlign: 'center' }}>
            Save products you like for later
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
          <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
            <Button
              title="Move all to cart"
              variant="outline"
              size="medium"
              onPress={handleMoveAllToCart}
              style={{ width: '100%' }}
            />
          </View>
          <FlashList
            data={wishlistProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{ paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg }}
          />
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
  header: {},
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  productCard: {
    flex: 1,
    marginBottom: 12,
    ...lightTheme.shadows.sm,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
  },
  heartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: 10,
    gap: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
