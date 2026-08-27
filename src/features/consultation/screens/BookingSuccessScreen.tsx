// Consultation Module - Booking Success Screen (C08)

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { BookingConfirmedIllustration } from '../../../shared/components/Illustrations';

interface BookingSuccessScreenProps {
  doctorName: string;
  doctorPhoto: string;
  date: string;
  time: string;
  duration: string;
  bookingId: string;
  onViewConsultation: () => void;
  onBackToHome: () => void;
}

export function BookingSuccessScreen({
  doctorName,
  doctorPhoto,
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
          <BookingConfirmedIllustration size={180} />
        </View>

        <AppText variant="h1" style={{ textAlign: 'center', marginTop: spacing.lg }}>Consultation booked!</AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxl }}>
          Your consultation with {doctorName} has been confirmed.
        </AppText>

        <View style={[styles.detailsCard, { marginHorizontal: spacing.lg, backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.lg }]}>
          <View style={styles.doctorRow}>
            <Image source={{ uri: doctorPhoto }} style={[styles.avatar, { borderRadius: spacing.md }]} contentFit="cover" />
            <View style={{ marginLeft: 12 }}>
              <AppText variant="body" style={{ fontWeight: '600' }}>{doctorName}</AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.default, marginVertical: spacing.md }]} />

          {[
            { label: 'Date', value: date },
            { label: 'Time', value: time },
            { label: 'Duration', value: duration },
            { label: 'Booking ID', value: bookingId },
          ].map((row) => (
            <View key={row.label} style={[styles.detailRow, { paddingVertical: spacing.sm }]}>
              <AppText variant="body" style={{ color: colors.text.secondary }}>{row.label}</AppText>
              <AppText variant="body" style={{ color: colors.text.primary }}>{row.value}</AppText>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { flexDirection: 'row', padding: spacing.lg, gap: spacing.md, backgroundColor: colors.surface.default, borderTopColor: colors.border.default }]}>
        <Button
          title="View Consultation"
          variant="primary"
          size="large"
          onPress={onViewConsultation}
          style={{ flex: 1 }}
        />
        <Button
          title="Back to Home"
          variant="outline"
          size="large"
          onPress={onBackToHome}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },
  detailsCard: { width: '100%' },
  doctorRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, backgroundColor: '#E8F3EC' },
  divider: { height: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footer: { borderTopWidth: 1 },
});
