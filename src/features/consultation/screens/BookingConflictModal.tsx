// Consultation Module - Booking Conflict Modal (C09)

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { AlertTriangle } from '../../../shared/assets/icons';
import { useThemeColors } from '../../../shared/components/ThemeProvider';

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

  const warningIcon = (
    <View
      style={[
        styles.iconContainer,
        { backgroundColor: colors.status.warningSoft },
      ]}
    >
      <AlertTriangle width={32} height={32} color={colors.status.warning} />
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Unable to book this slot"
      description="This time slot is no longer available — another appointment may have taken it."
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
