// Consultation Module - Upcoming Consultations Screen (C11)

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useBookings, useCancelConsultation } from '../hooks';
import { Booking, BookingStatus } from '../types';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

const STATUS_CONFIG: Record<BookingStatus, { label: string; badgeVariant: 'confirmed' | 'pending' | 'cancelled' | 'completed' }> = {
  pending_confirmation: { label: 'Pending', badgeVariant: 'pending' },
  confirmed: { label: 'Confirmed', badgeVariant: 'confirmed' },
  pending_sync: { label: 'Confirmed', badgeVariant: 'confirmed' },
  cancelled: { label: 'Cancelled', badgeVariant: 'cancelled' },
  completed: { label: 'Completed', badgeVariant: 'completed' },
  no_show: { label: 'No Show', badgeVariant: 'cancelled' },
};

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
  const { data: bookings = [], isLoading, isError, refetch } = useBookings('patient_001');
  const cancelMutation = useCancelConsultation();

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending_confirmation' || b.status === 'pending_sync',
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled' || b.status === 'no_show',
  );

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const renderBooking = useCallback(
    ({ item }: { item: Booking }) => {
      const statusConfig = STATUS_CONFIG[item.status];
      const isUpcoming = item.status === 'confirmed' || item.status === 'pending_confirmation' || item.status === 'pending_sync';

      return (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.lg, marginBottom: spacing.md }]}
          onPress={() => onConsultationPress(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.doctorInfo}>
              <Image
                source={{ uri: `https://api.dicebear.com/7.x/person/svg?seed=${item.doctorId}` }}
                style={[styles.photo, { borderRadius: spacing.md }]}
                contentFit="cover"
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <AppText variant="body" numberOfLines={1} style={{ fontWeight: '600' }}>Doctor #{item.doctorId.slice(5)}</AppText>
                <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginTop: 2 }}>
                  General Ayurveda
                </AppText>
              </View>
            </View>
            <Badge variant={statusConfig.badgeVariant} label={statusConfig.label} />
          </View>

          <View style={[styles.cardBody, { marginTop: spacing.md, paddingTop: spacing.md, borderTopColor: colors.border.light, borderTopWidth: 1 }]}>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
              {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {' '}
              {new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </AppText>
            <View style={{ flexDirection: 'row', marginTop: spacing.sm, gap: spacing.sm }}>
              {isUpcoming ? (
                <Button title="View Details" variant="outline" size="small" onPress={() => onConsultationPress(item.id)} />
              ) : (
                <Button title="Rate Doctor" variant="outline" size="small" onPress={() => {}} />
              )}
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
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.sm }]}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <AppText variant="body" style={{ color: colors.action.primary }}>←</AppText>
          </TouchableOpacity>
          <AppText variant="h1">My Consultations</AppText>
        </View>

        <View style={[styles.tabRow, { marginTop: spacing.md, borderBottomColor: colors.border.default, borderBottomWidth: 1 }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && { borderBottomColor: colors.action.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab('upcoming')}
          >
            <AppText variant="body" style={{ color: activeTab === 'upcoming' ? colors.action.primary : colors.text.secondary, fontWeight: activeTab === 'upcoming' ? '600' : '400' }}>Upcoming</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && { borderBottomColor: colors.action.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab('past')}
          >
            <AppText variant="body" style={{ color: activeTab === 'past' ? colors.action.primary : colors.text.secondary, fontWeight: activeTab === 'past' ? '600' : '400' }}>Past</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'upcoming' && (
        <View style={[styles.sectionLabel, { paddingHorizontal: spacing.lg }]}>
          <AppText variant="label" style={{ color: colors.text.tertiary, textTransform: 'uppercase' }}>Upcoming Consultations</AppText>
        </View>
      )}
      {activeTab === 'past' && (
        <View style={[styles.sectionLabel, { paddingHorizontal: spacing.lg }]}>
          <AppText variant="label" style={{ color: colors.text.tertiary, textTransform: 'uppercase' }}>Past Consultations</AppText>
        </View>
      )}

      <FlatList
        data={displayedBookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <AppEmptyState
            title={activeTab === 'upcoming' ? 'No upcoming consultations' : 'No past consultations'}
            message={activeTab === 'upcoming' ? 'Book a consultation to get started' : 'Completed consultations will appear here'}
          />
        }
        contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {},
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 4 },
  tabRow: { flexDirection: 'row' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  sectionLabel: { paddingTop: 8, paddingBottom: 4 },
  card: {},
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  doctorInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  photo: { width: 48, height: 48, backgroundColor: '#E8F3EC' },
  cardBody: {},
});
