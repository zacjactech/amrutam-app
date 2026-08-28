// Health Records Module - Timeline Screen

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useHealthRecords } from '../hooks';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { RecordFilter, DEFAULT_RECORD_FILTER, HealthRecordType, RECORD_TYPE_LABELS, HEALTH_RECORD_TYPES, HealthRecord } from '../types';
import { groupRecordsByMonth, getHealthRecordCache } from '../generator';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { Button } from '../../../shared/components/Button';
import { Flask, Pill, Stethoscope, Syringe, AlertTriangle, Shield, Search, IconTag, IconFilter, Close, CheckCircleFilled } from '../../../shared/assets/icons';

const RECORD_TYPE_ICONS: Record<HealthRecordType, React.ComponentType<{ width: number; height: number; color?: string }>> = {
  lab_report: Flask,
  prescription: Pill,
  consultation: Stethoscope,
  vaccination: Syringe,
  allergy: AlertTriangle,
};

const RECORD_TYPE_DOT_COLORS: Record<HealthRecordType, string> = {
  lab_report: '#3B82F6',
  prescription: '#2D6A4F',
  consultation: '#7C3AED',
  vaccination: '#06B6D4',
  allergy: '#F97316',
};

const FILTER_TYPES: { type: HealthRecordType; label: string }[] = [
  { type: 'lab_report', label: 'Lab' },
  { type: 'prescription', label: 'Prescription' },
  { type: 'consultation', label: 'Consultation' },
  { type: 'vaccination', label: 'Vaccination' },
  { type: 'allergy', label: 'Allergy' },
];

function formatMonthYear(key: string): string {
  const [year, month] = key.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).toUpperCase();
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface TimelineScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

export function TimelineScreen({ navigation }: TimelineScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [filter, setFilter] = useState<RecordFilter>(DEFAULT_RECORD_FILTER);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showTagSheet, setShowTagSheet] = useState(false);

  const { data, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useHealthRecords(filter);

  const allRecords = data?.pages.flatMap((page) => page.data) ?? [];
  const totalRecords = data?.pages[0]?.total ?? 0;
  const timelineGroups = groupRecordsByMonth(allRecords);

  const recordCounts = useMemo(() => {
    const all = getHealthRecordCache();
    const counts: Record<HealthRecordType, number> = {
      lab_report: 0,
      prescription: 0,
      consultation: 0,
      vaccination: 0,
      allergy: 0,
    };
    for (const r of all) {
      counts[r.type]++;
    }
    return counts;
  }, []);

  const totalStorage = useMemo(() => {
    const all = getHealthRecordCache();
    let bytes = 0;
    for (const r of all) {
      for (const a of r.attachments) {
        bytes += a.sizeBytes ?? 0;
      }
    }
    return bytes;
  }, []);

  const timelineData = useMemo(() => {
    return Array.from(timelineGroups.entries()).map(([dateLabel, records]) => ({
      dateLabel,
      records,
    }));
  }, [timelineGroups]);

  const activeFilterCount = filter.types.length + filter.tags.length;

  const handleRecordPress = useCallback(
    (record: HealthRecord) => {
      navigation.navigate('RecordDetail', { recordId: record.id });
    },
    [navigation],
  );

  const handleFilterTypeToggle = useCallback((type: HealthRecordType) => {
    setFilter((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilter(DEFAULT_RECORD_FILTER);
  }, []);

  const handleApplyTags = useCallback((tags: string[]) => {
    setFilter((prev) => ({ ...prev, tags }));
  }, []);

  const renderMonthSection = useCallback(
    ({ item }: { item: { dateLabel: string; records: HealthRecord[] } }) => (
      <View style={[styles.monthSection, { paddingHorizontal: spacing.lg }]}>
        <View style={[styles.monthHeader, { marginTop: spacing.xl, marginBottom: spacing.md }]}>
          <AppText
            variant="label"
            style={{ color: colors.text.secondary, letterSpacing: 1, fontWeight: '700' }}
          >
            {formatMonthYear(item.dateLabel)}
          </AppText>
        </View>
        {item.records.map((record, index) => {
          const dotColor = RECORD_TYPE_DOT_COLORS[record.type];
          const isLast = index === item.records.length - 1;
          const date = new Date(record.occurredAt);
          return (
            <TouchableOpacity
              key={record.id}
              style={styles.recordRow}
              onPress={() => handleRecordPress(record)}
              activeOpacity={0.7}
            >
              <View style={styles.timelineColumn}>
                <View
                  style={[
                    styles.timelineDot,
                    { backgroundColor: dotColor, width: 12, height: 12, borderRadius: 6 },
                  ]}
                />
                {!isLast && (
                  <View style={[styles.timelineLine, { backgroundColor: colors.border.default }]} />
                )}
              </View>
              <View
                style={[
                  styles.recordCard,
                  {
                    backgroundColor: colors.surface.default,
                    padding: spacing.md,
                    borderRadius: spacing.md,
                    marginBottom: spacing.sm,
                    flex: 1,
                    marginLeft: spacing.md,
                  },
                ]}
              >
                <View style={styles.recordHeader}>
                  <View style={[styles.recordIconContainer, { backgroundColor: dotColor + '15', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }]}>
                    {(() => { const IconComp = RECORD_TYPE_ICONS[record.type]; return <IconComp width={18} height={18} color={dotColor} />; })()}
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600' }} numberOfLines={1}>
                      {record.title}
                    </AppText>
                    <AppText variant="caption" style={{ color: colors.text.secondary, marginTop: 2 }}>
                      {record.description ? record.description.substring(0, 60) + (record.description.length > 60 ? '...' : '') : RECORD_TYPE_LABELS[record.type]}
                    </AppText>
                  </View>
                  <View style={styles.recordRight}>
                    <AppText variant="caption" style={{ color: colors.text.tertiary, textAlign: 'right' }}>
                      {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </AppText>
                    <AppText variant="h3" style={{ color: colors.text.tertiary, marginTop: 2 }}>›</AppText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    ),
    [colors, spacing, handleRecordPress],
  );

  const renderHeader = useCallback(
    () => (
      <View style={[styles.headerContainer, { paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}>
        <View style={styles.titleRow}>
          <AppText variant="h1" style={{ fontSize: 24, fontWeight: '700', color: colors.text.primary, flex: 1 }}>
            Health Records
          </AppText>
          <View style={[styles.encryptedBadge, { backgroundColor: colors.action.primarySoft, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 999, flexDirection: 'row', alignItems: 'center' }]}>
            <Shield width={14} height={14} color={colors.action.primary} style={{ marginRight: 4 }} />
            <AppText variant="caption" style={{ color: colors.action.primary, fontWeight: '600' }}>
              Encrypted
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('RecordSearch')}
          activeOpacity={0.7}
          style={[styles.searchTrigger, { backgroundColor: colors.background.secondary, borderRadius: 24, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginTop: spacing.md, flexDirection: 'row', alignItems: 'center' }]}
        >
          <Search width={18} height={18} color={colors.text.tertiary} style={{ marginRight: spacing.sm }} />
          <AppText variant="body" style={{ color: colors.text.tertiary }}>
            Search your health records...
          </AppText>
        </TouchableOpacity>

        <View style={[styles.filterRow, { marginTop: spacing.md }]}>
          <TouchableOpacity
            onPress={() => {
              setFilter((prev) => ({ ...prev, types: [] }));
            }}
            activeOpacity={0.7}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter.types.length === 0 ? colors.action.primary : 'transparent',
                borderColor: filter.types.length === 0 ? colors.action.primary : colors.border.default,
                borderWidth: 1,
                borderRadius: 999,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                marginRight: spacing.sm,
              },
            ]}
          >
            <AppText
              variant="body"
              style={{
                color: filter.types.length === 0 ? colors.text.inverse : colors.text.primary,
                fontWeight: '500',
              }}
            >
              All {totalRecords > 0 ? totalRecords.toLocaleString() : ''}
            </AppText>
          </TouchableOpacity>

          {FILTER_TYPES.map(({ type, label }) => {
            const isActive = filter.types.includes(type);
            const count = recordCounts[type];
            return (
              <TouchableOpacity
                key={type}
                onPress={() => handleFilterTypeToggle(type)}
                activeOpacity={0.7}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? RECORD_TYPE_DOT_COLORS[type] + '15' : 'transparent',
                    borderColor: isActive ? RECORD_TYPE_DOT_COLORS[type] : colors.border.default,
                    borderWidth: 1,
                    borderRadius: 999,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    marginRight: spacing.sm,
                  },
                ]}
              >
                <AppText
                  variant="body"
                  style={{
                    color: isActive ? RECORD_TYPE_DOT_COLORS[type] : colors.text.secondary,
                    fontWeight: '500',
                  }}
                >
                  {label} {count}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.actionRow, { marginTop: spacing.md, flexDirection: 'row', gap: spacing.sm }]}>
          <TouchableOpacity
            onPress={() => setShowFilterSheet(true)}
            activeOpacity={0.7}
            style={[styles.actionButton, { borderColor: colors.border.default, borderWidth: 1, borderRadius: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }]}
          >
            <IconFilter width={16} height={16} color={colors.text.primary} style={{ marginRight: spacing.xs }} />
            <AppText variant="body" style={{ color: colors.text.primary }}>
              Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowTagSheet(true)}
            activeOpacity={0.7}
            style={[styles.actionButton, { borderColor: colors.border.default, borderWidth: 1, borderRadius: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }]}
          >
            <IconTag width={16} height={16} color={colors.text.primary} style={{ marginRight: spacing.xs }} />
            <AppText variant="body" style={{ color: colors.text.primary }}>
              Tags{filter.tags.length > 0 ? ` (${filter.tags.length})` : ''}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [colors, spacing, filter.tags.length, totalRecords, recordCounts, handleFilterTypeToggle, navigation, activeFilterCount, filter.types],
  );

  const renderFooter = useCallback(
    () => (
      <View style={[styles.footer, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
        {isFetchingNextPage && (
          <ActivityIndicator size="small" color={colors.action.primary} style={{ marginBottom: spacing.md }} />
        )}
        <View style={[styles.storageInfo, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md }]}>
          <View style={styles.storageRow}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>
              {totalRecords.toLocaleString()} records · {formatBytes(totalStorage)} used
            </AppText>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border.light, borderRadius: 4, height: 4, marginTop: spacing.sm }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.action.primary,
                  width: `${Math.min((totalStorage / (50 * 1024 * 1024)) * 100, 100)}%`,
                  height: 4,
                  borderRadius: 4,
                },
              ]}
            />
          </View>
        </View>
      </View>
    ),
    [colors, spacing, totalRecords, totalStorage, isFetchingNextPage],
  );

  const renderEmpty = useCallback(
    () => (
      <AppEmptyState
        title="No records found"
        message="Try adjusting your filters or search terms"
        actionLabel="Clear Filters"
        onAction={handleResetFilters}
      />
    ),
    [handleResetFilters],
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <FlashList
        data={timelineData}
        renderItem={renderMonthSection}
        keyExtractor={(item) => item.dateLabel}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      />

      {showFilterSheet && (
        <RecordFilterSheetInline
          visible={showFilterSheet}
          onClose={() => setShowFilterSheet(false)}
          selectedTypes={filter.types}
          onApply={(types) => setFilter((prev) => ({ ...prev, types }))}
          onReset={handleResetFilters}
          recordCounts={recordCounts}
        />
      )}

      {showTagSheet && (
        <TagFilterSheetInline
          visible={showTagSheet}
          onClose={() => setShowTagSheet(false)}
          selectedTags={filter.tags}
          onApply={handleApplyTags}
        />
      )}
    </View>
  );
}

function RecordFilterSheetInline({
  visible: _visible,
  onClose,
  selectedTypes,
  onApply,
  onReset,
  recordCounts,
}: {
  visible: boolean;
  onClose: () => void;
  selectedTypes: HealthRecordType[];
  onApply: (types: HealthRecordType[]) => void;
  onReset: () => void;
  recordCounts: Record<HealthRecordType, number>;
}) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [localTypes, setLocalTypes] = useState<HealthRecordType[]>(selectedTypes);

  React.useEffect(() => {
    setLocalTypes(selectedTypes);
  }, [selectedTypes]);

  const toggleType = useCallback((type: HealthRecordType) => {
    setLocalTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const handleApply = useCallback(() => {
    onApply(localTypes);
    onClose();
  }, [localTypes, onApply, onClose]);

  return (
    <View style={[styles.sheetOverlay, { backgroundColor: colors.overlay }]}>
      <View style={[styles.sheetContainer, { backgroundColor: colors.surface.default, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: spacing.lg, maxHeight: '80%' }]}>
        <View style={styles.sheetHandle}>
          <View style={[styles.handleBar, { backgroundColor: colors.border.default }]} />
        </View>
        <View style={styles.sheetHeader}>
          <AppText variant="h3" style={{ color: colors.text.primary }}>Filter Records</AppText>
          <TouchableOpacity onPress={onClose}>
            <Close width={20} height={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <AppText variant="label" style={{ color: colors.text.secondary, marginTop: spacing.lg, marginBottom: spacing.md, textTransform: 'uppercase' }}>
          Record Type
        </AppText>

        {HEALTH_RECORD_TYPES.map((type) => {
          const isSelected = localTypes.includes(type);
          const typeColor = RECORD_TYPE_DOT_COLORS[type];
          const count = recordCounts[type] ?? 0;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => toggleType(type)}
              activeOpacity={0.7}
              style={[styles.filterTypeRow, { paddingVertical: spacing.md, borderBottomColor: colors.border.light }]}
            >
              <View style={[styles.filterTypeIcon, { backgroundColor: typeColor + '20', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }]}>                  {(() => { const IconComp = RECORD_TYPE_ICONS[type]; return <IconComp width={18} height={18} color={typeColor} />; })()}
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600' }}>
                  {RECORD_TYPE_LABELS[type]}
                </AppText>
                <AppText variant="caption" style={{ color: colors.text.secondary }}>
                  {count.toLocaleString()} records
                </AppText>
              </View>
              <View style={[styles.checkbox, { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: isSelected ? typeColor : colors.border.default, backgroundColor: isSelected ? typeColor : 'transparent', justifyContent: 'center', alignItems: 'center' }]}>
                {isSelected &&                    <CheckCircleFilled width={14} height={14} color="#FFF" />}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={[styles.sheetActions, { flexDirection: 'row', gap: 12, marginTop: spacing.xl }]}>
          <Button title="Reset" variant="ghost" size="medium" onPress={() => { setLocalTypes([]); onReset(); }} style={{ flex: 1 }} />
          <Button title="Apply Filters" variant="primary" size="medium" onPress={handleApply} style={{ flex: 2 }} />
        </View>
      </View>
    </View>
  );
}

function TagFilterSheetInline({
  visible: _visible,
  onClose,
  selectedTags,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  selectedTags: string[];
  onApply: (tags: string[]) => void;
}) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [localTags, setLocalTags] = useState<string[]>(selectedTags);

  React.useEffect(() => {
    setLocalTags(selectedTags);
  }, [selectedTags]);

  const toggleTag = useCallback((tag: string) => {
    setLocalTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const handleApply = useCallback(() => {
    onApply(localTags);
    onClose();
  }, [localTags, onApply, onClose]);

  const tags = ['Routine', 'Follow-up', 'Chronic', 'Blood Test', 'Medication', 'Allergy', 'Vaccination', 'Prevention', 'Annual'];

  return (
    <View style={[styles.sheetOverlay, { backgroundColor: colors.overlay }]}>
      <View style={[styles.sheetContainer, { backgroundColor: colors.surface.default, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: spacing.lg, maxHeight: '80%' }]}>
        <View style={styles.sheetHandle}>
          <View style={[styles.handleBar, { backgroundColor: colors.border.default }]} />
        </View>
        <View style={styles.sheetHeader}>
          <AppText variant="h3" style={{ color: colors.text.primary }}>Filter by tags</AppText>
          <TouchableOpacity onPress={() => setLocalTags([])}>
            <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>Reset</AppText>
          </TouchableOpacity>
        </View>

        <View style={[styles.chipGrid, { marginTop: spacing.md }]}>
          {tags.map((tag) => {
            const isSelected = localTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                onPress={() => toggleTag(tag)}
                activeOpacity={0.7}
                style={[styles.tagChip, { backgroundColor: isSelected ? colors.action.primary : 'transparent', borderColor: isSelected ? colors.action.primary : colors.border.default, borderWidth: 1, borderRadius: 999, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginRight: spacing.sm, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center' }]}
              >
                {isSelected && (
                  <CheckCircleFilled width={14} height={14} color={colors.text.inverse} style={{ marginRight: spacing.xs }} />
                )}
                <AppText variant="body" style={{ color: isSelected ? colors.text.inverse : colors.text.primary, fontWeight: isSelected ? '600' : '400' }}>
                  {tag}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.sheetActions, { flexDirection: 'row', gap: 12, marginTop: spacing.xl }]}>
          <Button title="Clear" variant="ghost" size="medium" onPress={() => setLocalTags([])} style={{ flex: 1 }} />
          <Button title="Apply Tags" variant="primary" size="medium" onPress={handleApply} style={{ flex: 2 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: {},
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  encryptedBadge: {},
  searchTrigger: {},
  filterRow: { flexDirection: 'row', flexWrap: 'wrap' },
  filterChip: {},
  actionRow: {},
  actionButton: {},
  monthSection: {},
  monthHeader: {},
  recordRow: { flexDirection: 'row' },
  timelineColumn: { alignItems: 'center', width: 20 },
  timelineDot: {},
  timelineLine: { width: 2, flex: 1, marginTop: 4, minHeight: 20 },
  recordCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  recordHeader: { flexDirection: 'row', alignItems: 'center' },
  recordIconContainer: {},
  recordRight: { alignItems: 'flex-end' },
  footer: {},
  storageInfo: {},
  storageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressBar: { overflow: 'hidden' },
  progressFill: {},
  sheetOverlay: { ...StyleSheet.absoluteFill, justifyContent: 'flex-end', zIndex: 100 },
  sheetContainer: { overflow: 'hidden' },
  sheetHandle: { alignItems: 'center', paddingVertical: 8 },
  handleBar: { width: 40, height: 4, borderRadius: 2 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  filterTypeRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1 },
  filterTypeIcon: {},
  checkbox: {},
  sheetActions: {},
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  tagChip: {},
});
