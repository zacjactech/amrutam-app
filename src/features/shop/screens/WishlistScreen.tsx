// Shop Module - Wishlist Screen

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useWishlist } from '../hooks';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState } from '../../../shared/components/AppEmptyState';
import { Image } from 'expo-image';
import { getProductCache } from '../generator';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface WishlistScreenProps {
  navigation: {
    navigate: (screen: string, params?: { productId: string }) => void;
  };
}

export function WishlistScreen({ navigation }: WishlistScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { data: wishlistProductIds = [], isLoading } = useWishlist();
  const productCache = getProductCache();
  const wishlistProducts = wishlistProductIds
    .map((id) => productCache.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <AppText variant="body" style={{ color: colors.text.secondary }}>
          Loading wishlist...
        </AppText>
      </View>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <AppEmptyState
        title="Your wishlist is empty"
        message="Save products you like for later"
        actionLabel="Browse Products"
        onAction={() => navigation.navigate('ProductList')}
      />
    );
  }

  const renderItem = ({ item }: { item: typeof wishlistProducts[0] }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.surface.default, marginHorizontal: spacing.md, marginVertical: spacing.sm, borderRadius: spacing.md, padding: spacing.md }]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.info}>
        <AppText variant="body" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
          {item.name}
        </AppText>
        <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
          {item.category}
        </AppText>
        <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>
          ₹{item.price.toLocaleString('en-IN')}
        </AppText>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <FlashList
        data={wishlistProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: spacing.xxl }]}
      />
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
  itemContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F2EF',
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
});
