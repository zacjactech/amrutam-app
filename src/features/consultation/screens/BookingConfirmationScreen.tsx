// Consultation Module - Booking Confirmation Screen (C07)

import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useDoctor, useBookConsultation } from '../hooks';
import { ConsultationSlot } from '../types';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppErrorState } from '../../../shared/components';
import { useToast } from '../../../shared/components/Toast';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface BookingConfirmationScreenProps {
  doctorId: string;
  slot: ConsultationSlot;
  onBack: () => void;
  onBookingSuccess: (bookingId: string) => void;
  onConflict: () => void;
}

export function BookingConfirmationScreen({
  doctorId,
  slot,
  onBack,
  onBookingSuccess,
  onConflict,
}: BookingConfirmationScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { showToast } = useToast();
  const { data: doctor, isLoading: doctorLoading } = useDoctor(doctorId);
  const bookMutation = useBookConsultation();

  const slotDate = new Date(slot.startTime);
  const dateStr = slotDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = slotDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const handleConfirm = useCallback(async () => {
    if (doctor === null || doctor === undefined) return;

    try {
      const booking = await bookMutation.mutateAsync({
        doctorId: doctor.id,
        patientId: 'patient_001',
        slotId: slot.id,
        consultationType: slot.consultationType,
      });
      onBookingSuccess(booking.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Booking failed';
      if (msg.toLowerCase().includes('conflict') || msg.toLowerCase().includes('already booked')) {
        onConflict();
      } else {
        showToast(msg, 'error');
      }
    }
  }, [doctor, slot, bookMutation, onBookingSuccess, onConflict, showToast]);

  if (doctorLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
      </View>
    );
  }

  if (doctor === null || doctor === undefined) {
    return (
      <AppErrorState
        title="Failed to load"
        message="Could not load booking details."
        type="retryable"
        onRetry={onBack}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.sm }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <AppText variant="body" style={{ color: colors.action.primary }}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="h1">Confirm Consultation</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.doctorCard, { marginHorizontal: spacing.lg, backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.lg, flexDirection: 'row', alignItems: 'center' }]}>
          <Image source={{ uri: doctor.photoUrl }} style={[styles.avatar, { borderRadius: spacing.md }]} contentFit="cover" />
          <View style={styles.doctorInfo}>
            <AppText variant="body" style={{ fontWeight: '600' }}>{doctor.name}</AppText>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>{doctor.specialization}</AppText>
          </View>
        </View>

        <View style={[styles.detailsCard, { marginHorizontal: spacing.lg, marginTop: spacing.md, backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.lg }]}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>Booking Details</AppText>

          {[
            { label: 'Date', value: dateStr },
            { label: 'Time', value: timeStr },
            { label: 'Duration', value: `${slot.consultationType === 'video' ? '30 min' : '20 min'}` },
            { label: 'Type', value: slot.consultationType.charAt(0).toUpperCase() + slot.consultationType.slice(1) },
            { label: 'Fee', value: `₹${doctor.consultationFee}`, isFee: true },
            { label: 'Payment', value: 'Pay at clinic' },
          ].map((row) => (
            <View key={row.label} style={[styles.detailRow, { borderBottomColor: colors.border.light, borderBottomWidth: 1, paddingVertical: spacing.md }]}>
              <AppText variant="body" style={{ color: colors.text.secondary }}>{row.label}</AppText>
              <AppText
                variant="body"
                style={{ color: row.isFee ? colors.action.primary : colors.text.primary, fontWeight: row.isFee ? '700' : '500' }}
              >
                {row.value}
              </AppText>
            </View>
          ))}
        </View>

        <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.xl, paddingHorizontal: spacing.md }}>
          <AppText variant="bodySmall" style={{ color: colors.text.tertiary, textAlign: 'center', lineHeight: 18 }}>
            By confirming, you agree to our Terms of Service and Privacy Policy. Consultation fees are non-refundable once the session begins.
          </AppText>
        </View>
      </ScrollView>

      <View style={[styles.stickyFooter, { backgroundColor: colors.surface.default, borderTopColor: colors.border.default, padding: spacing.lg }]}>
        <Button
          title={bookMutation.isPending ? 'Booking...' : 'Confirm Booking'}
          variant="primary"
          size="large"
          onPress={handleConfirm}
          disabled={bookMutation.isPending}
          loading={bookMutation.isPending}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 4 },
  scroll: { paddingBottom: 120 },
  doctorCard: {},
  avatar: { width: 56, height: 56, backgroundColor: '#E8F3EC' },
  doctorInfo: { marginLeft: 14, flex: 1 },
  detailsCard: {},
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1 },
});
