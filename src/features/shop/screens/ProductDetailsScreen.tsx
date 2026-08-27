// Shop Module - Product Details Screen

import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useProduct, useCart, useWishlist } from '../hooks';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { WishlistButton } from '../components/WishlistButton';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface ProductDetailsScreenProps {
  route: {
    params: { productId: string };
  };
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: { productId?: string }) => void;
  };
}

export function ProductDetailsScreen({ route, navigation }: ProductDetailsScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { productId } = route.params;
  const { data: product, isLoading, isError } = useProduct(productId);
  const { addToCart } = useCart();
  const { isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    if (product) {
      void addToCart.mutate({ productId: product.id, unitPrice: product.price });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
          Product not found
        </AppText>
        <Button title="Go Back" variant="primary" size="medium" onPress={navigation.goBack} />
      </View>
    );
  }

  const inWishlist = isInWishlist(product.id);
  void inWishlist;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        contentFit="cover"
        placeholder={{ blurhash: 'LGF5?xYk^6%M%%2e2~qoJ^Rj@AjZ' }}
      />
      <View style={[styles.content, { padding: spacing.lg }]}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <AppText variant="h2" style={{ marginBottom: spacing.xs }}>
              {product.name}
            </AppText>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
              {product.category}
            </AppText>
          </View>
          <WishlistButton productId={product.id} size={28} />
        </View>

        <View style={[styles.ratingRow, { marginBottom: spacing.md }]}>
          <AppText variant="body" style={{ color: colors.action.secondary }}>
            ★ {product.rating.toFixed(1)}
          </AppText>
          <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
            ({product.reviewCount} reviews)
          </AppText>
          <AppText variant="bodySmall" style={{ color: colors.action.primary }}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </AppText>
        </View>

        <AppText variant="h2" style={{ color: colors.action.primary, marginBottom: spacing.xxl }}>
          ₹{product.price.toLocaleString('en-IN')}
        </AppText>

        <AppText variant="h3" style={{ marginBottom: spacing.sm, marginTop: spacing.md }}>
          Description
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg }}>
          {product.description}
        </AppText>

        <AppText variant="h3" style={{ marginBottom: spacing.sm, marginTop: spacing.md }}>
          Tags
        </AppText>
        <View style={styles.tagRow}>
          {product.tags.map((tag: string) => (
            <View
              key={tag}
              style={[
                styles.tag,
                {
                  backgroundColor: colors.action.primarySoft,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: 6,
                },
              ]}
            >
              <AppText variant="caption" style={{ color: colors.action.primary }}>
                {tag}
              </AppText>
            </View>
          ))}
        </View>

        <View style={{ marginTop: spacing.xxl }}>
          <Button
            title={product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            variant="primary"
            size="large"
            onPress={handleAddToCart}
            disabled={product.stock <= 0}
            style={styles.addToCartButton}
          />
        </View>
      </View>
    </ScrollView>
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
    padding: 32,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0F2EF',
  },
  content: {},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {},
  addToCartButton: {
    width: '100%',
  },
});
