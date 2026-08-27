// Consultation Module - Filter/Sort Bottom Sheet

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheet } from '../../../shared/components/BottomSheet';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { DoctorFilter, SPECIALIZATIONS, DEFAULT_DOCTOR_FILTER } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface FilterSortSheetProps {
  visible: boolean;
  onClose: () => void;
  activeTab: 'filter' | 'sort';
  onTabChange: (tab: 'filter' | 'sort') => void;
  filter: DoctorFilter;
  onFilterChange: (filter: DoctorFilter) => void;
  sortBy: 'rating' | 'experience' | 'fee' | 'name';
  onSortChange: (sort: 'rating' | 'experience' | 'fee' | 'name') => void;
}

const SORT_OPTIONS = [
  { value: 'rating' as const, label: 'Recommended' },
  { value: 'experience' as const, label: 'Experience' },
  { value: 'fee' as const, label: 'Fee: Low to High' },
  { value: 'name' as const, label: 'Name' },
];

const RATING_OPTIONS = [
  { value: 4.5, label: '4.5+ ★' },
  { value: 4.0, label: '4.0+ ★' },
  { value: 3.5, label: '3.5+ ★' },
];

const FEE_OPTIONS = [
  { value: 500, label: 'Under ₹500' },
  { value: 1000, label: 'Under ₹1,000' },
  { value: 2000, label: 'Under ₹2,000' },
];

const EXP_OPTIONS = [
  { value: 5, label: '5+ years' },
  { value: 10, label: '10+ years' },
  { value: 20, label: '20+ years' },
];

export function FilterSortSheet({
  visible,
  onClose,
  activeTab,
  onTabChange,
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
}: FilterSortSheetProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  const handleReset = () => {
    onFilterChange(DEFAULT_DOCTOR_FILTER);
  };

  const handleApply = () => {
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={activeTab === 'filter' ? 'Filter Doctors' : 'Sort By'}
      bottomAction={
        activeTab === 'filter' ? (
          <View style={styles.bottomActions}>
            <Button title="Reset" variant="ghost" size="medium" onPress={handleReset} style={{ flex: 1 }} />
            <Button title="Apply" variant="primary" size="medium" onPress={handleApply} style={{ flex: 1 }} />
          </View>
        ) : undefined
      }
    >
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'filter' && { borderBottomColor: colors.action.primary }]}
          onPress={() => onTabChange('filter')}
        >
          <AppText variant="body" style={{ color: activeTab === 'filter' ? colors.action.primary : colors.text.secondary, fontWeight: activeTab === 'filter' ? '600' : '400' }}>Filter</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sort' && { borderBottomColor: colors.action.primary }]}
          onPress={() => onTabChange('sort')}
        >
          <AppText variant="body" style={{ color: activeTab === 'sort' ? colors.action.primary : colors.text.secondary, fontWeight: activeTab === 'sort' ? '600' : '400' }}>Sort</AppText>
        </TouchableOpacity>
      </View>

      {activeTab === 'sort' && (
        <View style={styles.section}>
          {SORT_OPTIONS.map((opt) => {
            const active = sortBy === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionRow, { paddingVertical: spacing.md, borderBottomColor: colors.border.light, borderBottomWidth: 1 }]}
                onPress={() => { onSortChange(opt.value); onClose(); }}
              >
                <AppText variant="body" style={{ color: colors.text.primary, flex: 1 }}>{opt.label}</AppText>
                {active && <AppText variant="body" style={{ color: colors.action.primary }}>✓</AppText>}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {activeTab === 'filter' && (
        <View style={styles.section}>
          <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>Specialization</AppText>
          <View style={styles.chipRow}>
            {SPECIALIZATIONS.map((spec) => {
              const active = filter.specialization === spec;
              return (
                <TouchableOpacity
                  key={spec}
                  style={[styles.chip, { borderColor: active ? colors.action.primary : colors.border.default, backgroundColor: active ? colors.action.primarySoft : 'transparent' }]}
                  onPress={() => onFilterChange({ ...filter, specialization: active ? null : spec })}
                >
                  <AppText variant="bodySmall" style={{ color: active ? colors.action.primary : colors.text.primary }}>{spec}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppText variant="label" style={{ color: colors.text.secondary, marginTop: spacing.lg, marginBottom: spacing.sm }}>Rating</AppText>
          <View style={styles.chipRow}>
            {RATING_OPTIONS.map((opt) => {
              const active = filter.minRating === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, { borderColor: active ? colors.action.primary : colors.border.default, backgroundColor: active ? colors.action.primarySoft : 'transparent' }]}
                  onPress={() => onFilterChange({ ...filter, minRating: active ? null : opt.value })}
                >
                  <AppText variant="bodySmall" style={{ color: active ? colors.action.primary : colors.text.primary }}>{opt.label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppText variant="label" style={{ color: colors.text.secondary, marginTop: spacing.lg, marginBottom: spacing.sm }}>Max Fee</AppText>
          <View style={styles.chipRow}>
            {FEE_OPTIONS.map((opt) => {
              const active = filter.maxFee === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, { borderColor: active ? colors.action.primary : colors.border.default, backgroundColor: active ? colors.action.primarySoft : 'transparent' }]}
                  onPress={() => onFilterChange({ ...filter, maxFee: active ? null : opt.value })}
                >
                  <AppText variant="bodySmall" style={{ color: active ? colors.action.primary : colors.text.primary }}>{opt.label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppText variant="label" style={{ color: colors.text.secondary, marginTop: spacing.lg, marginBottom: spacing.sm }}>Experience</AppText>
          <View style={styles.chipRow}>
            {EXP_OPTIONS.map((opt) => {
              const active = filter.minExperience === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, { borderColor: active ? colors.action.primary : colors.border.default, backgroundColor: active ? colors.action.primarySoft : 'transparent' }]}
                  onPress={() => onFilterChange({ ...filter, minExperience: active ? null : opt.value })}
                >
                  <AppText variant="bodySmall" style={{ color: active ? colors.action.primary : colors.text.primary }}>{opt.label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  section: { paddingTop: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
  bottomActions: { flexDirection: 'row', gap: 12 },
});
