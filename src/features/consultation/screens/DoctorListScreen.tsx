// Consultation Module - Doctor List Screen

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useDoctors } from '../hooks';
import { DoctorCard } from '../components/DoctorCard';
import { Doctor, DoctorFilter, DEFAULT_DOCTOR_FILTER } from '../types';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface DoctorListScreenProps {
  onDoctorPress: (doctorId: string) => void;
  onFilterPress: () => void;
}

export function DoctorListScreen({
  onDoctorPress,
  onFilterPress,
}: DoctorListScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [filter, setFilter] = useState<DoctorFilter>(DEFAULT_DOCTOR_FILTER);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee' | 'name'>('rating');

  const { data, isLoading, isError, error, refetch, isRefetching } = useDoctors(filter, sortBy);

  const handleDoctorPress = useCallback(
    (doctorId: string) => {
      onDoctorPress(doctorId);
    },
    [onDoctorPress],
  );

  const handleSortChange = useCallback((newSort: 'rating' | 'experience' | 'fee' | 'name') => {
    setSortBy(newSort);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Doctor }) => (
      <DoctorCard doctor={item} onPress={handleDoctorPress} />
    ),
    [handleDoctorPress],
  );

  const renderHeader = useCallback(
    () => (
      <View style={[styles.header, { padding: spacing.lg, paddingBottom: spacing.sm }]}>
        <AppText variant="h2" style={{ marginBottom: spacing.xs }}>
          Find a Doctor
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
          {data?.total !== undefined ? `${data.total} doctors available` : 'Loading...'}
        </AppText>
        <View style={[styles.sortRow, { marginBottom: spacing.sm }]}>
          <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
            Sort by:
          </AppText>
          <View style={styles.sortButtons}>
            {(['rating', 'experience', 'fee', 'name'] as const).map((sort) => (
              <Button
                key={sort}
                title={sort.charAt(0).toUpperCase() + sort.slice(1)}
                variant={sortBy === sort ? 'primary' : 'outline'}
                size="small"
                onPress={() => handleSortChange(sort)}
                style={styles.sortButton}
              />
            ))}
          </View>
        </View>
        <Button
          title="Filters"
          variant="ghost"
          size="small"
          onPress={onFilterPress}
          style={styles.filterButton}
        />
      </View>
    ),
    [data?.total, sortBy, handleSortChange, onFilterPress, colors.text.secondary, spacing],
  );

  const renderEmpty = useCallback(
    () => (
      <AppEmptyState
        title="No doctors found"
        message="Try adjusting your filters or search query"
        actionLabel="Clear Filters"
        onAction={() => setFilter(DEFAULT_DOCTOR_FILTER)}
      />
    ),
    [],
  );

  const renderError = useCallback(
    () => (
      <AppErrorState
        title="Something went wrong"
        message={error instanceof Error ? error.message : 'Failed to load doctors'}
        type="retryable"
        onRetry={() => refetch()}
      />
    ),
    [error, refetch],
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
        <AppText variant="body" style={{ marginTop: spacing.md, color: colors.text.secondary }}>
          Loading doctors...
        </AppText>
      </View>
    );
  }

  if (isError) {
    return renderError();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <FlashList
        data={data?.data ?? []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.action.primary}
            colors={[colors.action.primary]}
          />
        }
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
  header: {},
  sortRow: {},
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    marginRight: 0,
  },
  filterButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  listContent: {},
});
