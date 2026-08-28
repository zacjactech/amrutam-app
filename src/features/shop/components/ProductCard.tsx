// Shop Module - Product Card Component

import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '../../../shared/components/AppText';
import { Product } from '../types';
import { useWishlist } from '../hooks';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface ProductCardProps {
  product: Product;
  onPress: (productId: string) => void;
}

export const ProductCard = memo(function ProductCard({ product, onPress }: ProductCardProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistPress = (e: import('react-native').GestureResponderEvent) => {
    e.stopPropagation();
    void toggleWishlist.mutate({ productId: product.id, isAdded: inWishlist });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md, marginHorizontal: spacing.md, marginVertical: spacing.sm }]}
      onPress={() => onPress(product.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        contentFit="cover"
        placeholder={{ blurhash: 'LGF5?xYk^6%M%%2e2~qoJ^Rj@AjZ' }}
        transition={300}
      />
      <View style={styles.info}>
        <AppText variant="body" style={{ color: colors.text.primary, marginBottom: spacing.xs }} numberOfLines={2}>
          {product.name}
        </AppText>
        <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginBottom: spacing.sm }} numberOfLines={1}>
          {product.category}
        </AppText>
        <View style={styles.ratingRow}>
          <AppText variant="bodySmall" style={{ color: colors.action.secondary, fontWeight: '500' }}>
            ★ {product.rating.toFixed(1)}
          </AppText>
          <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
            ({product.reviewCount})
          </AppText>
        </View>
        <View style={styles.footer}>
          <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '700' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </AppText>
          <TouchableOpacity
            onPress={handleWishlistPress}
            style={styles.wishlistButton}
            hitSlop={8}
          >
            <AppText variant="body" style={{ color: inWishlist ? colors.status.error : colors.text.disabled }}>
              {inWishlist ? '♥' : '♡'}
            </AppText>
          </TouchableOpacity>
        </View>
        {product.stock <= 0 && (
          <AppText variant="caption" style={{ color: colors.status.error, fontWeight: '500', marginTop: spacing.xs }}>
            Out of Stock
          </AppText>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#F0F2EF',
    marginBottom: 10,
  },
  info: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wishlistButton: {
    padding: 4,
  },
});
