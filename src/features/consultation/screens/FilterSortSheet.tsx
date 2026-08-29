// Consultation Module - Filter/Sort Bottom Sheet

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheet } from '../../../shared/components/BottomSheet';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { DoctorFilter, SPECIALIZATIONS, DEFAULT_DOCTOR_FILTER } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { IconCheckContainer } from '../../../shared/assets/icons';

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

const EXPERIENCE_OPTIONS = [
  { value: null as null, label: 'Any' },
  { value: 5 as const, label: '1-5 yrs' },
  { value: 10 as const, label: '5-10 yrs' },
  { value: 20 as const, label: '10+ yrs' },
];

const AVAILABILITY_OPTIONS = [
  { value: false, label: 'Any' },
  { value: true, label: 'Available now' },
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
            <Button
              title="Reset"
              variant="ghost"
              size="medium"
              onPress={handleReset}
              style={{ flex: 1 }}
            />
            <Button
              title="Show results"
              variant="primary"
              size="medium"
              onPress={handleApply}
              style={{ flex: 2 }}
            />
          </View>
        ) : undefined
      }
    >
      <View style={[styles.tabs, { borderBottomColor: colors.border.default }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'filter' && {
              borderBottomColor: colors.action.primary,
            },
          ]}
          onPress={() => onTabChange('filter')}
          accessibilityLabel="Filter tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'filter' }}
        >
          <AppText
            variant="body"
            style={{
              color:
                activeTab === 'filter'
                  ? colors.action.primary
                  : colors.text.secondary,
              fontWeight: activeTab === 'filter' ? '600' : '400',
            }}
          >
            Filter
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'sort' && {
              borderBottomColor: colors.action.primary,
            },
          ]}
          onPress={() => onTabChange('sort')}
          accessibilityLabel="Sort tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'sort' }}
        >
          <AppText
            variant="body"
            style={{
              color:
                activeTab === 'sort'
                  ? colors.action.primary
                  : colors.text.secondary,
              fontWeight: activeTab === 'sort' ? '600' : '400',
            }}
          >
            Sort
          </AppText>
        </TouchableOpacity>
      </View>

      {activeTab === 'sort' && (
        <View style={styles.section}>
          {SORT_OPTIONS.map((opt) => {
            const active = sortBy === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionRow,
                  {
                    paddingVertical: spacing.md,
                    borderBottomColor: colors.border.light,
                    borderBottomWidth: 1,
                  },
                ]}
                onPress={() => {
                  onSortChange(opt.value);
                  onClose();
                }}
                accessibilityLabel={`Sort by ${opt.label}`}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <AppText
                  variant="body"
                  style={{ color: colors.text.primary, flex: 1 }}
                >
                  {opt.label}
                </AppText>
                {active && (
                  <IconCheckContainer
                    width={18}
                    height={18}
                    color={colors.action.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {activeTab === 'filter' && (
        <View style={styles.section}>
          <AppText
            variant="label"
            style={{
              color: colors.text.secondary,
              marginBottom: spacing.sm,
              textTransform: 'uppercase',
            }}
          >
            Specialization
          </AppText>
          <View style={styles.chipRow}>
            {SPECIALIZATIONS.map((spec) => {
              const active = filter.specialization === spec;
              return (
                <TouchableOpacity
                  key={spec}
                  style={[
                    styles.chip,
                    {
                      borderColor: active
                        ? colors.action.primary
                        : colors.border.default,
                      backgroundColor: active
                        ? colors.action.primarySoft
                        : 'transparent',
                    },
                  ]}
                  onPress={() =>
                    onFilterChange({
                      ...filter,
                      specialization: active ? null : spec,
                    })
                  }
                  accessibilityLabel={`Filter by ${spec}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <AppText
                    variant="bodySmall"
                    style={{
                      color: active
                        ? colors.action.primary
                        : colors.text.primary,
                    }}
                  >
                    {spec}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppText
            variant="label"
            style={{
              color: colors.text.secondary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm,
              textTransform: 'uppercase',
            }}
          >
            Experience
          </AppText>
          {EXPERIENCE_OPTIONS.map((opt) => {
            const active = filter.minExperience === opt.value;
            return (
              <TouchableOpacity
                key={opt.label}
                style={[
                  styles.radioRow,
                  {
                    paddingVertical: spacing.md,
                    borderBottomColor: colors.border.light,
                    borderBottomWidth: 1,
                  },
                ]}
                onPress={() =>
                  onFilterChange({
                    ...filter,
                    minExperience: active ? null : opt.value,
                  })
                }
                accessibilityLabel={`Filter by experience ${opt.label}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                <AppText
                  variant="body"
                  style={{ color: colors.text.primary, flex: 1 }}
                >
                  {opt.label}
                </AppText>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: active
                        ? colors.action.primary
                        : colors.border.default,
                      backgroundColor: active
                        ? colors.action.primary
                        : 'transparent',
                    },
                  ]}
                >
                  {active && <View style={[styles.radioDot, { backgroundColor: colors.text.inverse }]} />}
                </View>
              </TouchableOpacity>
            );
          })}

          <AppText
            variant="label"
            style={{
              color: colors.text.secondary,
              marginTop: spacing.lg,
              marginBottom: spacing.sm,
              textTransform: 'uppercase',
            }}
          >
            Availability
          </AppText>
          {AVAILABILITY_OPTIONS.map((opt) => {
            const active = filter.availableOnly === opt.value;
            return (
              <TouchableOpacity
                key={opt.label}
                style={[
                  styles.radioRow,
                  {
                    paddingVertical: spacing.md,
                    borderBottomColor: colors.border.light,
                    borderBottomWidth: 1,
                  },
                ]}
                onPress={() =>
                  onFilterChange({
                    ...filter,
                    availableOnly: opt.value as boolean,
                  })
                }
                accessibilityLabel={`Filter by availability ${opt.label}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                <AppText
                  variant="body"
                  style={{ color: colors.text.primary, flex: 1 }}
                >
                  {opt.label}
                </AppText>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: active
                        ? colors.action.primary
                        : colors.border.default,
                      backgroundColor: active
                        ? colors.action.primary
                        : 'transparent',
                    },
                  ]}
                >
                  {active && <View style={[styles.radioDot, { backgroundColor: colors.text.inverse }]} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  section: { paddingTop: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
  radioRow: { flexDirection: 'row', alignItems: 'center' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomActions: { flexDirection: 'row', gap: 12 },
});
