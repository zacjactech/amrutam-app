// Shop Module - Product Search Screen (S03)

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { productRepository } from '../repository';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { AppText } from '../../../shared/components/AppText';
import { SearchBar } from '../../../shared/components/SearchBar';
import { Chip } from '../../../shared/components/Chip';
import { AppEmptyState } from '../../../shared/components/AppEmptyState';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

const TRENDING_SEARCHES = ['Ashwagandha', 'Immunity', 'Hair Oil', 'Skin Care', 'Turmeric', 'Triphala'];
let persistentRecentSearches: string[] = [];

interface ProductSearchScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: { productId: string }) => void;
  };
}

export function ProductSearchScreen({ navigation }: ProductSearchScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setRecentSearches([...persistentRecentSearches]);
  }, []);

  const saveRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    persistentRecentSearches = [trimmed, ...persistentRecentSearches.filter((s) => s !== trimmed)].slice(0, 10);
    setRecentSearches([...persistentRecentSearches]);
  }, []);

  const removeRecentSearch = useCallback((query: string) => {
    persistentRecentSearches = persistentRecentSearches.filter((s) => s !== query);
    setRecentSearches([...persistentRecentSearches]);
  }, []);

  const clearRecentSearches = useCallback(() => {
    persistentRecentSearches = [];
    setRecentSearches([]);
  }, []);

  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['shop', 'search', debouncedQuery],
    queryFn: () => productRepository.searchProducts(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 1000,
  });

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim().length >= 2) {
      setDebouncedQuery(searchQuery.trim());
      saveRecentSearch(searchQuery.trim());
    }
  }, [searchQuery, saveRecentSearch]);

  const handleTrendingPress = useCallback(
    (term: string) => {
      setSearchQuery(term);
      setDebouncedQuery(term);
      saveRecentSearch(term);
    },
    [saveRecentSearch],
  );

  const handleRecentPress = useCallback(
    (term: string) => {
      setSearchQuery(term);
      setDebouncedQuery(term);
    },
    [],
  );

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

  const showSuggestions = debouncedQuery.length < 2;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.searchHeader, { padding: spacing.lg, paddingBottom: spacing.md }]}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={navigation.goBack} hitSlop={8}>
            <AppText variant="h1">←</AppText>
          </TouchableOpacity>
          <AppText variant="h1">Search</AppText>
          <View style={{ width: 24 }} />
        </View>
        <SearchBar
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
          style={{ marginTop: spacing.md }}
        />
      </View>

      {showSuggestions ? (
        <View style={{ padding: spacing.lg }}>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AppText variant="h4" style={{ color: colors.text.primary }}>Recent searches</AppText>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <AppText variant="bodySmall" style={{ color: colors.action.primary }}>Clear all</AppText>
                </TouchableOpacity>
              </View>
              <View style={styles.chipRow}>
                {recentSearches.map((term) => (
                  <Chip
                    key={term}
                    label={term}
                    showRemove
                    onRemove={() => removeRecentSearch(term)}
                    onPress={() => handleRecentPress(term)}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <AppText variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
              Trending searches
            </AppText>
            <View style={styles.chipRow}>
              {TRENDING_SEARCHES.map((term) => (
                <Chip
                  key={term}
                  label={term}
                  variant="outlined"
                  onPress={() => handleTrendingPress(term)}
                />
              ))}
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.action.primary} />
            </View>
          ) : searchResults.length === 0 ? (
            <AppEmptyState
              title="No results found"
              message={`No products match "${debouncedQuery}"`}
              actionLabel="Clear Search"
              onAction={() => {
                setSearchQuery('');
                setDebouncedQuery('');
              }}
            />
          ) : (
            <View style={{ flex: 1, padding: spacing.lg }}>
              <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
                Search Results ({searchResults.length})
              </AppText>
              <FlashList
                data={searchResults}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: spacing.xxl }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {},
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
