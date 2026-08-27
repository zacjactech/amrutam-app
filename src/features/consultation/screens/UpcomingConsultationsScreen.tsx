// Consultation Module - Upcoming Consultations Screen

import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useBookings, useCancelConsultation } from '../hooks';
import { Booking, BookingStatus } from '../types';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { useToast } from '../../../shared/components/Toast';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  pending_confirmation: { label: 'Pending', color: '#F57F17', bg: '#FFF8E1' },
  confirmed: { label: 'Confirmed', color: '#1B5E3A', bg: '#E8F5E9' },
  pending_sync: { label: 'Queued', color: '#1B5E3A', bg: '#E8F5E9' },
  cancelled: { label: 'Cancelled', color: '#D32F2F', bg: '#FFEBEE' },
  completed: { label: 'Completed', color: '#5B6B61', bg: '#F1F4F1' },
  no_show: { label: 'No Show', color: '#D32F2F', bg: '#FFEBEE' },
};

export function UpcomingConsultationsScreen({
  onConsultationPress,
}: UpcomingConsultationsScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { data: bookings = [], isLoading, isError, refetch } = useBookings('patient_001');
  const cancelMutation = useCancelConsultation();
  const { showToast } = useToast();

  const handleCancel = useCallback(
    async (bookingId: string) => {
      try {
        await cancelMutation.mutateAsync(bookingId);
        showToast('Consultation cancelled', 'success');
      } catch (_error) {
        showToast('Failed to cancel consultation', 'error');
      }
    },
    [cancelMutation, showToast],
  );

  const renderBooking = useCallback(
    ({ item }: { item: Booking }) => {
      const statusConfig = STATUS_CONFIG[item.status];
      const isCancellable = item.status === 'confirmed' || item.status === 'pending_confirmation';

      return (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.lg, marginBottom: spacing.md }]}
          onPress={() => onConsultationPress(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.doctorInfo}>
              <Image
                source={{ uri: 'https://api.dicebear.com/7.x/person/svg?seed=' + item.doctorId }}
                style={styles.photo}
                contentFit="cover"
              />
              <View style={styles.info}>
                <AppText variant="body" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                  Doctor #{item.doctorId.slice(5)}
                </AppText>
                <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
                  {new Date(item.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </AppText>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 4 }]}>
              <AppText variant="caption" style={{ color: statusConfig.color }}>
                {statusConfig.label}
              </AppText>
            </View>
          </View>

          <View style={[styles.cardFooter, { marginTop: spacing.md, paddingTop: spacing.md, borderTopColor: colors.border.default }]}>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
              {item.consultationType.charAt(0).toUpperCase() + item.consultationType.slice(1)}{' '}
              Consultation
            </AppText>
            {isCancellable && (
              <Button
                title="Cancel"
                variant="ghost"
                size="small"
                onPress={() => handleCancel(item.id)}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [onConsultationPress, handleCancel, colors],
  );

  const renderEmpty = useCallback(
    () => (
      <AppEmptyState
        title="No consultations yet"
        message="Book your first consultation to get started"
      />
    ),
    [],
  );

  const renderError = useCallback(
    () => (
      <AppErrorState
        message="Failed to load consultations"
        type="retryable"
        onRetry={() => refetch()}
      />
    ),
    [refetch],
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
        <AppText variant="body" style={{ marginTop: spacing.md, color: colors.text.secondary }}>
          Loading consultations...
        </AppText>
      </View>
    );
  }

  if (isError) {
    return renderError();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { padding: spacing.lg, paddingBottom: spacing.sm }]}>
        <AppText variant="h2" style={{ marginBottom: spacing.xs }}>My Consultations</AppText>
        <AppText variant="body" style={{ color: colors.text.secondary }}>{bookings.length} total</AppText>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[styles.listContent, { padding: spacing.lg, paddingTop: spacing.sm }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

interface UpcomingConsultationsScreenProps {
  onConsultationPress: (bookingId: string) => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {},
  listContent: {},
  card: {},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  photo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E8F3EC',
    marginRight: 12,
  },
  info: {
    marginLeft: 12,
  },
  statusBadge: {},
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
  },
});
