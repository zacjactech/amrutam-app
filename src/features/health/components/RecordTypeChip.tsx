// Health Records Module - Record Type Chip

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { HealthRecordType, RECORD_TYPE_LABELS } from '../types';
import { useThemeColors } from '../../../shared/components/ThemeProvider';

type RecordColorKey = 'lab' | 'labSoft' | 'prescription' | 'prescriptionSoft' | 'consultation' | 'consultationSoft' | 'vaccination' | 'vaccinationSoft' | 'allergy' | 'allergySoft';

const RECORD_TYPE_THEME: Record<HealthRecordType, { color: RecordColorKey; soft: RecordColorKey }> = {
  lab_report: { color: 'lab', soft: 'labSoft' },
  prescription: { color: 'prescription', soft: 'prescriptionSoft' },
  consultation: { color: 'consultation', soft: 'consultationSoft' },
  vaccination: { color: 'vaccination', soft: 'vaccinationSoft' },
  allergy: { color: 'allergy', soft: 'allergySoft' },
};

interface RecordTypeChipProps {
  type: HealthRecordType;
  selected?: boolean;
}

export function RecordTypeChip({ type, selected = false }: RecordTypeChipProps): React.JSX.Element {
  const colors = useThemeColors();
  const theme = RECORD_TYPE_THEME[type];
  const bgColor = colors.record[theme.soft];
  const textColor = colors.record[theme.color];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: selected ? bgColor : 'transparent',
          borderColor: bgColor,
        },
      ]}
    >
      <AppText variant="caption" style={{ color: textColor }}>
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
