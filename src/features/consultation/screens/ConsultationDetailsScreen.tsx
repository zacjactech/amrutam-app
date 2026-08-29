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
import { useDoctor, useBookings, useBookingReview } from '../hooks';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppErrorState } from '../../../shared/components';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import {
  ArrowLeft,
  IconCalendar,
  Clock,
  Clipboard,
  Activities,
  Star,
  Stethoscope,
} from '../../../shared/assets/icons';
import { Badge } from '../../../shared/components/Badge';
import { lightTheme } from '../../../shared/design-system/theme';

interface ConsultationDetailsScreenProps {
  bookingId: string;
  onBack: () => void;
  onCancel: (bookingId: string) => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'confirmed' | 'pending' | 'cancelled' | 'completed' }
> = {
  pending_confirmation: { label: 'Pending', variant: 'pending' },
  confirmed: { label: 'Confirmed', variant: 'confirmed' },
  pending_sync: { label: 'Pending sync', variant: 'pending' },
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
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  const doctorId = booking?.doctorId ?? '';
  const { data: doctor, isLoading: doctorLoading } = useDoctor(doctorId);
  const { data: existingReview } = useBookingReview(bookingId);

  const isLoadingData = bookingsLoading || doctorLoading;

  const statusConfig =
    booking !== undefined ? STATUS_CONFIG[booking.status] : undefined;

  const slotDate = booking !== undefined ? new Date(booking.updatedAt) : new Date();
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

  const isCompleted =
    booking !== undefined && booking.status === 'completed';
  const canCancel =
    booking !== undefined &&
    (booking.status === 'confirmed' || booking.status === 'pending_confirmation');

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

  if (
    booking === undefined ||
    doctor === null ||
    doctor === undefined ||
    statusConfig === undefined
  ) {
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
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xxl,
            paddingBottom: spacing.md,
          },
        ]}
      >
        <View style={styles.titleRow}>
          <TouchableOpacity
            onPress={onBack}
            style={{ padding: spacing.xs, marginRight: spacing.sm }}
          >
            <ArrowLeft width={20} height={20} color={colors.text.primary} />
          </TouchableOpacity>
          <AppText variant="h1">Consultation Details</AppText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.doctorCard,
            {
              marginHorizontal: spacing.lg,
              backgroundColor: colors.surface.default,
              borderRadius: spacing.md,
              padding: spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
        >
          <Image
            source={{ uri: doctor.photoUrl }}
              style={[
                styles.avatar,
                { borderRadius: spacing.md, backgroundColor: colors.action.primarySoft },
              ]}
            contentFit="cover"
          />
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <AppText variant="body" style={{ fontWeight: '600' }}>
              {doctor.name}
            </AppText>
            <AppText
              variant="bodySmall"
              style={{ color: colors.text.secondary, marginTop: spacing.xs }}
            >
              {doctor.specialization}
            </AppText>
          </View>
        </View>

        <View
          style={[
            styles.detailsCard,
            {
              marginHorizontal: spacing.lg,
              marginTop: spacing.md,
              backgroundColor: colors.surface.default,
              borderRadius: spacing.md,
              padding: spacing.lg,
            },
          ]}
        >
          {[
            {
              icon: <IconCalendar width={18} height={18} color={colors.text.secondary} />,
              label: 'Date',
              value: dateStr,
            },
            {
              icon: <Clock width={18} height={18} color={colors.text.secondary} />,
              label: 'Time',
              value: timeStr,
            },
            {
              icon: <Clock width={18} height={18} color={colors.text.secondary} />,
              label: 'Duration',
              value: '30 minutes',
            },
            {
              icon: <Stethoscope width={18} height={18} color={colors.text.secondary} />,
              label: 'Mode',
              value:
                booking.consultationType.charAt(0).toUpperCase() +
                booking.consultationType.slice(1) +
                ' (Video)',
            },
            {
              icon: <Star width={18} height={18} color={colors.text.secondary} />,
              label: 'Fee',
              value: `₹${doctor.consultationFee}`,
              isFee: true,
            },
            {
              icon: <Activities width={18} height={18} color={colors.text.secondary} />,
              label: 'Booking ID',
              value: booking.id,
            },
            {
              icon: <Clipboard width={18} height={18} color={colors.text.secondary} />,
              label: 'Status',
              value: statusConfig.label,
              isStatus: true,
              statusVariant: statusConfig.variant,
            },
          ].map((row) => (
            <View
              key={row.label}
              style={[
                styles.detailRow,
                {
                  borderBottomColor: colors.border.light,
                  borderBottomWidth: 1,
                  paddingVertical: spacing.md,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginRight: spacing.sm, width: 20 }}>
                  {row.icon}
                </View>
                <AppText
                  variant="body"
                  style={{ color: colors.text.secondary }}
                >
                  {row.label}
                </AppText>
              </View>
              {row.isStatus ? (
                <Badge
                  variant={row.statusVariant as 'confirmed' | 'pending' | 'cancelled' | 'completed'}
                  label={row.value}
                />
              ) : (
                <AppText
                  variant="body"
                  style={{
                    color: row.isFee ? colors.action.primary : colors.text.primary,
                    fontWeight: row.isFee ? '700' : '500',
                  }}
                >
                  {row.value}
                </AppText>
              )}
            </View>
          ))}
        </View>

        {booking.status === 'confirmed' && (
          <View style={{ marginHorizontal: spacing.lg, marginTop: spacing.xl }}>
            <Button
              title="Join Consultation"
              variant="primary"
              size="large"
              onPress={() => {}}
              disabled={true}
              style={{ width: '100%' }}
            />
            <AppText
              variant="bodySmall"
              style={{
                color: colors.text.tertiary,
                textAlign: 'center',
                marginTop: spacing.sm,
              }}
            >
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
              style={{
                width: '100%',
                borderColor: colors.action.destructive,
              }}
              textStyle={{ color: colors.action.destructive }}
            />
          </View>
        )}

        {isCompleted && existingReview && (
          <View
            style={[
              styles.reviewCard,
              {
                marginHorizontal: spacing.lg,
                marginTop: spacing.lg,
                backgroundColor: colors.surface.default,
                borderRadius: spacing.md,
                padding: spacing.lg,
              },
            ]}
          >
            <View style={styles.reviewHeader}>
              <AppText variant="h3">Your Review</AppText>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <AppText
                    key={star}
                    variant="body"
                    style={{
                      color:
                        star <= existingReview.rating
                          ? colors.rating
                          : colors.text.disabled,
                      fontSize: 18,
                    }}
                  >
                    ★
                  </AppText>
                ))}
              </View>
            </View>
            {existingReview.comment !== undefined &&
              existingReview.comment.length > 0 && (
                <AppText
                  variant="body"
                  style={{
                    color: colors.text.secondary,
                    marginTop: spacing.sm,
                    lineHeight: 22,
                  }}
                >
                  {existingReview.comment}
                </AppText>
              )}
            <AppText
              variant="caption"
              style={{ color: colors.text.tertiary, marginTop: spacing.sm }}
            >
              Submitted on{' '}
              {new Date(existingReview.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </AppText>
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
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  scroll: { paddingBottom: 40 },
  doctorCard: {},
  avatar: { width: 56, height: 56 },
  detailsCard: {},
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewCard: {
    ...lightTheme.shadows.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewStars: { flexDirection: 'row', gap: 2 },
});
