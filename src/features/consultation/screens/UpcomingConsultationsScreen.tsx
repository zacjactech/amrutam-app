// Consultation Module - Upcoming Consultations Screen (C11)

import React, { useState, useCallback, useMemo, createContext, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useBookings, useDoctor, useHasReviewedBooking } from '../hooks';
import { Booking, BookingStatus, Doctor } from '../types';
import { RateDoctorModal } from '../components/RateDoctorModal';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { ArrowLeft, IconCalendar } from '../../../shared/assets/icons';
import { useQuery } from '@tanstack/react-query';
import { consultationRepository } from '../repository';
import { consultationKeys } from '../hooks';

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; badgeVariant: 'confirmed' | 'pending' | 'cancelled' | 'completed' }
> = {
  pending_confirmation: { label: 'Pending', badgeVariant: 'pending' },
  confirmed: { label: 'Confirmed', badgeVariant: 'confirmed' },
  pending_sync: { label: 'Pending sync', badgeVariant: 'pending' },
  cancelled: { label: 'Cancelled', badgeVariant: 'cancelled' },
  completed: { label: 'Completed', badgeVariant: 'completed' },
  no_show: { label: 'No Show', badgeVariant: 'cancelled' },
};

// Pre-fetch all doctors for the booking list to avoid N+1 queries
const DoctorMapContext = createContext<Map<string, Doctor>>(new Map());

function useDoctorMap() {
  return useContext(DoctorMapContext);
}

function BookingDoctorInfo({
  doctorId,
  spacing,
}: {
  doctorId: string;
  spacing: ReturnType<typeof useThemeSpacing>;
}) {
  const doctorMap = useDoctorMap();
  const doctor = doctorMap.get(doctorId);
  const colors = useThemeColors();

  return (
    <>
      {doctor?.photoUrl ? (
        <Image
          source={{ uri: doctor.photoUrl }}
          style={[
            styles.photo,
            {
              borderRadius: spacing.md,
              backgroundColor: colors.action.primarySoft,
            },
          ]}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.photo,
            {
              borderRadius: spacing.md,
              backgroundColor: colors.action.primarySoft,
            },
          ]}
        />
      )}
      <View style={{ marginLeft: spacing.md, flex: 1 }}>
        <AppText
          variant="body"
          numberOfLines={1}
          style={{ fontWeight: '600' }}
        >
          {doctor?.name ?? 'Loading...'}
        </AppText>
        <AppText
          variant="bodySmall"
          style={{ color: colors.text.secondary, marginTop: spacing.xs }}
        >
          {doctor?.specialization ?? ''}
        </AppText>
      </View>
    </>
  );
}

interface UpcomingConsultationsScreenProps {
  onConsultationPress: (bookingId: string) => void;
  onBack: () => void;
}

export function UpcomingConsultationsScreen({
  onConsultationPress,
  onBack,
}: UpcomingConsultationsScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [ratingModalBooking, setRatingModalBooking] = useState<Booking | null>(null);
  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useBookings();

  // Pre-fetch all unique doctors for the booking list (avoids N+1 queries)
  const uniqueDoctorIds = useMemo(() => {
    const ids = new Set(bookings.map((b) => b.doctorId));
    return Array.from(ids);
  }, [bookings]);

  const { data: doctorsData } = useQuery({
    queryKey: [...consultationKeys.all, 'doctorsByIds', uniqueDoctorIds],
    queryFn: async () => {
      const results = await Promise.all(
        uniqueDoctorIds.map((id) => consultationRepository.getDoctorById(id)),
      );
      const map = new Map<string, Doctor>();
      results.forEach((doc) => {
        if (doc) map.set(doc.id, doc);
      });
      return map;
    },
    enabled: uniqueDoctorIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const doctorMap = doctorsData ?? new Map<string, Doctor>();

  const upcomingBookings = bookings.filter(
    (b) =>
      b.status === 'confirmed' ||
      b.status === 'pending_confirmation' ||
      b.status === 'pending_sync',
  );
  const pastBookings = bookings.filter(
    (b) =>
      b.status === 'completed' || b.status === 'cancelled' || b.status === 'no_show',
  );

  const displayedBookings =
    activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const renderBooking = useCallback(
    ({ item }: { item: Booking }) => {
      const statusConfig = STATUS_CONFIG[item.status];
      const isUpcoming =
        item.status === 'confirmed' ||
        item.status === 'pending_confirmation' ||
        item.status === 'pending_sync';
      const isCompleted = item.status === 'completed';
      const bookingDate = new Date(item.createdAt);

      return (
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: colors.surface.default,
              borderRadius: spacing.md,
              padding: spacing.lg,
              marginBottom: spacing.md,
            },
          ]}
          onPress={() => onConsultationPress(item.id)}
          activeOpacity={0.7}
          accessibilityLabel={`Consultation with ${doctorMap.get(item.doctorId)?.name ?? 'doctor'}`}
          accessibilityRole="button"
        >
          <View style={styles.cardHeader}>
            <View style={styles.doctorInfo}>
              <BookingDoctorInfo doctorId={item.doctorId} spacing={spacing} />
            </View>
            <Badge
              variant={statusConfig.badgeVariant}
              label={statusConfig.label}
            />
          </View>

          <View
            style={[
              styles.cardBody,
              {
                marginTop: spacing.md,
                paddingTop: spacing.md,
                borderTopColor: colors.border.light,
                borderTopWidth: 1,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconCalendar
                width={14}
                height={14}
                color={colors.text.secondary}
                style={{ marginRight: spacing.xs }}
              />
              <AppText
                variant="bodySmall"
                style={{ color: colors.text.secondary }}
              >
                {bookingDate.toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                {' • '}
                {bookingDate.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: spacing.sm,
                gap: spacing.sm,
              }}
            >
              {isUpcoming ? (
                <Button
                  title="View Details"
                  variant="outline"
                  size="small"
                  onPress={() => onConsultationPress(item.id)}
                />
              ) : isCompleted ? (
                <RateButton
                  bookingId={item.id}
                  doctorId={item.doctorId}
                  onPress={() => setRatingModalBooking(item)}
                />
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [colors, spacing, onConsultationPress],
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <AppErrorState
        title="Failed to load"
        message="Could not load consultations."
        type="retryable"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <DoctorMapContext.Provider value={doctorMap}>
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xxl,
            paddingBottom: spacing.sm,
          },
        ]}
      >
        <View style={styles.titleRow}>
        <TouchableOpacity
          onPress={onBack}
          style={{ padding: spacing.xs, marginRight: spacing.sm }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
            <ArrowLeft width={20} height={20} color={colors.text.primary} />
          </TouchableOpacity>
          <AppText variant="h1">My Consultations</AppText>
        </View>

        <View
          style={[
            styles.tabRow,
            {
              marginTop: spacing.lg,
              borderBottomColor: colors.border.default,
              borderBottomWidth: 1,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'upcoming' && {
                borderBottomColor: colors.action.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab('upcoming')}
            accessibilityLabel="Upcoming consultations"
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'upcoming' }}
          >
            <AppText
              variant="body"
              style={{
                color:
                  activeTab === 'upcoming'
                    ? colors.action.primary
                    : colors.text.secondary,
                fontWeight: activeTab === 'upcoming' ? '600' : '400',
              }}
            >
              Upcoming
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'past' && {
                borderBottomColor: colors.action.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab('past')}
            accessibilityLabel="Past consultations"
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'past' }}
          >
            <AppText
              variant="body"
              style={{
                color:
                  activeTab === 'past'
                    ? colors.action.primary
                    : colors.text.secondary,
                fontWeight: activeTab === 'past' ? '600' : '400',
              }}
            >
              Past
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'upcoming' && (
        <View style={[styles.sectionLabel, { paddingHorizontal: spacing.lg }]}>
          <AppText
            variant="label"
            style={{
              color: colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Upcoming Section
          </AppText>
        </View>
      )}
      {activeTab === 'past' && (
        <View style={[styles.sectionLabel, { paddingHorizontal: spacing.lg }]}>
          <AppText
            variant="label"
            style={{
              color: colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Past Section
          </AppText>
        </View>
      )}

      <FlashList
        data={displayedBookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <AppEmptyState
            title={
              activeTab === 'upcoming'
                ? 'No upcoming consultations'
                : 'No past consultations'
            }
            message={
              activeTab === 'upcoming'
                ? 'Book a consultation to get started'
                : 'Completed consultations will appear here'
            }
          />
        }
        contentContainerStyle={{
          padding: spacing.lg,
          paddingTop: spacing.sm,
        }}
        showsVerticalScrollIndicator={false}
      />

      {ratingModalBooking !== null && (
        <RatingModalWrapper
          booking={ratingModalBooking}
          onClose={() => setRatingModalBooking(null)}
        />
      )}
    </View>
    </DoctorMapContext.Provider>
  );
}

function RateButton({
  bookingId,
  onPress,
}: {
  bookingId: string;
  doctorId: string;
  onPress: () => void;
}) {
  const { patientId } = useAuthContext();
  const { data: hasReviewed = false } = useHasReviewedBooking(
    patientId,
    bookingId,
  );
  const colors = useThemeColors();

  if (hasReviewed) {
    return (
      <Button
        title="✓ Reviewed"
        variant="secondary"
        size="small"
        onPress={onPress}
        textStyle={{ color: colors.action.primary }}
      />
    );
  }

  return (
    <Button
      title="Rate Doctor"
      variant="outline"
      size="small"
      onPress={onPress}
    />
  );
}

function RatingModalWrapper({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const { data: doctor } = useDoctor(booking.doctorId);

  return (
    <RateDoctorModal
      visible={true}
      onClose={onClose}
      bookingId={booking.id}
      doctorId={booking.doctorId}
      doctorName={doctor?.name ?? 'Doctor'}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {},
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  tabRow: { flexDirection: 'row' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  sectionLabel: { paddingTop: 8, paddingBottom: 4 },
  card: {},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  doctorInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  photo: { width: 48, height: 48 },
  cardBody: {},
});
