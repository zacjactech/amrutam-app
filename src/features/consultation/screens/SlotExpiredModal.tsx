// Consultation Module - Slot Expired Modal (C10)

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { ClockCircle } from '../../../shared/assets/icons';
import { useThemeColors } from '../../../shared/components/ThemeProvider';

interface SlotExpiredModalProps {
  visible: boolean;
  onClose: () => void;
  onChooseAnother: () => void;
}

export function SlotExpiredModal({
  visible,
  onClose,
  onChooseAnother,
}: SlotExpiredModalProps): React.JSX.Element {
  const colors = useThemeColors();

  const clockIcon = (
    <View
      style={[
        styles.iconContainer,
        { backgroundColor: colors.background.secondary },
      ]}
    >
      <ClockCircle width={32} height={32} color={colors.text.tertiary} />
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Slot expired"
      description="This consultation slot has already passed. Please choose another available time."
      icon={clockIcon}
      primaryAction={
        <Button
          title="Choose Another Time"
          variant="primary"
          size="medium"
          onPress={onChooseAnother}
          style={{ minWidth: 200 }}
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
