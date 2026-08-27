// Shop Module - Product Filter Sheet

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { Input } from '../../../shared/components/Input';
import { ProductFilter, ProductCategory, DEFAULT_PRODUCT_FILTER, PRODUCT_CATEGORIES } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { useDebounce } from '../../../shared/hooks/useDebounce';

interface ProductFilterSheetProps {
  filter: ProductFilter;
  onFilterChange: (filter: ProductFilter) => void;
  onClose: () => void;
}

export function ProductFilterSheet({ filter, onFilterChange, onClose }: ProductFilterSheetProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [localSearch, setLocalSearch] = useState(filter.searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  const toggleCategory = useCallback(
    (category: ProductCategory) => {
      const categories = filter.categories.includes(category)
        ? filter.categories.filter((c) => c !== category)
        : [...filter.categories, category];
      onFilterChange({ ...filter, categories });
    },
    [filter, onFilterChange],
  );

  const handleClear = useCallback(() => {
    onFilterChange({
      ...DEFAULT_PRODUCT_FILTER,
      sortBy: filter.sortBy,
    });
    setLocalSearch('');
  }, [filter.sortBy, onFilterChange]);

  React.useEffect(() => {
    if (debouncedSearch !== filter.searchQuery) {
      onFilterChange({ ...filter, searchQuery: debouncedSearch });
    }
  }, [debouncedSearch, filter, onFilterChange]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomColor: colors.border.default }]}>
        <AppText variant="h3">Filters</AppText>
        <Button title="Clear" variant="ghost" size="small" onPress={handleClear} />
      </View>

      <ScrollView style={styles.content}>
        <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm, marginTop: spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Search
        </AppText>
        <Input
          placeholder="Search products..."
          value={localSearch}
          onChangeText={setLocalSearch}
          containerStyle={styles.inputContainer}
        />

        <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm, marginTop: spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Categories
        </AppText>
        <View style={styles.categoryGrid}>
          {PRODUCT_CATEGORIES.map((category) => (
            <Button
              key={category}
              title={category}
              variant={filter.categories.includes(category) ? 'primary' : 'outline'}
              size="small"
              onPress={() => toggleCategory(category)}
              style={styles.categoryButton}
            />
          ))}
        </View>

        <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm, marginTop: spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Price Range
        </AppText>
        <View style={styles.priceRow}>
          <Input
            placeholder="Min"
            keyboardType="numeric"
            value={filter.minPrice?.toString() ?? ''}
            onChangeText={(text) =>
              onFilterChange({
                ...filter,
                minPrice: text.length > 0 ? Number(text) : null,
              })
            }
            containerStyle={[styles.inputContainer, styles.priceInput]}
          />
          <Input
            placeholder="Max"
            keyboardType="numeric"
            value={filter.maxPrice?.toString() ?? ''}
            onChangeText={(text) =>
              onFilterChange({
                ...filter,
                maxPrice: text.length > 0 ? Number(text) : null,
              })
            }
            containerStyle={[styles.inputContainer, styles.priceInput]}
          />
        </View>

        <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm, marginTop: spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Minimum Rating
        </AppText>
        <View style={styles.ratingRow}>
          {[4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              title={rating.toFixed(1)}
              variant={filter.minRating === rating ? 'primary' : 'outline'}
              size="small"
              onPress={() =>
                onFilterChange({
                  ...filter,
                  minRating: filter.minRating === rating ? null : rating,
                })
              }
              style={styles.ratingButton}
            />
          ))}
        </View>

        <Button
          title={filter.inStockOnly ? 'In Stock Only: ON' : 'In Stock Only: OFF'}
          variant={filter.inStockOnly ? 'primary' : 'outline'}
          size="medium"
          onPress={() => onFilterChange({ ...filter, inStockOnly: !filter.inStockOnly })}
          style={styles.stockButton}
        />
      </ScrollView>

      <View style={[styles.footer, { flexDirection: 'row', padding: spacing.lg, gap: spacing.md, borderTopColor: colors.border.default }]}>
        <Button title="Cancel" variant="ghost" size="medium" onPress={onClose} style={styles.footerButton} />
        <Button title="Apply" variant="primary" size="medium" onPress={onClose} style={styles.footerButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 0,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    marginRight: 0,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingButton: {
    marginRight: 0,
  },
  stockButton: {
    marginTop: 16,
  },
  footer: {
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
  },
});
