// Consultation Module - Cancellation Success Screen (C14)

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { CheckCircleFilled } from '../../../shared/assets/icons';

interface CancellationSuccessScreenProps {
  doctorName: string;
  onBackToConsultations: () => void;
}

export function CancellationSuccessScreen({
  doctorName,
  onBackToConsultations,
}: CancellationSuccessScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 100, alignItems: 'center' }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.status.errorSoft,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CheckCircleFilled width={56} height={56} color={colors.status.error} />
          </View>
        </View>

        <AppText
          variant="h1"
          style={{ textAlign: 'center', marginTop: spacing.xl }}
        >
          Consultation cancelled
        </AppText>
        <AppText
          variant="body"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            marginTop: spacing.sm,
            marginBottom: spacing.xxl,
            lineHeight: 22,
            paddingHorizontal: spacing.xl,
          }}
        >
          Your consultation with {doctorName} has been cancelled. You will receive a confirmation by SMS.
        </AppText>

        <View style={{ paddingHorizontal: spacing.xxl }}>
          <Button
            title="Back to Consultations"
            variant="primary"
            size="large"
            onPress={onBackToConsultations}
            style={{ width: '100%' }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },
});
