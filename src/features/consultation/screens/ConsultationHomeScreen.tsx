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
import { AppText } from '../../../shared/components/AppText';
import { AppEmptyState, AppErrorState } from '../../../shared/components';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { Search } from '../../../shared/assets/icons';

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
          {
            backgroundColor: colors.surface.default,
            borderRadius: spacing.md,
            width: 200,
            marginRight: spacing.md,
            padding: spacing.md,
          },
        ]}
        onPress={() => onDoctorPress(item.id)}
        activeOpacity={0.7}
        accessibilityLabel={`View profile of ${item.name}`}
        accessibilityRole="button"
      >
        <Image
          source={{ uri: item.photoUrl }}
          style={[hCardStyles.avatar, { borderRadius: spacing.sm, backgroundColor: colors.action.primarySoft }]}
          contentFit="cover"
        />
        <AppText
          variant="body"
          numberOfLines={1}
          style={{ color: colors.text.primary, marginTop: spacing.sm, fontWeight: '600' }}
        >
          {item.name}
        </AppText>
        <AppText
          variant="bodySmall"
          numberOfLines={1}
          style={{ color: colors.text.secondary, marginTop: spacing.xs }}
        >
          {item.specialization}
        </AppText>
        <View style={hCardStyles.ratingRow}>
          <AppText variant="bodySmall" style={{ color: colors.rating, fontWeight: '600' }}>
            ★ {item.rating.toFixed(1)}
          </AppText>
          <AppText
            variant="bodySmall"
            style={{ color: colors.text.tertiary, marginLeft: spacing.xs }}
          >
            · {item.experience} Yrs Exp
          </AppText>
        </View>
        <View style={[hCardStyles.divider, { backgroundColor: colors.border.light }]} />
        <AppText variant="caption" style={{ color: colors.text.secondary, marginTop: spacing.sm }}>
          Consultation Fee
        </AppText>
        <View style={hCardStyles.footer}>
          <AppText
            variant="bodyLarge"
            style={{ color: colors.action.primary, fontWeight: '700' }}
          >
            ₹{item.consultationFee}
          </AppText>
        </View>
        <View style={[hCardStyles.nextSlot, { marginTop: spacing.sm }]}>
          <AppText variant="caption" style={{ color: colors.status.warning }}>
            Next available: Today, 4:30 PM
          </AppText>
        </View>
        <TouchableOpacity
          style={[
            hCardStyles.viewBtn,
            {
              borderColor: colors.action.primary,
              borderRadius: spacing.sm,
              marginTop: spacing.md,
            },
          ]}
          onPress={() => onDoctorPress(item.id)}
          accessibilityLabel={`View profile of ${item.name}`}
          accessibilityRole="button"
        >
          <AppText
            variant="bodySmall"
            style={{ color: colors.action.primary, fontWeight: '600', textAlign: 'center' }}
          >
            View Profile
          </AppText>
        </TouchableOpacity>
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
          <AppText variant="h1" style={{ marginBottom: spacing.xs }}>
            Consultations
          </AppText>
          <AppText
            variant="body"
            style={{ color: colors.text.secondary, marginBottom: spacing.lg }}
          >
            Find the right Ayurvedic doctor for you.
          </AppText>
          <TouchableOpacity
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.surface.default,
                borderColor: colors.border.default,
                borderRadius: spacing.md,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
              },
            ]}
            onPress={onSearchPress}
            activeOpacity={0.7}
            accessibilityLabel="Search doctors"
            accessibilityRole="search"
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Search
                width={18}
                height={18}
                color={colors.text.tertiary}
                style={{ marginRight: spacing.sm }}
              />
              <AppText variant="body" style={{ color: colors.text.tertiary }}>
                Search doctors, specializations...
              </AppText>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              gap: spacing.sm,
            }}
          >
            <TouchableOpacity
              style={[
                styles.chip,
                {
                  backgroundColor:
                    selectedSpec === null ? colors.action.primary : 'transparent',
                  borderColor:
                    selectedSpec === null ? colors.action.primary : colors.border.default,
                  borderRadius: 999,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                },
              ]}
              onPress={() => setSelectedSpec(null)}
              accessibilityLabel="Show all specializations"
              accessibilityRole="button"
              accessibilityState={{ selected: selectedSpec === null }}
            >
              <AppText
                variant="bodySmall"
                style={{
                  color: selectedSpec === null ? colors.surface.default : colors.text.primary,
                  fontWeight: '600',
                }}
              >
                All
              </AppText>
            </TouchableOpacity>
            {SPECIALIZATIONS.map((spec) => {
              const active = selectedSpec === spec;
              return (
                <TouchableOpacity
                  key={spec}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? colors.action.primary : 'transparent',
                      borderColor: active ? colors.action.primary : colors.border.default,
                      borderRadius: 999,
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                    },
                  ]}
                  onPress={() => setSelectedSpec(active ? null : spec)}
                  accessibilityLabel={`Filter by ${spec}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <AppText
                    variant="bodySmall"
                    style={{
                      color: active ? colors.surface.default : colors.text.primary,
                      fontWeight: '500',
                    }}
                  >
                    {spec}
                  </AppText>
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
              style={[
                styles.upcomingCard,
                {
                  backgroundColor: colors.action.primaryPressed,
                  borderRadius: spacing.lg,
                  padding: spacing.lg,
                  marginHorizontal: spacing.lg,
                  marginTop: spacing.md,
                },
              ]}
              onPress={onUpcomingPress}
              activeOpacity={0.8}
              accessibilityLabel="View upcoming consultation"
              accessibilityRole="button"
            >
              <View style={styles.upcomingRow}>
                <Image
                  source={{ uri: upcomingDoctor.photoUrl }}
                  style={[
                    styles.upcomingAvatar,
                    { borderRadius: spacing.md, backgroundColor: colors.action.primary },
                  ]}
                  contentFit="cover"
                />
                <View style={{ marginLeft: spacing.md, flex: 1 }}>
                  <AppText
                    variant="body"
                    style={{ color: colors.text.inverse, fontWeight: '600' }}
                  >
                    {upcomingDoctor.name}
                  </AppText>
                  <AppText
                    variant="bodySmall"
                    style={{ color: colors.text.inverse, marginTop: spacing.xs, opacity: 0.8 }}
                  >
                    {upcomingDoctor.specialization}
                  </AppText>
                </View>
                <View
                  style={{
                    backgroundColor: colors.action.primary,
                    borderRadius: 999,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xs,
                  }}
                >
                  <AppText
                    variant="caption"
                    style={{ color: colors.text.inverse, fontWeight: '600' }}
                  >
                    Confirmed
                  </AppText>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: spacing.md,
                }}
              >
                <AppText variant="bodySmall" style={{ color: colors.text.inverse, opacity: 0.8 }}>
                  Today • 4:30 PM
                </AppText>
                <TouchableOpacity
                  style={[
                    styles.joinCallBtn,
                    {
                      borderColor: colors.text.inverse,
                      borderRadius: spacing.sm,
                    },
                  ]}
                  onPress={() => {}}
                  accessibilityLabel="Join call"
                  accessibilityRole="button"
                >
                  <AppText variant="button" style={{ color: colors.text.inverse }}>
                    Join Call
                  </AppText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.emptyBox,
                {
                  marginHorizontal: spacing.lg,
                  marginTop: spacing.md,
                  padding: spacing.xxl,
                  backgroundColor: colors.surface.default,
                  borderRadius: spacing.lg,
                  alignItems: 'center',
                },
              ]}
            >
              <AppText
                variant="body"
                style={{ color: colors.text.secondary, textAlign: 'center' }}
              >
                No upcoming consultations
              </AppText>
            </View>
          )}
        </View>

        <View style={{ marginTop: spacing.xxl, paddingBottom: spacing.xxl }}>
          <View
            style={[
              styles.sectionRow,
              { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
            ]}
          >
            <AppText variant="h3">Recommended Doctors</AppText>
            <TouchableOpacity onPress={onSeeAllDoctors} accessibilityLabel="See all doctors" accessibilityRole="button">
              <AppText
                variant="bodySmall"
                style={{ color: colors.action.primary, fontWeight: '600' }}
              >
                See all
              </AppText>
            </TouchableOpacity>
          </View>
          {doctors.length === 0 ? (
            <View style={{ paddingHorizontal: spacing.lg }}>
              <AppEmptyState
                title="No doctors found"
                message="Try a different filter or check back later."
              />
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
  searchBar: {
    borderWidth: 1,
  },
  chip: {
    borderWidth: 1,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingCard: {},
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingAvatar: { width: 56, height: 56 },
  joinCallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  emptyBox: {},
});

const hCardStyles = StyleSheet.create({
  card: {},
  avatar: { width: '100%', height: 120 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  divider: {
    height: 1,
    marginTop: 8,
  },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nextSlot: {},
  viewBtn: { borderWidth: 1, paddingVertical: 8 },
});
