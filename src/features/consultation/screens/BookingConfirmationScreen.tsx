// Consultation Module - Booking Confirmation Screen

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { Booking, Doctor } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface BookingConfirmationScreenProps {
  booking: Booking;
  doctor: Doctor;
  onDone: () => void;
  onViewConsultations: () => void;
}

export function BookingConfirmationScreen({
  booking,
  doctor,
  onDone,
  onViewConsultations,
}: BookingConfirmationScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const slotTime = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={[styles.content, { padding: spacing.xxl, alignItems: 'center' }]}>
        <View style={[styles.successIcon, { backgroundColor: colors.action.primarySoft, marginTop: 40, marginBottom: spacing.lg }]}>
          <AppText variant="h2" style={{ color: colors.action.primary }}>✓</AppText>
        </View>

        <AppText variant="h2" style={{ marginBottom: spacing.sm, textAlign: 'center' }}>
          Booking Confirmed!
        </AppText>
        <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xxl }}>
          Your consultation has been scheduled successfully
        </AppText>

        <View style={[styles.card, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.lg }]}>
          <View style={styles.doctorRow}>
            <Image
              source={{ uri: doctor.photoUrl }}
              style={styles.photo}
              contentFit="cover"
            />
            <View style={styles.doctorInfo}>
              <AppText variant="body" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>{doctor.name}</AppText>
              <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>{doctor.specialization}</AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.default, marginVertical: spacing.md }]} />

          <View style={styles.detailRow}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>Date</AppText>
            <AppText variant="body" style={{ color: colors.text.primary }}>{slotTime}</AppText>
          </View>

          <View style={styles.detailRow}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>Type</AppText>
            <AppText variant="body" style={{ color: colors.text.primary }}>
              {booking.consultationType.charAt(0).toUpperCase() + booking.consultationType.slice(1)}
            </AppText>
          </View>

          <View style={styles.detailRow}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>Fee</AppText>
            <AppText variant="body" style={{ color: colors.text.primary }}>₹{doctor.consultationFee}</AppText>
          </View>

          <View style={styles.detailRow}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>Status</AppText>
            <View style={[styles.statusBadge, { backgroundColor: colors.action.primarySoft, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 4 }]}>
              <AppText variant="caption" style={{ color: colors.action.primary }}>
                {booking.status === 'pending_sync' ? 'Queued' : 'Confirmed'}
              </AppText>
            </View>
          </View>

          <View style={styles.detailRow}>
            <AppText variant="body" style={{ color: colors.text.secondary }}>Booking ID</AppText>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>{booking.id.slice(0, 16)}</AppText>
          </View>
        </View>

        {booking.status === 'pending_sync' && (
          <View style={[styles.offlineNotice, { marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.status.warning + '20', borderRadius: spacing.sm, width: '100%' }]}>
            <AppText variant="bodySmall" style={{ color: colors.status.warning, textAlign: 'center' }}>
              You're offline. This booking will sync when you reconnect.
            </AppText>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { flexDirection: 'row', padding: spacing.lg, gap: spacing.md, backgroundColor: colors.surface.default, borderTopColor: colors.border.default }]}>
        <Button
          title="View My Consultations"
          variant="outline"
          size="large"
          onPress={onViewConsultations}
          style={styles.footerButton}
        />
        <Button
          title="Done"
          variant="primary"
          size="large"
          onPress={onDone}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E8F3EC',
    marginRight: 12,
  },
  doctorInfo: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statusBadge: {},
  offlineNotice: {},
  footer: {
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
  },
});
