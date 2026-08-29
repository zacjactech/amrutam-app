// Health Records Module - Health Record Card

import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { HealthRecord } from '../types';
import { RecordTypeChip } from './RecordTypeChip';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface HealthRecordCardProps {
  record: HealthRecord;
  onPress: (record: HealthRecord) => void;
}

export const HealthRecordCard = memo(function HealthRecordCard({ record, onPress }: HealthRecordCardProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md, marginHorizontal: spacing.lg, marginVertical: spacing.sm }]}
      onPress={() => onPress(record)}
      activeOpacity={0.7}
      accessibilityLabel={`View ${record.title}`}
      accessibilityRole="button"
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="body" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
            {record.title}
          </AppText>
          <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
            {new Date(record.occurredAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </AppText>
        </View>
        <RecordTypeChip type={record.type} />
      </View>
      {record.description && (
        <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginTop: spacing.sm }} numberOfLines={2}>
          {record.description}
        </AppText>
      )}
      {record.tags.length > 0 && (
        <View style={styles.tagRow}>
          {record.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.background.secondary, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 4 }]}>
              <AppText variant="caption" style={{ color: colors.text.secondary }}>
                #{tag}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {},
});
