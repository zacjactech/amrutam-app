// Shop Module - Product List Screen

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteProducts } from '../hooks';
import { ProductCard } from '../components/ProductCard';
import { ProductFilter, DEFAULT_PRODUCT_FILTER, SortOption, Product } from '../types';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { ProductFilterSheet } from '../components/ProductFilterSheet';
import { SortSheet } from '../components/SortSheet';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface ProductListScreenProps {
  route: { params?: undefined };
  navigation: {
    navigate: (screen: string, params?: { productId: string }) => void;
  };
}

export function ProductListScreen({ navigation }: ProductListScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [filter, setFilter] = useState<ProductFilter>(DEFAULT_PRODUCT_FILTER);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts(filter, sortBy);

  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];
  const totalProducts = data?.pages[0]?.total ?? 0;

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={(productId) => navigation.navigate('ProductDetails', { productId })} />
    ),
    [navigation],
  );

  const renderHeader = useCallback(
    () => (
      <View style={[styles.header, { padding: spacing.lg, paddingBottom: spacing.sm }]}>
        <AppText variant="h2" style={{ marginBottom: spacing.xs }}>
          Shop
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
          {totalProducts !== undefined ? `${totalProducts.toLocaleString()} products` : 'Loading...'}
        </AppText>
        <View style={styles.controls}>
          <Button
            title="Filters"
            variant="outline"
            size="small"
            onPress={() => setShowFilter(true)}
            style={styles.controlButton}
          />
          <Button
            title={`Sort: ${sortBy.replace('-', ' ')}`}
            variant="outline"
            size="small"
            onPress={() => setShowSort(true)}
            style={styles.controlButton}
          />
        </View>
      </View>
    ),
    [totalProducts, sortBy, colors.text.secondary, spacing],
  );

  const renderEmpty = useCallback(
    () => (
      <AppEmptyState
        title="No products found"
        message="Try adjusting your filters"
        actionLabel="Clear Filters"
        onAction={() => setFilter(DEFAULT_PRODUCT_FILTER)}
      />
    ),
    [],
  );

  const renderFooter = useCallback(
    () => {
      if (!isFetchingNextPage) return null;
      return (
        <View style={[styles.footerLoader, { padding: spacing.md, gap: spacing.sm }]}>
          <ActivityIndicator size="small" color={colors.action.primary} />
          <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
            Loading more...
          </AppText>
        </View>
      );
    },
    [isFetchingNextPage, colors.action.primary, colors.text.secondary, spacing],
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
        <AppText variant="body" style={{ marginTop: spacing.md, color: colors.text.secondary }}>
          Loading products...
        </AppText>
      </View>
    );
  }

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
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <FlashList
        data={allProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={[styles.listContent, { paddingBottom: spacing.xxl }]}
      />
      {showFilter && (
        <View style={[styles.sheetOverlay, { backgroundColor: colors.background.primary }]}>
          <ProductFilterSheet
            filter={filter}
            onFilterChange={setFilter}
            onClose={() => setShowFilter(false)}
          />
        </View>
      )}
      {showSort && (
        <View style={[styles.sheetOverlay, { backgroundColor: colors.background.primary }]}>
          <SortSheet
            currentSort={sortBy}
            onSortChange={setSortBy}
            onClose={() => setShowSort(false)}
          />
        </View>
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
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
  },
  listContent: {},
  emptyContainer: {},
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});
