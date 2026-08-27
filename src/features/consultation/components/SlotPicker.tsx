// Consultation Module - Slot Picker Component

import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { ConsultationSlot } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface SlotPickerProps {
  slots: ConsultationSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: ConsultationSlot) => void;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

interface SlotGroup {
  date: string;
  slots: ConsultationSlot[];
}

function groupSlotsByDate(slots: ConsultationSlot[]): SlotGroup[] {
  const groups: Map<string, ConsultationSlot[]> = new Map();

  for (const slot of slots) {
    const dateKey = new Date(slot.startTime).toDateString();
    const existing = groups.get(dateKey);
    if (existing !== undefined) {
      existing.push(slot);
    } else {
      groups.set(dateKey, [slot]);
    }
  }

  return Array.from(groups.entries()).map(([date, dateSlots]) => ({
    date,
    slots: dateSlots,
  }));
}

export const SlotPicker = memo(function SlotPicker({
  slots,
  selectedSlotId,
  onSelectSlot,
}: SlotPickerProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const groups = groupSlotsByDate(slots);

  if (groups.length === 0) {
    return (
      <View style={[styles.emptyContainer, { padding: spacing.md, alignItems: 'center' }]}>
        <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
          No available slots
        </AppText>
        <AppText variant="bodySmall" style={{ color: colors.text.disabled }}>
          This doctor has no slots in the next 7 days
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {groups.map((group) => (
        <View key={group.date} style={[styles.group, { marginBottom: spacing.md }]}>
          <AppText variant="label" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
            {formatDate(group.slots[0]!.startTime)}
          </AppText>
          <View style={styles.slotsRow}>
            {group.slots.map((slot) => {
              const isSelected = slot.id === selectedSlotId;
              return (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotChip,
                    {
                      backgroundColor: isSelected ? colors.action.primary : colors.background.secondary,
                      borderColor: isSelected ? colors.action.primary : colors.border.default,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.sm,
                      borderRadius: spacing.sm,
                      minWidth: 80,
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => onSelectSlot(slot)}
                  activeOpacity={0.7}
                >
                  <AppText
                    variant="body"
                    style={{
                      color: isSelected ? colors.surface.default : colors.text.primary,
                      fontWeight: '600',
                    }}
                  >
                    {formatTime(slot.startTime)}
                  </AppText>
                  <AppText
                    variant="caption"
                    style={{
                      color: isSelected ? colors.action.primarySoft : colors.text.secondary,
                      marginTop: 2,
                      textTransform: 'capitalize',
                    }}
                  >
                    {slot.consultationType}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  group: {},
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotChip: {
    borderWidth: 1,
  },
  emptyContainer: {},
});
