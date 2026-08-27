// Consultation Module - Consultation Details Screen (C12)

import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useDoctor, useBookings, useCancelConsultation } from '../hooks';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppErrorState } from '../../../shared/components';
import { useToast } from '../../../shared/components/Toast';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface ConsultationDetailsScreenProps {
  bookingId: string;
  onBack: () => void;
  onCancel: (bookingId: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'confirmed' | 'pending' | 'cancelled' | 'completed' }> = {
  pending_confirmation: { label: 'Pending', variant: 'pending' },
  confirmed: { label: 'Confirmed', variant: 'confirmed' },
  pending_sync: { label: 'Confirmed', variant: 'confirmed' },
  cancelled: { label: 'Cancelled', variant: 'cancelled' },
  completed: { label: 'Completed', variant: 'completed' },
  no_show: { label: 'No Show', variant: 'cancelled' },
};

export function ConsultationDetailsScreen({
  bookingId,
  onBack,
  onCancel,
}: ConsultationDetailsScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { showToast } = useToast();

  const { data: bookings = [], isLoading: bookingsLoading } = useBookings('patient_001');
  const booking = bookings.find((b) => b.id === bookingId);
  const doctorId = booking?.doctorId ?? '';
  const { data: doctor, isLoading: doctorLoading } = useDoctor(doctorId);

  const isLoadingData = bookingsLoading || doctorLoading;

  const statusConfig = booking !== undefined ? STATUS_CONFIG[booking.status] : undefined;

  const slotDate = booking !== undefined ? new Date(booking.createdAt) : new Date();
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

  const canCancel = booking !== undefined && (booking.status === 'confirmed' || booking.status === 'pending_confirmation');

  const handleCancel = useCallback(() => {
    if (booking !== undefined) {
      onCancel(booking.id);
    }
  }, [booking, onCancel]);

  if (isLoadingData) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
      </View>
    );
  }

  if (booking === undefined || doctor === null || doctor === undefined || statusConfig === undefined) {
    return (
      <AppErrorState
        title="Consultation not found"
        message="This consultation may have been removed."
        type="retryable"
        onRetry={onBack}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.sm }]}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <AppText variant="body" style={{ color: colors.action.primary }}>←</AppText>
          </TouchableOpacity>
          <AppText variant="h1">Consultation Details</AppText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.doctorCard, { marginHorizontal: spacing.lg, backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.lg, flexDirection: 'row', alignItems: 'center' }]}>
          <Image source={{ uri: doctor.photoUrl }} style={[styles.avatar, { borderRadius: spacing.md }]} contentFit="cover" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <AppText variant="body" style={{ fontWeight: '600' }}>{doctor.name}</AppText>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>{doctor.specialization}</AppText>
          </View>
        </View>

        <View style={[styles.detailsCard, { marginHorizontal: spacing.lg, marginTop: spacing.md, backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.lg }]}>
          {[
            { icon: '📅', label: 'Date', value: dateStr },
            { icon: '🕐', label: 'Time', value: timeStr },
            { icon: '⏱', label: 'Duration', value: '30 minutes' },
            { icon: '📹', label: 'Mode', value: booking.consultationType.charAt(0).toUpperCase() + booking.consultationType.slice(1) },
            { icon: '💰', label: 'Fee', value: `₹${doctor.consultationFee}`, isFee: true },
            { icon: '🔑', label: 'Booking ID', value: booking.id.slice(0, 16) },
            { icon: '📋', label: 'Status', value: statusConfig.label },
          ].map((row) => (
            <View key={row.label} style={[styles.detailRow, { borderBottomColor: colors.border.light, borderBottomWidth: 1, paddingVertical: spacing.md }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AppText variant="body" style={{ marginRight: spacing.sm }}>{row.icon}</AppText>
                <AppText variant="body" style={{ color: colors.text.secondary }}>{row.label}</AppText>
              </View>
              <AppText
                variant="body"
                style={{
                  color: row.isFee ? colors.action.primary : colors.text.primary,
                  fontWeight: row.isFee ? '700' : '500',
                }}
              >
                {row.value}
              </AppText>
            </View>
          ))}
        </View>

        {booking.status === 'confirmed' && (
          <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg }}>
            <Button
              title="Join Consultation"
              variant="primary"
              size="large"
              onPress={() => {}}
              disabled={true}
              style={{ width: '100%' }}
            />
            <AppText variant="bodySmall" style={{ color: colors.text.tertiary, textAlign: 'center', marginTop: spacing.sm }}>
              Enabled 15 minutes before the start time
            </AppText>
          </View>
        )}

        {canCancel && (
          <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg }}>
            <Button
              title="Cancel Consultation"
              variant="outline"
              size="large"
              onPress={handleCancel}
              style={{ width: '100%', borderColor: colors.action.destructive }}
              textStyle={{ color: colors.action.destructive }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {},
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 4 },
  scroll: { paddingBottom: 40 },
  doctorCard: {},
  avatar: { width: 56, height: 56, backgroundColor: '#E8F3EC' },
  detailsCard: {},
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
