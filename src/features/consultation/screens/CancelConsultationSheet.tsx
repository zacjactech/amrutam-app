// Consultation Module - Cancel Consultation Bottom Sheet (C13)

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheet } from '../../../shared/components/BottomSheet';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { AlertCircle } from '../../../shared/assets/icons';

interface CancelConsultationSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
  doctorName: string;
  consultationDate: string;
}

export function CancelConsultationSheet({
  visible,
  onClose,
  onConfirmCancel,
  doctorName,
  consultationDate,
}: CancelConsultationSheetProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  const handleConfirm = useCallback(() => {
    onConfirmCancel();
    onClose();
  }, [onConfirmCancel, onClose]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title=""
      bottomAction={
        <View style={styles.bottomActions}>
          <Button
            title="Cancel Consultation"
            variant="primary"
            size="medium"
            onPress={handleConfirm}
            style={{
              flex: 1,
              backgroundColor: colors.action.destructive,
            }}
            textStyle={{ color: colors.surface.default }}
          />
          <Button
            title="Keep Consultation"
            variant="outline"
            size="medium"
            onPress={onClose}
            style={{ flex: 1 }}
          />
        </View>
      }
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.action.destructiveSoft },
          ]}
        >
          <AlertCircle width={32} height={32} color={colors.action.destructive} />
        </View>

        <AppText
          variant="h3"
          style={{ textAlign: 'center', marginTop: spacing.md }}
        >
          Cancel consultation?
        </AppText>

        <AppText
          variant="body"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            marginTop: spacing.sm,
            lineHeight: 22,
          }}
        >
          Are you sure you want to cancel your consultation with {doctorName} on{' '}
          {consultationDate}? This action cannot be undone.
        </AppText>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', paddingVertical: 16 },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomActions: { flexDirection: 'row', gap: 12 },
});
