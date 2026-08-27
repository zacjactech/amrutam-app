// Consultation Module - Home Screen (C01)

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useDoctors } from '../hooks';
import { Doctor, SPECIALIZATIONS, DEFAULT_DOCTOR_FILTER } from '../types';
import { Badge } from '../../../shared/components/Badge';
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface ConsultationHomeScreenProps {
  onDoctorPress: (doctorId: string) => void;
  onSeeAllDoctors: () => void;
  onSearchPress: () => void;
  onUpcomingPress: () => void;
}

export function ConsultationHomeScreen({
  onDoctorPress,
  onSeeAllDoctors,
  onSearchPress,
  onUpcomingPress,
}: ConsultationHomeScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);

  const filter = useMemo(
    () => ({ ...DEFAULT_DOCTOR_FILTER, specialization: selectedSpec }),
    [selectedSpec],
  );

  const { data, isLoading, isError, error, refetch, isRefetching } = useDoctors(filter, 'rating');
  const doctors = data?.data ?? [];
  const upcomingDoctor = doctors[0] ?? null;

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const renderHorizontalCard = useCallback(
    ({ item }: { item: Doctor }) => (
      <TouchableOpacity
        style={[
          hCardStyles.card,
          { backgroundColor: colors.surface.default, borderRadius: spacing.md, width: 180, marginRight: spacing.md },
        ]}
        onPress={() => onDoctorPress(item.id)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.photoUrl }}
          style={[hCardStyles.avatar, { borderRadius: spacing.sm }]}
          contentFit="cover"
        />
        <AppText variant="bodySmall" numberOfLines={1} style={{ color: colors.text.primary, marginTop: spacing.sm }}>
          {item.name}
        </AppText>
        <View style={hCardStyles.ratingRow}>
          <AppText variant="caption" style={{ color: colors.rating }}>★ {item.rating.toFixed(1)}</AppText>
          <AppText variant="caption" style={{ color: colors.text.tertiary, marginLeft: spacing.xs }}>({item.reviewCount})</AppText>
        </View>
        <AppText variant="caption" numberOfLines={1} style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
          {item.specialization}
        </AppText>
        <View style={hCardStyles.footer}>
          <AppText variant="bodyLarge" style={{ color: colors.action.primary, fontWeight: '700' }}>₹{item.consultationFee}</AppText>
          <TouchableOpacity
            style={[hCardStyles.viewBtn, { borderColor: colors.action.primary }]}
            onPress={() => onDoctorPress(item.id)}
          >
            <AppText variant="caption" style={{ color: colors.action.primary, fontWeight: '600' }}>View Profile</AppText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ),
    [colors, spacing, onDoctorPress],
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
        message={error instanceof Error ? error.message : 'Could not load doctors'}
        type="retryable"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.action.primary}
            colors={[colors.action.primary]}
          />
        }
      >
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xxl }}>
          <AppText variant="h1" style={{ marginBottom: spacing.xs }}>Consultations</AppText>
          <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg }}>
            Find the right Ayurvedic doctor for you.
          </AppText>
          <TouchableOpacity
            style={[styles.searchBar, { backgroundColor: colors.surface.default, borderColor: colors.border.default, borderRadius: spacing.sm }]}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <AppText variant="body" style={{ color: colors.text.tertiary }}>Search doctors, specializations...</AppText>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
            <TouchableOpacity
              style={[styles.chip, { backgroundColor: selectedSpec === null ? colors.action.primary : 'transparent', borderColor: selectedSpec === null ? colors.action.primary : colors.border.default }]}
              onPress={() => setSelectedSpec(null)}
            >
              <AppText variant="bodySmall" style={{ color: selectedSpec === null ? colors.surface.default : colors.text.primary, fontWeight: '600' }}>All</AppText>
            </TouchableOpacity>
            {SPECIALIZATIONS.map((spec) => {
              const active = selectedSpec === spec;
              return (
                <TouchableOpacity
                  key={spec}
                  style={[styles.chip, { backgroundColor: active ? colors.action.primary : 'transparent', borderColor: active ? colors.action.primary : colors.border.default }]}
                  onPress={() => setSelectedSpec(active ? null : spec)}
                >
                  <AppText variant="bodySmall" style={{ color: active ? colors.surface.default : colors.text.primary, fontWeight: '500' }}>{spec}</AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={{ marginTop: spacing.xxl }}>
          <View style={[styles.sectionRow, { paddingHorizontal: spacing.lg }]}>
            <AppText variant="h3">Upcoming Consultation</AppText>
          </View>
          {upcomingDoctor !== null ? (
            <TouchableOpacity
              style={[styles.upcomingCard, { backgroundColor: '#1B4332', borderRadius: spacing.lg, padding: spacing.lg, marginHorizontal: spacing.lg, marginTop: spacing.md }]}
              onPress={onUpcomingPress}
              activeOpacity={0.8}
            >
              <View style={styles.upcomingRow}>
                <Image source={{ uri: upcomingDoctor.photoUrl }} style={[styles.upcomingAvatar, { borderRadius: spacing.md }]} contentFit="cover" />
                <View style={{ marginLeft: 14, flex: 1 }}>
                  <AppText variant="body" style={{ color: '#FFFFFF', fontWeight: '600' }}>{upcomingDoctor.name}</AppText>
                  <AppText variant="bodySmall" style={{ color: '#A7C4B8', marginTop: 2 }}>{upcomingDoctor.specialization}</AppText>
                </View>
              </View>
              <View style={{ marginTop: spacing.md }}>
                <Badge variant="confirmed" label="Confirmed" />
                <AppText variant="bodySmall" style={{ color: '#A7C4B8', marginTop: spacing.sm }}>
                  {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · 10:00 AM
                </AppText>
              </View>
              <TouchableOpacity style={[styles.joinCallBtn, { borderColor: '#FFFFFF', borderRadius: spacing.sm }]} onPress={() => {}}>
                <AppText variant="button" style={{ color: '#FFFFFF' }}>Join Call</AppText>
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <View style={[styles.emptyBox, { marginHorizontal: spacing.lg, marginTop: spacing.md, padding: spacing.xxl, backgroundColor: colors.surface.default, borderRadius: spacing.lg, alignItems: 'center' }]}>
              <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>No upcoming consultations</AppText>
            </View>
          )}
        </View>

        <View style={{ marginTop: spacing.xxl, paddingBottom: spacing.xxl }}>
          <View style={[styles.sectionRow, { paddingHorizontal: spacing.lg, marginBottom: spacing.md }]}>
            <AppText variant="h3">Recommended Doctors</AppText>
            <TouchableOpacity onPress={onSeeAllDoctors}>
              <AppText variant="bodySmall" style={{ color: colors.action.primary, fontWeight: '600' }}>See all</AppText>
            </TouchableOpacity>
          </View>
          {doctors.length === 0 ? (
            <View style={{ paddingHorizontal: spacing.lg }}>
              <AppEmptyState title="No doctors found" message="Try a different filter or check back later." />
            </View>
          ) : (
            <FlashList
              data={doctors}
              renderItem={renderHorizontalCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.lg }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },
  searchBar: { paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  upcomingCard: {},
  upcomingRow: { flexDirection: 'row', alignItems: 'center' },
  upcomingAvatar: { width: 56, height: 56, backgroundColor: '#2D6A4F' },
  joinCallBtn: { marginTop: 14, paddingVertical: 12, borderWidth: 1.5, alignItems: 'center' },
  emptyBox: {},
});

const hCardStyles = StyleSheet.create({
  card: { padding: 12 },
  avatar: { width: '100%', height: 120, backgroundColor: '#E8F3EC' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  viewBtn: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
});
