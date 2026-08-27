// Health Records Module - Record Type Chip

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { HealthRecordType, RECORD_TYPE_COLORS, RECORD_TYPE_LABELS } from '../types';

interface RecordTypeChipProps {
  type: HealthRecordType;
  selected?: boolean;
}

export function RecordTypeChip({ type, selected = false }: RecordTypeChipProps) {
  const colors = RECORD_TYPE_COLORS[type];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: selected ? colors.bg : 'transparent',
          borderColor: colors.bg,
        },
      ]}
    >
      <AppText variant="caption" style={{ color: colors.text }}>
        {RECORD_TYPE_LABELS[type]}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
