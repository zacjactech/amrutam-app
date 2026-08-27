// Shop Module - Product List Screen (S02)

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteProducts } from '../hooks';
import { ProductCard } from '../components/ProductCard';
import { ProductFilterSheet } from '../components/ProductFilterSheet';
import { SortSheet } from '../components/SortSheet';
import { ProductFilter, DEFAULT_PRODUCT_FILTER, SortOption, Product } from '../types';
import { AppText } from '../../../shared/components/AppText';
import { SearchBar } from '../../../shared/components/SearchBar';
import { Chip } from '../../../shared/components/Chip';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

const SORT_LABELS: Record<SortOption, string> = {
  popularity: 'Recommended',
  'price-asc': 'Price Low-High',
  'price-desc': 'Price High-Low',
  rating: 'Highest Rated',
  newest: 'Newest',
};

interface ProductListScreenProps {
  route?: { params?: { category?: string } };
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: { productId: string }) => void;
  };
}

export function ProductListScreen({ route, navigation }: ProductListScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const categoryParam = route?.params?.category;

  const initialFilter: ProductFilter = categoryParam
    ? { ...DEFAULT_PRODUCT_FILTER, categories: [categoryParam as ProductFilter['categories'][number]] }
    : DEFAULT_PRODUCT_FILTER;

  const [filter, setFilter] = useState<ProductFilter>(initialFilter);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeFilter: ProductFilter = { ...filter, searchQuery };
  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts(activeFilter, sortBy);

  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];
  const totalProducts = data?.pages[0]?.total ?? 0;
  const activeFilterCount =
    filter.categories.length +
    (filter.minPrice !== null ? 1 : 0) +
    (filter.maxPrice !== null ? 1 : 0) +
    (filter.minRating !== null ? 1 : 0) +
    (filter.inStockOnly ? 1 : 0);

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate('ProductDetails', { productId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={handleProductPress} />
    ),
    [handleProductPress],
  );

  const renderHeader = useCallback(
    () => (
      <View style={{ padding: spacing.lg, paddingBottom: spacing.sm }}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={navigation.goBack} hitSlop={8}>
            <AppText variant="h1">←</AppText>
          </TouchableOpacity>
          <AppText variant="h1">Products</AppText>
          <View style={{ width: 24 }} />
        </View>

        <SearchBar
          placeholder={`Search ${totalProducts} products...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginTop: spacing.md, marginBottom: spacing.md }}
        />

        <View style={styles.infoBar}>
          <AppText variant="body" style={{ color: colors.text.secondary }}>
            {totalProducts.toLocaleString()} products
          </AppText>
          <View style={styles.infoControls}>
            <Chip
              label={activeFilterCount > 0 ? `Filter (${activeFilterCount})` : 'Filter'}
              selected={activeFilterCount > 0}
              onPress={() => setShowFilter(true)}
            />
            <Chip
              label={`Sort: ${SORT_LABELS[sortBy]}`}
              onPress={() => setShowSort(true)}
            />
          </View>
        </View>
      </View>
    ),
    [totalProducts, searchQuery, sortBy, activeFilterCount, colors.text.secondary, spacing, navigation.goBack],
  );

  const renderEmpty = useCallback(
    () => (
      <AppEmptyState
        title="No products found"
        message="Try adjusting your filters or search query"
        actionLabel="Clear Filters"
        onAction={() => {
          setFilter(DEFAULT_PRODUCT_FILTER);
          setSearchQuery('');
        }}
      />
    ),
    [],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={[styles.footerLoader, { padding: spacing.md, gap: spacing.sm }]}>
        <ActivityIndicator size="small" color={colors.action.primary} />
        <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
          Loading more...
        </AppText>
      </View>
    );
  }, [isFetchingNextPage, colors.action.primary, colors.text.secondary, spacing]);

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
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoControls: {
    flexDirection: 'row',
    gap: 8,
  },
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
