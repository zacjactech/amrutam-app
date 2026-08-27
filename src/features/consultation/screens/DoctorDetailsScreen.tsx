// Consultation Module - Doctor Details Screen

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { useDoctor, useDoctorSlots, useBookConsultation } from '../hooks';
import { SlotPicker } from '../components/SlotPicker';
import { ConsultationSlot, ConsultationType } from '../types';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { useToast } from '../../../shared/components/Toast';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface DoctorDetailsScreenProps {
  doctorId: string;
  onBack: () => void;
  onBookingSuccess: (bookingId: string) => void;
}

export function DoctorDetailsScreen({
  doctorId,
  onBack,
  onBookingSuccess,
}: DoctorDetailsScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { data: doctor, isLoading: doctorLoading, isError: doctorError } = useDoctor(doctorId);
  const { data: slots = [], isLoading: slotsLoading } = useDoctorSlots(doctorId);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);
  const [consultationType, setConsultationType] = useState<ConsultationType>('video');
  const { showToast } = useToast();
  const bookMutation = useBookConsultation();

  const handleSelectSlot = useCallback((slot: ConsultationSlot) => {
    setSelectedSlot(slot);
  }, []);

  const handleBookConsultation = useCallback(async () => {
    if (selectedSlot === null || doctor === null || doctor === undefined) {
      showToast('Please select a time slot', 'warning');
      return;
    }

    try {
      const booking = await bookMutation.mutateAsync({
        doctorId: doctor.id,
        patientId: 'patient_001',
        slotId: selectedSlot.id,
        consultationType,
      });
      showToast('Booking confirmed!', 'success');
      onBookingSuccess(booking.id);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Booking failed',
        'error',
      );
    }
  }, [selectedSlot, doctor, consultationType, bookMutation, showToast, onBookingSuccess]);

  if (doctorLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
        <AppText variant="body" style={{ marginTop: spacing.md, color: colors.text.secondary }}>
          Loading doctor details...
        </AppText>
      </View>
    );
  }

  if (doctorError || doctor === null || doctor === undefined) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <AppText variant="body" style={{ color: colors.status.error, marginBottom: spacing.md }}>
          Failed to load doctor details
        </AppText>
        <Button title="Go Back" variant="primary" size="medium" onPress={onBack} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <AppText variant="body" style={{ color: colors.action.primary }}>← Back</AppText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        <View style={[styles.doctorHeader, { backgroundColor: colors.surface.default, marginHorizontal: spacing.lg, marginTop: spacing.sm, borderRadius: spacing.md, padding: spacing.lg }]}>
          <Image source={{ uri: doctor.photoUrl }} style={styles.photo} contentFit="cover" />
          <View style={styles.doctorInfo}>
            <AppText variant="h3" style={{ marginBottom: spacing.xs }}>{doctor.name}</AppText>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
              {doctor.specialization}
            </AppText>
            <View style={styles.ratingRow}>
              <AppText variant="body" style={{ color: colors.action.secondary }}>
                ★ {doctor.rating.toFixed(1)}
              </AppText>
              <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
                ({doctor.reviewCount} reviews)
              </AppText>
            </View>
          </View>
        </View>

        <View style={[styles.statsRow, { backgroundColor: colors.surface.default, marginHorizontal: spacing.lg, marginTop: spacing.md, borderRadius: spacing.md, padding: spacing.lg }]}>
          <View style={styles.stat}>
            <AppText variant="h3" style={{ color: colors.action.primary }}>{doctor.experience}</AppText>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>Years Exp</AppText>
          </View>
          <View style={styles.stat}>
            <AppText variant="h3" style={{ color: colors.action.primary }}>₹{doctor.consultationFee}</AppText>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>Fee</AppText>
          </View>
          <View style={styles.stat}>
            <AppText variant="h3" style={{ color: colors.action.primary }}>{doctor.availability.slotDuration}</AppText>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>Min Session</AppText>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface.default, padding: spacing.lg, marginHorizontal: spacing.lg, marginTop: spacing.md, borderRadius: spacing.md }]}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>About</AppText>
          <AppText variant="body" style={{ color: colors.text.secondary }}>{doctor.bio}</AppText>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface.default, padding: spacing.lg, marginHorizontal: spacing.lg, marginTop: spacing.md, borderRadius: spacing.md }]}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>Languages</AppText>
          <View style={styles.chipRow}>
            {doctor.languages.map((lang) => (
              <View key={lang} style={[styles.chip, { backgroundColor: colors.background.secondary, borderColor: colors.border.default, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 6 }]}>
                <AppText variant="caption" style={{ color: colors.text.secondary }}>{lang}</AppText>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface.default, padding: spacing.lg, marginHorizontal: spacing.lg, marginTop: spacing.md, borderRadius: spacing.md }]}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>Clinic</AppText>
          <AppText variant="body" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>{doctor.clinicName}</AppText>
          <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>{doctor.clinicAddress}</AppText>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface.default, padding: spacing.lg, marginHorizontal: spacing.lg, marginTop: spacing.md, borderRadius: spacing.md }]}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>Consultation Type</AppText>
          <View style={styles.chipRow}>
            {(['video', 'audio', 'chat', 'in-person'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 6 },
                  consultationType === type && { backgroundColor: colors.action.primary, borderColor: colors.action.primary },
                ]}
                onPress={() => setConsultationType(type)}
              >
                <AppText
                  variant="caption"
                  style={{
                    color: consultationType === type ? colors.surface.default : colors.text.secondary,
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface.default, padding: spacing.lg, marginHorizontal: spacing.lg, marginTop: spacing.md, borderRadius: spacing.md }]}>
          <AppText variant="h3" style={{ marginBottom: spacing.md }}>Available Slots</AppText>
          {slotsLoading ? (
            <ActivityIndicator size="small" color={colors.action.primary} />
          ) : (
            <SlotPicker
              slots={slots}
              selectedSlotId={selectedSlot?.id ?? null}
              onSelectSlot={handleSelectSlot}
            />
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface.default, borderTopColor: colors.border.default, padding: spacing.lg }]}>
        <Button
          title={selectedSlot !== null ? 'Book Consultation' : 'Select a Slot'}
          variant="primary"
          size="large"
          onPress={handleBookConsultation}
          disabled={selectedSlot === null}
          loading={bookMutation.isPending}
          style={styles.bookButton}
        />
      </View>
    </View>
  );
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
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  doctorHeader: {
    flexDirection: 'row',
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#E8F3EC',
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  section: {},
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  bookButton: {
    width: '100%',
  },
});
