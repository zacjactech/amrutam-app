// Consultation Module - Doctor Card Component

import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '../../../shared/components/AppText';
import { Doctor } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: (doctorId: string) => void;
}

export const DoctorCard = memo(function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md, marginHorizontal: spacing.lg, marginVertical: spacing.sm }]}
      onPress={() => onPress(doctor.id)}
      activeOpacity={0.7}
      accessibilityLabel={`View profile of ${doctor.name}`}
      accessibilityRole="button"
    >
      <Image
        source={{ uri: doctor.photoUrl }}
        style={[styles.photo, { backgroundColor: colors.action.primarySoft }]}
        contentFit="cover"
      />
      <View style={styles.info}>
        <AppText variant="body" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
          {doctor.name}
        </AppText>
        <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginTop: 2 }}>
          {doctor.specialization}
        </AppText>
        <View style={styles.stats}>
          <AppText variant="bodySmall" style={{ color: colors.action.secondary, fontWeight: '500' }}>
            ★ {doctor.rating.toFixed(1)} ({doctor.reviewCount})
          </AppText>
          <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
            {doctor.experience} yrs exp
          </AppText>
        </View>
        <View style={styles.footer}>
          <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '700' }}>
            ₹{doctor.consultationFee}
          </AppText>
          <View
            style={[
              styles.availabilityBadge,
              {
                backgroundColor: doctor.availability.isAvailable ? colors.status.success + '20' : colors.status.error + '20',
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                borderRadius: 4,
              },
            ]}
          >
            <AppText
              variant="caption"
              style={{
                color: doctor.availability.isAvailable ? colors.status.success : colors.status.error,
                fontWeight: '500',
              }}
            >
              {doctor.availability.isAvailable ? 'Available' : 'Busy'}
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  availabilityBadge: {},
});
