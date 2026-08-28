// Shop Module - Product Details Screen (S06)

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useProduct, useCart } from '../hooks';
import { ShopNavigation } from '../types';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { WishlistButton } from '../components/WishlistButton';
import { AppSkeleton } from '../../../shared/components/AppSkeleton';
import { AppErrorState } from '../../../shared/components/AppErrorState';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

const benefits = [
  'Supports natural immunity',
  'Holistic wellness approach',
  'Traditional Ayurvedic formulation',
];

interface ProductDetailsScreenProps {
  route: {
    params: { productId: string };
  };
  navigation: ShopNavigation;
}

export function ProductDetailsScreen({ route, navigation }: ProductDetailsScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { productId } = route.params;
  const { data: product, isLoading, isError } = useProduct(productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = useCallback(() => {
    if (product) {
      void addToCart.mutate({ productId: product.id, unitPrice: product.price });
    }
  }, [product, addToCart]);

  const handleQuantityIncrease = useCallback(() => {
    setQuantity((q) => q + 1);
  }, []);

  const handleQuantityDecrease = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <AppSkeleton width="100%" height={300} borderRadius={0} />
        <View style={{ padding: spacing.lg, gap: spacing.sm }}>
          <AppSkeleton width="80%" height={24} />
          <AppSkeleton width="40%" height={16} />
          <AppSkeleton width="60%" height={20} />
        </View>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <AppErrorState
          title="Product not found"
          message="The product you're looking for doesn't exist or has been removed."
          onRetry={navigation.goBack}
          actionLabel="Go Back"
        />
      </View>
    );
  }

  const hasDiscount = product.price > 200;
  const originalPrice = hasDiscount ? Math.round(product.price * 1.2) : null;
  const discountPercent = hasDiscount && originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            contentFit="cover"
            placeholder={{ blurhash: 'LGF5?xYk^6%M%%2e2~qoJ^Rj@AjZ' }}
          />
          <View style={[styles.imageOverlay, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl }]}>
            <TouchableOpacity onPress={navigation.goBack} hitSlop={8} style={[styles.backButton, { backgroundColor: colors.surface.default }]}>
              <AppText variant="body" style={{ color: colors.text.primary }}>←</AppText>
            </TouchableOpacity>
          </View>
          <View style={[styles.imageActions, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl }]}>
            <View style={{ flex: 1 }} />
            <WishlistButton productId={product.id} size={28} />
          </View>
          <View style={styles.paginationDots}>
            <View style={[styles.dot, { backgroundColor: colors.action.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.text.disabled }]} />
            <View style={[styles.dot, { backgroundColor: colors.text.disabled }]} />
          </View>
        </View>

        <View style={[styles.content, { padding: spacing.lg }]}>
          <AppText variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
            {product.name}
          </AppText>

          <View style={styles.ratingRow}>
            <View style={[styles.ratingBadge, { backgroundColor: colors.status.warning }]}>
              <AppText variant="bodySmall" style={{ color: '#FFFFFF', fontWeight: '600' }}>★ {product.rating.toFixed(1)}</AppText>
            </View>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
              {product.reviewCount} reviews
            </AppText>
          </View>

          <View style={[styles.priceRow, { marginTop: spacing.md }]}>
            <AppText variant="price" style={{ color: colors.action.primary, fontWeight: '700' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </AppText>
            {originalPrice && (
              <AppText variant="body" style={{ color: colors.text.tertiary, textDecorationLine: 'line-through', marginLeft: spacing.sm }}>
                ₹{originalPrice.toLocaleString('en-IN')}
              </AppText>
            )}
            {discountPercent && (
              <View style={[styles.discountBadge, { backgroundColor: colors.status.errorSoft }]}>
                <AppText variant="caption" style={{ color: colors.status.error, fontWeight: '600' }}>
                  {discountPercent}% OFF
                </AppText>
              </View>
            )}
            <View style={{ flex: 1 }} />
            <View style={[styles.quantityStepper, { borderColor: colors.border.default }]}>
              <TouchableOpacity
                style={[styles.quantityBtn, { backgroundColor: colors.background.secondary }]}
                onPress={handleQuantityDecrease}
              >
                <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600' }}>-</AppText>
              </TouchableOpacity>
              <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600', minWidth: 32, textAlign: 'center' }}>
                {quantity}
              </AppText>
              <TouchableOpacity
                style={[styles.quantityBtn, { backgroundColor: colors.background.secondary }]}
                onPress={handleQuantityIncrease}
              >
                <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600' }}>+</AppText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.section, { marginTop: spacing.xl }]}>
            <AppText variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.md }}>Key Benefits</AppText>
            {benefits.map((benefit, idx) => (
              <View key={idx} style={styles.benefitRow}>
                <AppText variant="body" style={{ color: colors.action.primary, marginRight: spacing.sm }}>🌿</AppText>
                <AppText variant="body" style={{ color: colors.text.secondary, flex: 1 }}>{benefit}</AppText>
              </View>
            ))}
          </View>

          <View style={[styles.section, { marginTop: spacing.xl, marginBottom: spacing.xxl }]}>
            <AppText variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.md }}>Description</AppText>
            <AppText variant="body" style={{ color: colors.text.secondary, lineHeight: 24 }}>
              {product.description}
            </AppText>
            <View style={styles.tagRow}>
              {product.tags.map((tag: string) => (
                <View
                  key={tag}
                  style={[styles.tag, { backgroundColor: colors.action.primarySoft, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 6 }]}
                >
                  <AppText variant="caption" style={{ color: colors.action.primary }}>{tag}</AppText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.stickyBottom, { backgroundColor: colors.surface.default, borderTopColor: colors.border.default, padding: spacing.lg }]}>
        <WishlistButton productId={product.id} size={24} />
        <Button
          title={`Add to Cart · ₹${(product.price * quantity).toLocaleString('en-IN')}`}
          variant="primary"
          size="large"
          onPress={handleAddToCart}
          disabled={product.stock <= 0}
          style={{ flex: 1 }}
        />
      </View>
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 350,
    backgroundColor: '#F0F2EF',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageActions: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {},
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {},
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {},
  stickyBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
  },
});
