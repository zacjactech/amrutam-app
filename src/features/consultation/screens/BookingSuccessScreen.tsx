// Consultation Module - Booking Success Screen (C08)

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { CheckCircleFilled } from '../../../shared/assets/icons';

interface BookingSuccessScreenProps {
  doctorName: string;
  date: string;
  time: string;
  duration: string;
  bookingId: string;
  onViewConsultation: () => void;
  onBackToHome: () => void;
}

export function BookingSuccessScreen({
  doctorName,
  date,
  time,
  duration,
  bookingId,
  onViewConsultation,
  onBackToHome,
}: BookingSuccessScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 60, alignItems: 'center' }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: colors.status.successSoft,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CheckCircleFilled width={56} height={56} color={colors.status.success} />
          </View>
        </View>

        <AppText
          variant="h1"
          style={{ textAlign: 'center', marginTop: spacing.xl }}
        >
          Consultation booked!
        </AppText>
        <AppText
          variant="body"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            marginTop: spacing.sm,
            marginBottom: spacing.xxl,
          }}
        >
          Your consultation with {doctorName} is confirmed.
        </AppText>

        <View
          style={[
            styles.detailsCard,
            {
              marginHorizontal: spacing.lg,
              backgroundColor: colors.surface.default,
              borderRadius: spacing.md,
              padding: spacing.lg,
            },
          ]}
        >
          {[
            { label: 'Doctor', value: doctorName },
            { label: 'Date', value: date },
            { label: 'Time', value: time },
            { label: 'Duration', value: duration },
            { label: 'Booking ID', value: bookingId },
          ].map((row) => (
            <View
              key={row.label}
              style={[
                styles.detailRow,
                {
                  paddingVertical: spacing.sm,
                  borderBottomColor: colors.border.light,
                  borderBottomWidth: row.label !== 'Booking ID' ? 1 : 0,
                },
              ]}
            >
              <AppText
                variant="body"
                style={{ color: colors.text.secondary }}
              >
                {row.label}
              </AppText>
              <AppText
                variant="body"
                style={{
                  color: colors.text.primary,
                  fontWeight: row.label === 'Booking ID' ? '600' : '400',
                }}
              >
                {row.value}
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            padding: spacing.lg,
            backgroundColor: colors.surface.default,
            borderTopColor: colors.border.default,
          },
        ]}
      >
        <Button
          title="View Consultation"
          variant="primary"
          size="large"
          onPress={onViewConsultation}
          style={{ width: '100%', marginBottom: spacing.sm }}
        />
        <Button
          title="Back to Home"
          variant="outline"
          size="large"
          onPress={onBackToHome}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },
  detailsCard: { width: '100%' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footer: { borderTopWidth: 1 },
});
