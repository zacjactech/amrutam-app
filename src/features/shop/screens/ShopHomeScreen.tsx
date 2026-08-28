// Shop Module - Shop Home Screen (S01)

import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { useProducts, useCart } from '../hooks';
import { AppText } from '../../../shared/components/AppText';
import { SearchBar } from '../../../shared/components/SearchBar';
import { AppSkeleton } from '../../../shared/components/AppSkeleton';
import { AppErrorState } from '../../../shared/components/AppErrorState';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { Product } from '../types';
import { ShoppingIllustration } from '../../../shared/components/Illustrations';

import { Shield, Activities, Star, Heart, ClockCircle, Leaf, AlertTriangle, Flask } from '../../../shared/assets/icons';

const CATEGORIES = [
  { label: 'Immunity', Icon: Shield },
  { label: 'Digestion', Icon: Activities },
  { label: 'Skin Care', Icon: Star },
  { label: 'Hair Care', Icon: Heart },
  { label: 'Stress & Sleep', Icon: ClockCircle },
  { label: 'Herbal Juices', Icon: Leaf },
  { label: "Women's", Icon: AlertTriangle },
  { label: 'Oils', Icon: Flask },
] as const;

interface ShopHomeScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

export function ShopHomeScreen({ navigation }: ShopHomeScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { data, isLoading, isError, error, refetch } = useProducts();
  const { data: cartItems = [] } = useCart();

  const products = data?.data ?? [];
  const bestsellers = products.slice(0, 10);

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate('ProductDetails', { productId });
    },
    [navigation],
  );

  const handleCategoryPress = useCallback(
    (categoryLabel: string) => {
      navigation.navigate('ProductList', { category: categoryLabel });
    },
    [navigation],
  );

  const handleSearchPress = useCallback(() => {
    navigation.navigate('ProductSearch');
  }, [navigation]);

  const handleSeeAll = useCallback(() => {
    navigation.navigate('ProductList');
  }, [navigation]);

  const renderBestsellerItem = useCallback(
    ({ item }: { item: Product }) => (
      <TouchableOpacity
        style={[styles.bestsellerCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md }]}
        onPress={() => handleProductPress(item.id)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={[styles.bestsellerImage, { borderRadius: spacing.sm }]}
          contentFit="cover"
          placeholder={{ blurhash: 'LGF5?xYk^6%M%%2e2~qoJ^Rj@AjZ' }}
        />
        <View style={styles.bestsellerInfo}>
          <AppText variant="bodySmall" style={{ color: colors.text.primary }} numberOfLines={2}>
            {item.name}
          </AppText>
          <View style={styles.ratingRow}>
            <AppText variant="caption" style={{ color: colors.status.warning }}>★</AppText>
            <AppText variant="caption" style={{ color: colors.text.secondary }}>
              {item.rating.toFixed(1)} ({item.reviewCount})
            </AppText>
          </View>
          <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '700' }}>
            ₹{item.price.toLocaleString('en-IN')}
          </AppText>
        </View>
      </TouchableOpacity>
    ),
    [colors, spacing, handleProductPress],
  );

  if (isError) {
    return (
      <AppErrorState
        title="Something went wrong"
        message={error instanceof Error ? error.message : 'Failed to load products'}
        type="retryable"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md }]}>
        <AppText variant="h1">Shop</AppText>
        <View style={styles.headerIcons}>
          <TouchableOpacity hitSlop={8} onPress={() => navigation.navigate('Wishlist')}>
            <AppText variant="body" style={{ color: colors.text.primary }}>♡</AppText>
          </TouchableOpacity>
          <TouchableOpacity hitSlop={8} onPress={() => navigation.navigate('Cart')}>
            <AppText variant="body" style={{ color: colors.text.primary }}>🛒</AppText>
            {cartItems.length > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: colors.action.primary }]}>
                <AppText variant="caption" style={{ color: colors.text.inverse }}>{cartItems.length}</AppText>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleSearchPress}>
          <SearchBar
            placeholder="Search immunity, digestion, hair care..."
            style={{ backgroundColor: colors.background.secondary }}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.heroBanner, { backgroundColor: '#1B4332', marginHorizontal: spacing.lg, borderRadius: spacing.lg, padding: spacing.xl }]}>
        <View style={styles.heroContent}>
          <View style={{ flex: 1 }}>
            <AppText variant="h2" style={{ color: '#FFFFFF', marginBottom: spacing.sm }}>
              Ayurveda for Every Day
            </AppText>
            <AppText variant="body" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 22 }}>
              Authentic Ayurvedic products for everyday wellness and holistic vitality.
            </AppText>
          </View>
          <ShoppingIllustration size={120} />
        </View>
      </View>

      <View style={[styles.section, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl }]}>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>Shop by Category</AppText>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.label}
              style={[styles.categoryCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md }]}
              onPress={() => handleCategoryPress(cat.label)}
              activeOpacity={0.7}
            >
              <cat.Icon width={28} height={28} color={colors.action.primary} />
              <AppText variant="caption" style={{ color: colors.text.primary, marginTop: spacing.xs, textAlign: 'center' }}>
                {cat.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl, marginBottom: spacing.xxl }]}>
        <View style={styles.sectionHeader}>
          <AppText variant="h3">Bestsellers</AppText>
          <TouchableOpacity onPress={handleSeeAll}>
            <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>See all</AppText>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.skeletonRow}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonCard}>
                <AppSkeleton width={160} height={160} borderRadius={spacing.sm} />
                <AppSkeleton width={120} height={14} style={{ marginTop: spacing.sm }} />
                <AppSkeleton width={80} height={12} style={{ marginTop: spacing.xs }} />
              </View>
            ))}
          </View>
        ) : (
          <FlashList
            data={bestsellers}
            renderItem={renderBestsellerItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.md }}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBanner: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '22%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  bestsellerCard: {
    width: 160,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  bestsellerImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F0F2EF',
  },
  bestsellerInfo: {
    marginTop: 8,
    gap: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonCard: {},
});
