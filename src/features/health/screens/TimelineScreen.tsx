// Health Records Module - Timeline Screen

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useHealthRecords } from '../hooks';
import { TimelineSection } from '../components/TimelineSection';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { RecordFilter, DEFAULT_RECORD_FILTER, HealthRecordType } from '../types';
import { RecordTypeChip } from '../components/RecordTypeChip';
import { groupRecordsByMonth } from '../generator';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface TimelineScreenProps {
  navigation: {
    navigate: (screen: string, params?: { recordId: string } | { attachment: { id: string; name: string; mimeType: string; thumbnailUrl: string | undefined; uri: string | undefined; sizeBytes: number | undefined } }) => void;
  };
}

export function TimelineScreen({ navigation }: TimelineScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [filter, setFilter] = useState<RecordFilter>(DEFAULT_RECORD_FILTER);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useHealthRecords(filter);

  const allRecords = data?.pages.flatMap((page) => page.data) ?? [];
  const totalRecords = data?.pages[0]?.total ?? 0;
  const timelineGroups = groupRecordsByMonth(allRecords);

  const renderHeader = useCallback(
    () => (
      <View style={[styles.header, { padding: spacing.lg, paddingBottom: spacing.sm }]}>
        <AppText variant="h2" style={{ marginBottom: spacing.xs }}>
          Health Records
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
          {totalRecords !== undefined ? `${totalRecords.toLocaleString()} records` : 'Loading...'}
        </AppText>
        <View style={styles.controls}>
          <Button
            title="Filters"
            variant="outline"
            size="small"
            onPress={() => setShowFilters(true)}
            style={styles.controlButton}
          />
        </View>
      </View>
    ),
    [totalRecords, colors.text.secondary, spacing],
  );

  const renderItem = useCallback(
    ({ item }: { item: { dateLabel: string; records: typeof allRecords } }) => (
      <TimelineSection
        dateLabel={item.dateLabel}
        records={item.records}
        onAttachmentPress={(attachment) => navigation.navigate('AttachmentPreview', { attachment })}
      />
    ),
    [navigation],
  );

  const renderEmpty = useCallback(
    () => (
      <AppEmptyState
        title="No records found"
        message="Try adjusting your filters"
        actionLabel="Clear Filters"
        onAction={() => setFilter(DEFAULT_RECORD_FILTER)}
      />
    ),
    [],
  );

  const renderError = useCallback(
    () => (
      <AppErrorState
        title="Something went wrong"
        message={error instanceof Error ? error.message : 'Failed to load records'}
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
          Loading records...
        </AppText>
      </View>
    );
  }

  if (isError) {
    return renderError();
  }

  const timelineData = Array.from(timelineGroups.entries()).map(([dateLabel, records]) => ({
    dateLabel,
    records,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <FlashList
        data={timelineData}
        renderItem={renderItem}
        keyExtractor={(item) => item.dateLabel}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={[styles.listContent, { paddingBottom: spacing.xxl }]}
      />
      {showFilters && (
        <View style={[styles.filterOverlay, { backgroundColor: colors.background.primary }]}>
          <View style={[styles.filterHeader, { padding: spacing.lg, borderBottomColor: colors.border.default }]}>
            <AppText variant="h3">Filters</AppText>
            <Button title="Done" variant="ghost" size="small" onPress={() => setShowFilters(false)} />
          </View>
          <View style={{ padding: spacing.lg, gap: spacing.lg }}>
            <View>
              <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                Record Type
              </AppText>
              <View style={styles.typeRow}>
                {(['lab_report', 'prescription', 'consultation', 'vaccination', 'allergy'] as HealthRecordType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setFilter((prev) => ({
                        ...prev,
                        types: prev.types.includes(type) ? prev.types.filter((t) => t !== type) : [...prev.types, type],
                      }));
                    }}
                  >
                    <RecordTypeChip type={type} selected={filter.types.includes(type)} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Button
              title="Clear Filters"
              variant="ghost"
              size="medium"
              onPress={() => setFilter(DEFAULT_RECORD_FILTER)}
            />
          </View>
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
  filterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
