// Consultation Module - Booking Conflict Modal (C09)

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface BookingConflictModalProps {
  visible: boolean;
  onClose: () => void;
  onChooseAnother: () => void;
}

export function BookingConflictModal({
  visible,
  onClose,
  onChooseAnother,
}: BookingConflictModalProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  const warningIcon = (
    <View style={[styles.iconContainer, { backgroundColor: colors.status.warningSoft }]}>
      <AppText variant="h1" style={{ color: colors.status.warning }}>⚠</AppText>
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Unable to book this slot"
      description="This time slot has just been booked by someone else. Please choose a different time slot to continue."
      icon={warningIcon}
      primaryAction={
        <Button
          title="Choose Another Slot"
          variant="primary"
          size="medium"
          onPress={onChooseAnother}
          style={{ minWidth: 160 }}
        />
      }
      secondaryAction={
        <Button
          title="Close"
          variant="outline"
          size="medium"
          onPress={onClose}
          style={{ minWidth: 100 }}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
