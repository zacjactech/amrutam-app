// Shop Module - Sort Sheet

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { SortOption } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

interface SortSheetProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onClose: () => void;
}

export function SortSheet({ currentSort, onSortChange, onClose }: SortSheetProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, borderBottomColor: colors.border.default }]}>
        <AppText variant="h3">Sort By</AppText>
        <Button title="Done" variant="ghost" size="small" onPress={onClose} />
      </View>
      <View style={[styles.content, { padding: spacing.lg, gap: spacing.md }]}>
        {SORT_OPTIONS.map((option) => (
          <Button
            key={option.value}
            title={option.label}
            variant={currentSort === option.value ? 'primary' : 'outline'}
            size="medium"
            onPress={() => {
              onSortChange(option.value);
              onClose();
            }}
            style={styles.optionButton}
          />
        ))}
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
  content: {},
  optionButton: {
    marginRight: 0,
  },
});
