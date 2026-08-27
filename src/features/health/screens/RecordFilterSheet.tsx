// Health Records Module - Record Filter Bottom Sheet

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheet } from '../../../shared/components/BottomSheet';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { HealthRecordType, RECORD_TYPE_LABELS, HEALTH_RECORD_TYPES } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

const RECORD_TYPE_ICONS: Record<HealthRecordType, string> = {
  lab_report: '🔬',
  prescription: '💊',
  consultation: '🩺',
  vaccination: '💉',
  allergy: '⚠️',
};

const RECORD_TYPE_COLORS: Record<HealthRecordType, string> = {
  lab_report: '#3B82F6',
  prescription: '#2D6A4F',
  consultation: '#7C3AED',
  vaccination: '#06B6D4',
  allergy: '#F97316',
};

interface RecordFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedTypes: HealthRecordType[];
  onApply: (types: HealthRecordType[]) => void;
  onReset: () => void;
  recordCounts: Record<HealthRecordType, number>;
}

export function RecordFilterSheet({
  visible,
  onClose,
  selectedTypes,
  onApply,
  onReset,
  recordCounts,
}: RecordFilterSheetProps) {
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

  const handleReset = useCallback(() => {
    setLocalTypes([]);
    onReset();
  }, [onReset]);

  const handleApply = useCallback(() => {
    onApply(localTypes);
    onClose();
  }, [localTypes, onApply, onClose]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Filter Records"
      bottomAction={
        <View style={styles.bottomActions}>
          <Button title="Reset" variant="ghost" size="medium" onPress={handleReset} style={{ flex: 1 }} />
          <Button title="Apply Filters" variant="primary" size="medium" onPress={handleApply} style={{ flex: 2 }} />
        </View>
      }
    >
      <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase' }}>
        Record Type
      </AppText>

      {HEALTH_RECORD_TYPES.map((type) => {
        const isSelected = localTypes.includes(type);
        const typeColor = RECORD_TYPE_COLORS[type];
        const count = recordCounts[type] ?? 0;

        return (
          <TouchableOpacity
            key={type}
            onPress={() => toggleType(type)}
            activeOpacity={0.7}
            style={[
              styles.typeRow,
              {
                backgroundColor: isSelected ? typeColor + '10' : colors.surface.default,
                borderColor: isSelected ? typeColor : colors.border.default,
                borderWidth: isSelected ? 1.5 : 1,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.md,
                borderRadius: spacing.md,
                marginBottom: spacing.sm,
              },
            ]}
          >
            <View style={[styles.typeIconContainer, { backgroundColor: typeColor + '20', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }]}>
              <AppText variant="h3">{RECORD_TYPE_ICONS[type]}</AppText>
            </View>

            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600' }}>
                {RECORD_TYPE_LABELS[type]}
              </AppText>
              <AppText variant="caption" style={{ color: colors.text.secondary }}>
                {count.toLocaleString()} records
              </AppText>
            </View>

            <View
              style={[
                styles.checkbox,
                {
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: isSelected ? typeColor : colors.border.default,
                  backgroundColor: isSelected ? typeColor : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              {isSelected && (
                <AppText variant="caption" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                  ✓
                </AppText>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconContainer: {},
  checkbox: {},
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
