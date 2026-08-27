// Consultation Module - Cancellation Success Screen (C14)

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface CancellationSuccessScreenProps {
  onBackToConsultations: () => void;
}

export function CancellationSuccessScreen({
  onBackToConsultations,
}: CancellationSuccessScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2', marginTop: 100 }]}>
          <View style={[styles.checkCircle, { backgroundColor: colors.action.destructive }]}>
            <AppText variant="h1" style={{ color: '#FFFFFF' }}>✓</AppText>
          </View>
        </View>

        <AppText variant="h1" style={{ textAlign: 'center', marginTop: spacing.xl }}>Consultation cancelled</AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxl, lineHeight: 22, paddingHorizontal: spacing.xl }}>
          Your consultation has been successfully cancelled. If you have any questions, please contact our support team.
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
  iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  checkCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
});
