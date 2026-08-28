// Consultation Module - Slot Selection Screen (C06)

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDoctor, useDoctorSlots } from '../hooks';
import { ConsultationSlot } from '../types';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface SlotSelectionScreenProps {
  doctorId: string;
  onBack: () => void;
  onContinue: (slot: ConsultationSlot) => void;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatShortDate(d: Date): { label: string; dayName: string } {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return { label: `${d.getDate()}`, dayName: dayNames[d.getDay()] ?? '' };
}

function isSlotExpired(slot: ConsultationSlot): boolean {
  return new Date(slot.endTime) < new Date();
}

export function SlotSelectionScreen({
  doctorId,
  onBack,
  onContinue,
}: SlotSelectionScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);

  const { isLoading: doctorLoading } = useDoctor(doctorId);
  const { data: allSlots = [], isLoading: slotsLoading } = useDoctorSlots(doctorId);

  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const dateKey = (d: Date) => d.toISOString().split('T')[0] ?? '';

  const filteredSlots = useMemo(() => {
    if (selectedDate === null) return allSlots;
    return allSlots.filter((s) => s.startTime.startsWith(selectedDate));
  }, [allSlots, selectedDate]);

  const selectedDateObj = useMemo(() => {
    if (selectedDate === null) return null;
    return weekDates.find((d) => dateKey(d) === selectedDate) ?? null;
  }, [selectedDate, weekDates]);

  const handleSlotPress = useCallback(
    (slot: ConsultationSlot) => {
      if (isSlotExpired(slot)) return;
      if (slot.isBooked) return;
      setSelectedSlot(slot);
    },
    [],
  );

  const handleContinue = useCallback(() => {
    if (selectedSlot !== null) {
      onContinue(selectedSlot);
    }
  }, [selectedSlot, onContinue]);

  if (doctorLoading || slotsLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.sm }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <AppText variant="body" style={{ color: colors.action.primary }}>← Back</AppText>
        </TouchableOpacity>
        <AppText variant="h1">Select Time</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.dateSection, { marginHorizontal: spacing.lg, backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.lg }]}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>Select Date</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {weekDates.map((d) => {
                const key = dateKey(d);
                const isSelected = selectedDate === key;
                const fmt = formatShortDate(d);
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.dateChip, {
                      backgroundColor: isSelected ? colors.action.primary : 'transparent',
                      borderColor: isSelected ? colors.action.primary : colors.border.default,
                      borderRadius: spacing.sm,
                    }]}
                    onPress={() => setSelectedDate(isSelected ? null : key)}
                  >
                    <AppText variant="caption" style={{ color: isSelected ? colors.surface.default : colors.text.secondary }}>{fmt.dayName}</AppText>
                    <AppText variant="h3" style={{ color: isSelected ? colors.surface.default : colors.text.primary, marginTop: spacing.xs }}>{fmt.label}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={[styles.slotsSection, { marginHorizontal: spacing.lg, marginTop: spacing.md, backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.lg }]}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>Available Slots</AppText>
          {filteredSlots.length === 0 ? (
            <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>No slots available for this date.</AppText>
          ) : (
            <View style={styles.slotGrid}>
              {filteredSlots.map((slot) => {
                const expired = isSlotExpired(slot);
                const booked = slot.isBooked;
                const isSelected = selectedSlot?.id === slot.id;
                const unavailable = expired || booked;

                let bgColor = 'transparent';
                let borderColor = colors.border.default;
                let textColor = colors.text.primary;
                let strikeThrough = false;

                if (isSelected) {
                  bgColor = colors.action.primary;
                  borderColor = colors.action.primary;
                  textColor = colors.surface.default;
                } else if (unavailable) {
                  bgColor = colors.background.secondary;
                  borderColor = colors.border.light;
                  textColor = colors.text.disabled;
                  strikeThrough = expired;
                }

                return (
                  <TouchableOpacity
                    key={slot.id}
                    style={[styles.slotChip, {
                      backgroundColor: bgColor,
                      borderColor,
                      borderRadius: spacing.sm,
                      opacity: unavailable && !isSelected ? 0.6 : 1,
                    }]}
                    onPress={() => handleSlotPress(slot)}
                    disabled={unavailable}
                  >
                    <AppText
                      variant="body"
                      style={{
                        color: textColor,
                        fontWeight: isSelected ? '700' : '600',
                        textDecorationLine: strikeThrough ? 'line-through' : 'none',
                      }}
                    >
                      {formatTime(slot.startTime)}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={[styles.legend, { marginHorizontal: spacing.lg, marginTop: spacing.md, flexDirection: 'row', gap: spacing.lg }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.border.default }]} />
            <AppText variant="caption" style={{ color: colors.text.secondary }}>Available</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.action.primary }]} />
            <AppText variant="caption" style={{ color: colors.text.secondary }}>Selected</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.background.secondary }]} />
            <AppText variant="caption" style={{ color: colors.text.secondary }}>Unavailable</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.text.disabled }]} />
            <AppText variant="caption" style={{ color: colors.text.secondary }}>Expired</AppText>
          </View>
        </View>

        {selectedSlot !== null && (
          <View style={[styles.summaryCard, { marginHorizontal: spacing.lg, marginTop: spacing.md, backgroundColor: colors.status.successSoft, borderRadius: spacing.md, padding: spacing.lg }]}>
            <AppText variant="h3" style={{ color: colors.action.primary }}>Selected Slot</AppText>
            <AppText variant="body" style={{ color: colors.text.primary, marginTop: spacing.xs }}>
              {selectedDateObj !== null
                ? selectedDateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
                : new Date(selectedSlot.startTime).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              {' · '}
              {formatTime(selectedSlot.startTime)}
            </AppText>
          </View>
        )}
      </ScrollView>

      <View style={[styles.stickyFooter, { backgroundColor: colors.surface.default, borderTopColor: colors.border.default, padding: spacing.lg }]}>
        <Button
          title="Continue"
          variant="primary"
          size="large"
          onPress={handleContinue}
          disabled={selectedSlot === null}
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
  dateSection: {},
  dateChip: { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, minWidth: 52 },
  slotsSection: {},
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotChip: { borderWidth: 1, paddingVertical: 12, paddingHorizontal: 16, minWidth: 80, alignItems: 'center' },
  legend: {},
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  summaryCard: {},
  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1 },
});
