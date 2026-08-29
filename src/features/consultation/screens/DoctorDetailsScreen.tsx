// Consultation Module - Doctor Details Screen (C05)

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useDoctor, useDoctorSlots } from '../hooks';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { AppErrorState } from '../../../shared/components';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { ArrowLeft, CheckCircleFilled } from '../../../shared/assets/icons';

interface DoctorDetailsScreenProps {
  doctorId: string;
  onBack: () => void;
  onProceedToSlotSelection: (doctorId: string) => void;
}

function formatShortDate(date: Date): { label: string; dayName: string } {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return { label: `${date.getDate()}`, dayName: dayNames[date.getDay()] ?? '' };
}

export function DoctorDetailsScreen({
  doctorId,
  onBack,
  onProceedToSlotSelection,
}: DoctorDetailsScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: doctor, isLoading: doctorLoading, isError: doctorError } = useDoctor(doctorId);
  const { data: slots = [] } = useDoctorSlots(doctorId);

  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const dateKey = (d: Date) => d.toISOString().split('T')[0] ?? '';

  const slotsForSelectedDate = useMemo(() => {
    if (selectedDate === null) return slots;
    return slots.filter((s) => s.startTime.startsWith(selectedDate));
  }, [slots, selectedDate]);

  if (doctorLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
      </View>
    );
  }

  if (doctorError || doctor === null || doctor === undefined) {
    return (
      <AppErrorState
        title="Failed to load doctor"
        message="Please try again."
        type="retryable"
        onRetry={onBack}
      />
    );
  }

  const consultFee = doctor.consultationFee;

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
        <TouchableOpacity
          onPress={onBack}
          style={{ padding: spacing.xs, marginRight: spacing.sm }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft width={20} height={20} color={colors.text.primary} />
        </TouchableOpacity>
        <AppText variant="h1">Doctor Profile</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.avatarSection,
            { alignItems: 'center', paddingVertical: spacing.xl },
          ]}
        >
          <View
            style={[
              styles.avatarRing,
              {
                borderColor: colors.action.primary,
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 3,
                padding: 3,
              },
            ]}
          >
            <Image
              source={{ uri: doctor.photoUrl }}
              style={[styles.avatar, { borderRadius: 48, backgroundColor: colors.action.primarySoft }]}
              contentFit="cover"
            />
          </View>
          <AppText variant="h2" style={{ marginTop: spacing.md }}>
            {doctor.name}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: spacing.sm,
              backgroundColor: colors.action.primarySoft,
              borderRadius: 999,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
            }}
          >
            <CheckCircleFilled
              width={14}
              height={14}
              color={colors.action.primary}
              style={{ marginRight: spacing.xs }}
            />
            <AppText
              variant="caption"
              style={{ color: colors.action.primary, fontWeight: '600' }}
            >
              Verified
            </AppText>
          </View>
          <AppText
            variant="body"
            style={{ color: colors.text.secondary, marginTop: spacing.sm }}
          >
            {doctor.specialization}
          </AppText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: spacing.xs,
            }}
          >
            <AppText
              variant="body"
              style={{ color: colors.rating, fontWeight: '600' }}
            >
              ★ {doctor.rating.toFixed(1)}
            </AppText>
            <AppText
              variant="bodySmall"
              style={{ color: colors.text.tertiary, marginLeft: spacing.xs }}
            >
              · {doctor.reviewCount} Consults
            </AppText>
          </View>
        </View>

        <View style={[styles.statsRow, { paddingHorizontal: spacing.lg }]}>
          <View
            style={[
              styles.statBox,
              {
                backgroundColor: colors.surface.default,
                borderRadius: spacing.md,
                padding: spacing.md,
                flex: 1,
                alignItems: 'center',
              },
            ]}
          >
            <AppText
              variant="h3"
              style={{ color: colors.action.primary }}
            >
              {doctor.experience} Yrs
            </AppText>
            <AppText
              variant="caption"
              style={{ color: colors.text.secondary, marginTop: spacing.xs }}
            >
              Experience
            </AppText>
          </View>
          <View
            style={[
              styles.statBox,
              {
                backgroundColor: colors.surface.default,
                borderRadius: spacing.md,
                padding: spacing.md,
                flex: 1,
                alignItems: 'center',
                marginHorizontal: spacing.sm,
              },
            ]}
          >
            <AppText
              variant="h3"
              style={{ color: colors.action.primary }}
            >
              Online
            </AppText>
            <AppText
              variant="caption"
              style={{ color: colors.text.secondary, marginTop: spacing.xs }}
            >
              Consult Mode
            </AppText>
          </View>
          <View
            style={[
              styles.statBox,
              {
                backgroundColor: colors.surface.default,
                borderRadius: spacing.md,
                padding: spacing.md,
                flex: 1,
                alignItems: 'center',
              },
            ]}
          >
            <AppText
              variant="h3"
              style={{ color: colors.action.primary }}
            >
              ₹{consultFee}
            </AppText>
            <AppText
              variant="caption"
              style={{ color: colors.text.secondary, marginTop: spacing.xs }}
            >
              Doctor Fee
            </AppText>
          </View>
        </View>

        <View
          style={[
            styles.section,
            {
              marginHorizontal: spacing.lg,
              marginTop: spacing.lg,
              backgroundColor: colors.surface.default,
              borderRadius: spacing.md,
              padding: spacing.lg,
            },
          ]}
        >
          <AppText variant="h3" style={{ marginBottom: spacing.sm }}>
            About Doctor
          </AppText>
          <AppText
            variant="body"
            style={{ color: colors.text.secondary, lineHeight: 22 }}
          >
            {doctor.bio}
          </AppText>
        </View>

        <View
          style={[
            styles.section,
            {
              marginHorizontal: spacing.lg,
              marginTop: spacing.md,
              backgroundColor: colors.surface.default,
              borderRadius: spacing.md,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.default,
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <AppText variant="h3">30-min Video Consultation</AppText>
            <AppText
              variant="bodyLarge"
              style={{ color: colors.action.primary, fontWeight: '700' }}
            >
              ₹{consultFee}
            </AppText>
          </View>
        </View>

        <View
          style={[
            styles.section,
            {
              marginHorizontal: spacing.lg,
              marginTop: spacing.md,
              backgroundColor: colors.surface.default,
              borderRadius: spacing.md,
              padding: spacing.lg,
            },
          ]}
        >
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>
            Select Date
          </AppText>
          <View style={styles.dateRow}>
            {weekDates.map((d) => {
              const key = dateKey(d);
              const isSelected = selectedDate === key;
              const formatted = formatShortDate(d);
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.dateChip,
                    {
                      backgroundColor: isSelected
                        ? colors.action.primary
                        : 'transparent',
                      borderColor: isSelected
                        ? colors.action.primary
                        : colors.border.default,
                      borderRadius: spacing.md,
                      paddingVertical: spacing.md,
                      paddingHorizontal: spacing.lg,
                      minWidth: 56,
                    },
                  ]}
                  onPress={() => setSelectedDate(isSelected ? null : key)}
                  accessibilityLabel={`Select date ${formatted.dayName} ${formatted.label}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <AppText
                    variant="caption"
                    style={{
                      color: isSelected
                        ? colors.surface.default
                        : colors.text.secondary,
                    }}
                  >
                    {formatted.dayName}
                  </AppText>
                  <AppText
                    variant="h3"
                    style={{
                      color: isSelected
                        ? colors.surface.default
                        : colors.text.primary,
                      marginTop: spacing.xs,
                    }}
                  >
                    {formatted.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selectedDate !== null && slotsForSelectedDate.length === 0 && (
          <View
            style={[
              styles.emptySlots,
              {
                marginHorizontal: spacing.lg,
                marginTop: spacing.md,
                padding: spacing.lg,
                backgroundColor: colors.surface.default,
                borderRadius: spacing.md,
                alignItems: 'center',
              },
            ]}
          >
            <AppText
              variant="body"
              style={{ color: colors.text.secondary }}
            >
              No slots available on this date.
            </AppText>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.stickyFooter,
          {
            backgroundColor: colors.surface.default,
            borderTopColor: colors.border.default,
            padding: spacing.lg,
          },
        ]}
      >
        <Button
          title="Select Time"
          variant="primary"
          size="large"
          onPress={() => onProceedToSlotSelection(doctorId)}
          disabled={selectedDate === null || slotsForSelectedDate.length === 0}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center' },
  scroll: { paddingBottom: 120 },
  avatarSection: {},
  avatarRing: {},
  avatar: { width: '100%', height: '100%' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: {},
  section: {},
  dateRow: { flexDirection: 'row', gap: 8 },
  dateChip: { alignItems: 'center', borderWidth: 1 },
  emptySlots: {},
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
});
