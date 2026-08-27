// Home Module - Home Dashboard Screen

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { SuccessIllustration } from '../../../shared/components/Illustrations';

interface HomeDashboardScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

const QUICK_ACTIONS = [
  { label: 'Consult', icon: '🩺', screen: 'Consultations' as const },
  { label: 'Records', icon: '📋', screen: 'HealthRecords' as const },
  { label: 'Shop', icon: '🛍️', screen: 'ShopHome' as const },
];

const RECOMMENDED_PRODUCTS = [
  { id: '1', name: 'Ashwagandha Powder', price: 349, tag: 'Immunity' },
  { id: '2', name: 'Triphala Churna', price: 219, tag: 'Digestion' },
  { id: '3', name: 'Brahmi Hair Oil', price: 459, tag: 'Hair Care' },
  { id: '4', name: 'Aloe Vera Juice', price: 299, tag: 'Skin Care' },
];

const RECENT_RECORDS = [
  { id: '1', title: 'General Consultation', date: '22 Aug 2026', doctor: 'Dr. Priya Sharma' },
  { id: '2', title: 'Follow-up Visit', date: '15 Aug 2026', doctor: 'Dr. Anand Verma' },
];

export function HomeDashboardScreen({ navigation }: HomeDashboardScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting Section */}
      <View style={[styles.greeting, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl }]}>
        <View>
          <AppText variant="body" style={{ color: colors.text.secondary }}>Good morning</AppText>
          <AppText variant="h2" style={{ color: colors.text.primary, marginTop: 4 }}>Welcome back!</AppText>
        </View>
        <View style={[styles.avatar, { backgroundColor: colors.action.primarySoft }]}>
          <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '700' }}>K</AppText>
        </View>
      </View>

      {/* Upcoming Consultation Banner */}
      <Card variant="elevated" style={styles.consultationBanner}>
        <View style={styles.bannerContent}>
          <View style={{ flex: 1 }}>
            <AppText variant="body" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>Upcoming Consultation</AppText>
            <AppText variant="h4" style={{ color: '#FFFFFF', fontWeight: '700' }}>Dr. Priya Sharma</AppText>
            <AppText variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Today, 4:00 PM · 30 min</AppText>
          </View>
          <SuccessIllustration size={60} />
        </View>
        <TouchableOpacity
          style={[styles.joinButton, { backgroundColor: '#FFFFFF' }]}
          onPress={() => navigation.navigate('Consultations')}
          activeOpacity={0.8}
        >
          <AppText variant="body" style={{ color: '#1B4332', fontWeight: '600' }}>Join Now</AppText>
        </TouchableOpacity>
      </Card>

      {/* Quick Actions */}
      <View style={[styles.section, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl }]}>
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>Quick Actions</AppText>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.quickActionCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md }]}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.7}
            >
              <AppText variant="h2">{action.icon}</AppText>
              <AppText variant="bodySmall" style={{ color: colors.text.primary, marginTop: spacing.xs, fontWeight: '600' }}>
                {action.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recommended Products */}
      <View style={[styles.section, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl }]}>
        <View style={styles.sectionHeader}>
          <AppText variant="h3">Recommended for You</AppText>
          <TouchableOpacity onPress={() => navigation.navigate('ShopHome')}>
            <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>See all</AppText>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
          {RECOMMENDED_PRODUCTS.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.productCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md }]}
              onPress={() => navigation.navigate('ShopHome')}
              activeOpacity={0.7}
            >
              <View style={[styles.productImagePlaceholder, { backgroundColor: colors.background.secondary, borderRadius: spacing.sm }]}>
                <AppText variant="caption" style={{ color: colors.text.tertiary }}>🌿</AppText>
              </View>
              <View style={{ padding: 10 }}>
                <AppText variant="caption" style={{ color: colors.action.primary, fontWeight: '600' }}>{product.tag}</AppText>
                <AppText variant="bodySmall" style={{ color: colors.text.primary, marginTop: 2 }} numberOfLines={1}>{product.name}</AppText>
                <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '700', marginTop: 4 }}>₹{product.price}</AppText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Health Records */}
      <View style={[styles.section, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl, marginBottom: spacing.xxl }]}>
        <View style={styles.sectionHeader}>
          <AppText variant="h3">Recent Health Records</AppText>
          <TouchableOpacity onPress={() => navigation.navigate('HealthRecords')}>
            <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>See all</AppText>
          </TouchableOpacity>
        </View>
        {RECENT_RECORDS.map((record) => (
          <TouchableOpacity
            key={record.id}
            style={[styles.recordCard, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md }]}
            onPress={() => navigation.navigate('HealthRecords')}
            activeOpacity={0.7}
          >
            <View style={[styles.recordIcon, { backgroundColor: colors.action.primarySoft }]}>
              <AppText variant="body" style={{ color: colors.action.primary }}>📋</AppText>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600' }}>{record.title}</AppText>
              <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginTop: 2 }}>{record.doctor}</AppText>
            </View>
            <AppText variant="caption" style={{ color: colors.text.tertiary }}>{record.date}</AppText>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultationBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1B4332',
    borderRadius: 12,
    padding: 20,
  } as const,
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  joinButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  productCard: {
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
