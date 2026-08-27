// Consultation Module - Doctor List Screen (C02)

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useDoctors } from '../hooks';
import { Doctor, DoctorFilter, DEFAULT_DOCTOR_FILTER } from '../types';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { FilterSortSheet } from './FilterSortSheet';

interface DoctorListScreenProps {
  onDoctorPress: (doctorId: string) => void;
  onBack: () => void;
}

export function DoctorListScreen({
  onDoctorPress,
  onBack,
}: DoctorListScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [filter, setFilter] = useState<DoctorFilter>(DEFAULT_DOCTOR_FILTER);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee' | 'name'>('rating');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sheetTab, setSheetTab] = useState<'filter' | 'sort'>('sort');

  const activeFilter = useMemo(
    () => ({ ...filter, searchQuery }),
    [filter, searchQuery],
  );

  const { data, isLoading, isError, error, refetch, isRefetching } = useDoctors(activeFilter, sortBy);

  const totalDoctors = data?.total ?? 0;
  const doctors = data?.data ?? [];

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filter.specialization !== null) count++;
    if (filter.minExperience !== null) count++;
    if (filter.maxFee !== null) count++;
    if (filter.minRating !== null) count++;
    if (filter.language !== null) count++;
    if (filter.availableOnly) count++;
    return count;
  }, [filter]);

  const formatNextSlot = (isoString: string | null): string => {
    if (isoString === null) return 'Not available';
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Starting soon';
    if (diffHours < 24) return `In ${diffHours}h`;
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const renderDoctorItem = useCallback(
    ({ item }: { item: Doctor }) => (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.md }]}
        onPress={() => onDoctorPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardRow}>
          <Image source={{ uri: item.photoUrl }} style={[styles.avatar, { borderRadius: spacing.md }]} contentFit="cover" />
          <View style={styles.cardInfo}>
            <AppText variant="body" numberOfLines={1} style={{ color: colors.text.primary, fontWeight: '600' }}>{item.name}</AppText>
            <AppText variant="bodySmall" numberOfLines={1} style={{ color: colors.text.secondary, marginTop: 2 }}>{item.specialization}</AppText>
            <View style={styles.ratingRow}>
              <AppText variant="bodySmall" style={{ color: colors.rating, fontWeight: '600' }}>★ {item.rating.toFixed(1)}</AppText>
              <AppText variant="bodySmall" style={{ color: colors.text.tertiary, marginLeft: spacing.xs }}>· {item.experience} yrs exp</AppText>
            </View>
          </View>
        </View>

        <View style={[styles.cardBottom, { borderTopColor: colors.border.light, borderTopWidth: 1, marginTop: spacing.md, paddingTop: spacing.md }]}>
          <View style={styles.feeSection}>
            <AppText variant="caption" style={{ color: colors.text.secondary }}>Consultation Fee</AppText>
            <AppText variant="bodyLarge" style={{ color: colors.action.primary, fontWeight: '700' }}>₹{item.consultationFee}</AppText>
          </View>
          <View style={styles.slotSection}>
            <AppText variant="caption" style={{ color: colors.status.warning }}>Next available slot</AppText>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>{formatNextSlot(item.availability.nextAvailableSlot)}</AppText>
          </View>
        </View>

        <Button
          title="View Profile"
          variant="outline"
          size="small"
          onPress={() => onDoctorPress(item.id)}
          style={{ marginTop: spacing.md }}
        />
      </TouchableOpacity>
    ),
    [colors, spacing, onDoctorPress],
  );

  const renderHeader = useCallback(() => (
    <View style={{ padding: spacing.lg, paddingBottom: spacing.sm }}>
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={onBack} style={{ marginRight: spacing.md }}>
          <AppText variant="body" style={{ color: colors.action.primary }}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="h1">Doctors</AppText>
      </View>

      <TextInput
        style={[styles.searchInput, { backgroundColor: colors.surface.default, borderColor: colors.border.default, borderRadius: spacing.sm, color: colors.text.primary }]}
        placeholder="Search doctors..."
        placeholderTextColor={colors.text.tertiary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.infoBar}>
        <AppText variant="body" style={{ color: colors.text.secondary, flex: 1 }}>{totalDoctors} doctors available</AppText>
        <TouchableOpacity
          style={[styles.filterBtn, { borderColor: colors.border.default, borderRadius: spacing.sm }]}
          onPress={() => { setSheetTab('filter'); setSheetVisible(true); }}
        >
          <AppText variant="bodySmall" style={{ color: colors.text.primary }}>Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortBtn, { borderColor: colors.border.default, borderRadius: spacing.sm }]}
          onPress={() => { setSheetTab('sort'); setSheetVisible(true); }}
        >
          <AppText variant="bodySmall" style={{ color: colors.text.primary }}>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</AppText>
          <AppText variant="caption" style={{ color: colors.text.tertiary, marginLeft: 4 }}>▼</AppText>
        </TouchableOpacity>
      </View>
    </View>
  ), [spacing, totalDoctors, activeFilterCount, sortBy, searchQuery, colors, onBack]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
        <AppText variant="body" style={{ marginTop: spacing.md, color: colors.text.secondary }}>Loading doctors...</AppText>
      </View>
    );
  }

  if (isError) {
    return (
      <AppErrorState
        title="Failed to load"
        message={error instanceof Error ? error.message : 'Could not load doctors'}
        type="retryable"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <FlashList
        data={doctors}
        renderItem={renderDoctorItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <AppEmptyState
            title="No doctors found"
            message="Try adjusting your filters or search query."
            actionLabel="Clear Filters"
            onAction={() => { setFilter(DEFAULT_DOCTOR_FILTER); setSearchQuery(''); }}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.action.primary}
            colors={[colors.action.primary]}
          />
        }
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      />

      <FilterSortSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        activeTab={sheetTab}
        onTabChange={setSheetTab}
        filter={filter}
        onFilterChange={setFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  searchInput: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 16, fontSize: 15, marginBottom: 12 },
  infoBar: { flexDirection: 'row', alignItems: 'center' },
  filterBtn: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, marginLeft: 8 },
  sortBtn: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, marginLeft: 8, flexDirection: 'row', alignItems: 'center' },
  card: {},
  cardRow: { flexDirection: 'row' },
  avatar: { width: 80, height: 80, backgroundColor: '#E8F3EC' },
  cardInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  feeSection: {},
  slotSection: { alignItems: 'flex-end' },
});
