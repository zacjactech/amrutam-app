// Home Module - Home Dashboard Screen

import React, { useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { Avatar } from '../../../shared/components/Avatar';
import { Skeleton } from '../../../shared/components/Skeleton';
import { AppErrorState } from '../../../shared/components/AppErrorState';
import {
  useThemeColors,
  useThemeSpacing,
} from '../../../shared/components/ThemeProvider';
import { useBookings } from '../../consultation/hooks';
import { useProducts } from '../../shop/hooks';
import { useHealthRecords } from '../../health/hooks';
import { RECORD_TYPE_LABELS, type HealthRecord } from '../../health/types';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import { productImageContainer } from '../../../shared/assets/images';
import {
  TabConsults,
  TabRecords,
  ShoppingBag,
  Clipboard,
  Stethoscope,
} from '../../../shared/assets/icons';

interface HomeDashboardScreenProps {
  navigation: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}



const QUICK_ACTIONS = [
  {
    key: 'consult',
    label: 'Consult',
    icon: TabConsults,
    screen: 'Consultations' as const,
    accessibilityHint: 'Browse and book Ayurvedic consultations',
  },
  {
    key: 'records',
    label: 'Records',
    icon: TabRecords,
    screen: 'HealthRecords' as const,
    accessibilityHint: 'View your health records and history',
  },
  {
    key: 'shop',
    label: 'Shop',
    icon: ShoppingBag,
    screen: 'ShopHome' as const,
    accessibilityHint: 'Browse Ayurvedic products and supplements',
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatBookingTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return isToday ? `Today, ${timeStr}` : `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${timeStr}`;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Skeleton Sections ────────────────────────────────────────────────────────

function GreetingSkeleton() {
  const spacing = useThemeSpacing();
  return (
    <View
      style={[styles.greeting, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl }]}
      accessibilityLabel="Loading greeting"
    >
      <View style={{ gap: spacing.xs }}>
        <Skeleton width={100} height={14} />
        <Skeleton width={180} height={22} />
      </View>
      <Skeleton width={48} height={48} borderRadius={24} />
    </View>
  );
}

function BannerSkeleton() {
  const spacing = useThemeSpacing();
  const colors = useThemeColors();
  return (
    <Card
      variant="elevated"
      style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg, backgroundColor: colors.action.primaryPressed, borderRadius: spacing.md, padding: spacing.xl }}
    >
      <View style={{ gap: spacing.sm }}>
        <Skeleton width={160} height={12} />
        <Skeleton width={200} height={18} />
        <Skeleton width={140} height={12} />
      </View>
      <Skeleton width={100} height={36} borderRadius={8} style={{ marginTop: spacing.lg }} />
    </Card>
  );
}

function ProductsSkeleton() {
  const spacing = useThemeSpacing();
  return (
    <View style={[styles.section, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl }]}>
      <Skeleton width={180} height={18} style={{ marginBottom: spacing.md }} />
      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={{ width: 160 }}>
            <Skeleton width={160} height={100} borderRadius={8} />
            <View style={{ padding: spacing.sm, gap: spacing.xs }}>
              <Skeleton width={60} height={10} />
              <Skeleton width={120} height={12} />
              <Skeleton width={50} height={14} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function RecordsSkeleton() {
  const spacing = useThemeSpacing();
  return (
    <View style={[styles.section, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl }]}>
      <Skeleton width={200} height={18} style={{ marginBottom: spacing.md }} />
      {[1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.recordCard,
            {
              backgroundColor: 'transparent',
              borderRadius: spacing.md,
              padding: spacing.md,
              marginBottom: spacing.sm,
            },
          ]}
        >
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={{ flex: 1, marginLeft: spacing.md, gap: spacing.xs }}>
            <Skeleton width={140} height={14} />
            <Skeleton width={100} height={12} />
          </View>
          <Skeleton width={70} height={12} />
        </View>
      ))}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomeDashboardScreen({ navigation }: HomeDashboardScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  const { userName: authUserName } = useAuthContext();

  // Data hooks
  const bookingsQuery = useBookings();
  const productsQuery = useProducts({ ...({ searchQuery: '', categories: [], minPrice: null, maxPrice: null, minRating: null, inStockOnly: true, sortBy: 'popularity' as const }) });
  const recordsQuery = useHealthRecords({ searchQuery: '', types: [], tags: [], fromDate: null, toDate: null });

  const isLoading = bookingsQuery.isLoading || productsQuery.isLoading || recordsQuery.isLoading;
  const hasError = bookingsQuery.isError || productsQuery.isError || recordsQuery.isError;
  const isRefreshing = bookingsQuery.isRefetching || productsQuery.isRefetching || recordsQuery.isRefetching;

  const onRefresh = useCallback(() => {
    bookingsQuery.refetch();
    productsQuery.refetch();
    recordsQuery.refetch();
  }, [bookingsQuery, productsQuery, recordsQuery]);

  // Derived data
  const upcomingBooking = useMemo(() => {
    if (!bookingsQuery.data) return null;
    // Pick the most recently updated active booking (updatedAt reflects status changes
    // like confirmation, which is a better proxy for relevance than createdAt)
    return bookingsQuery.data
      .filter((b) => b.status === 'confirmed' || b.status === 'pending_confirmation' || b.status === 'pending_sync')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0] ?? null;
  }, [bookingsQuery.data]);

  const recommendedProducts = useMemo(() => {
    if (!productsQuery.data) return [];
    return productsQuery.data.data.slice(0, 6);
  }, [productsQuery.data]);

  const recentRecords: HealthRecord[] = useMemo(() => {
    const pages = recordsQuery.data?.pages;
    if (!pages || pages.length === 0) return [];
    const firstPage = pages[0];
    if (!firstPage) return [];
    const items = Array.isArray(firstPage) ? firstPage : (firstPage as { data: HealthRecord[] }).data;
    return items.slice(0, 3);
  }, [recordsQuery.data]);

  const userName = authUserName ?? 'User';

  // ─── Error State ──────────────────────────────────────────────────────────

  if (hasError && !isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <AppErrorState
          error={bookingsQuery.error ?? productsQuery.error ?? recordsQuery.error}
          title="Unable to load dashboard"
          message="Something went wrong while loading your data. Please try again."
          onRetry={onRefresh}
          actionLabel="Try again"
        />
      </View>
    );
  }

  // ─── Loading State ────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background.primary }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
      >
        <GreetingSkeleton />
        <BannerSkeleton />
        <ProductsSkeleton />
        <RecordsSkeleton />
      </ScrollView>
    );
  }

  // ─── Main Content ─────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: spacing.xxl }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.action.primary}
          colors={[colors.action.primary]}
        />
      }
    >
      {/* Greeting Section */}
      <View
        style={[styles.greeting, { paddingHorizontal: spacing.lg, paddingTop: spacing.xl }]}
        accessible
        accessibilityRole="header"
      >
        <View>
          <AppText variant="body" style={{ color: colors.text.secondary }}>
            {getGreeting()}
          </AppText>
          <AppText variant="h2" style={{ color: colors.text.primary,            marginTop: spacing.xs }}>
            Welcome back, {userName}!
          </AppText>
        </View>
        <Avatar initials={userName.charAt(0)} size="md" />
      </View>

      {/* Upcoming Consultation Banner */}
      {upcomingBooking !== null ? (
        <Card
          variant="elevated"
          style={{
            marginHorizontal: spacing.lg,
            marginTop: spacing.lg,
            backgroundColor: colors.action.primaryPressed,
            borderRadius: spacing.md,
            padding: spacing.xl,
          }}
        >
          <View style={styles.bannerContent}>
            <View style={{ flex: 1 }}>
              <AppText variant="body" style={{            color: colors.text.inverse, marginBottom: spacing.xs }}>
                Upcoming Consultation
              </AppText>
              <AppText variant="h4" style={{ color: colors.text.inverse, fontWeight: '700' }}>
                {upcomingBooking.consultationType === 'video' ? 'Video' : upcomingBooking.consultationType === 'audio' ? 'Audio' : upcomingBooking.consultationType === 'chat' ? 'Chat' : 'In-person'} Consultation
              </AppText>
              <AppText variant="bodySmall" style={{            color: colors.text.inverse, marginTop: spacing.xs, opacity: 0.8 }}>
                {formatBookingTime(upcomingBooking.updatedAt)} · {upcomingBooking.status === 'confirmed' ? 'Confirmed' : upcomingBooking.status === 'pending_sync' ? 'Syncing' : 'Pending'}
              </AppText>
            </View>
            <Stethoscope width={48} height={48} color={colors.text.inverse} />
          </View>
          <TouchableOpacity
            style={[styles.joinButton, { backgroundColor: colors.surface.default }]}
            onPress={() => navigation.navigate('Consultations')}
            activeOpacity={0.8}
            accessibilityLabel="View consultation details"
            accessibilityRole="button"
            accessibilityHint="Opens the consultation screen to view or join your upcoming appointment"
          >
            <AppText variant="body" style={{ color: colors.action.primaryPressed, fontWeight: '600' }}>
              View Details
            </AppText>
          </TouchableOpacity>
        </Card>
      ) : (
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <Card
            variant="outlined"
            style={{ borderRadius: spacing.md, padding: spacing.xl, alignItems: 'center' }}
          >
            <Stethoscope width={40} height={40} color={colors.action.primary} />
            <AppText variant="h4" style={{            color: colors.text.primary, marginTop: spacing.md, marginBottom: spacing.xs }}>
              No upcoming consultations
            </AppText>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textAlign: 'center' }}>
              Book an Ayurvedic consultation to start your wellness journey
            </AppText>
            <Button
              title="Book Consultation"
              variant="primary"
              size="small"
              onPress={() => navigation.navigate('Consultations')}
            />
          </Card>
        </View>
      )}

      {/* Quick Actions */}
      <View
        style={[styles.section, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl }]}
        accessible
        accessibilityRole="none"
        accessibilityLabel="Quick actions"
      >
        <AppText variant="h3" style={{ marginBottom: spacing.md }}>
          Quick Actions
        </AppText>
        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => {
            const IconComponent = action.icon;
            return (
              <TouchableOpacity
                key={action.key}
                style={[
                  styles.quickActionCard,
                  {
                    backgroundColor: colors.surface.default,
                    borderRadius: spacing.md,
                  },
                ]}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.7}
                accessibilityLabel={action.label}
                accessibilityRole="button"
                accessibilityHint={action.accessibilityHint}
              >
                <View style={styles.quickActionIcon}>
                  <IconComponent width={28} height={28} color={colors.action.primary} />
                </View>
                <AppText
                  variant="bodySmall"
                  style={{ color: colors.text.primary, marginTop: spacing.xs, fontWeight: '600' }}
                >
                  {action.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Recommended Products */}
      <View style={[styles.section, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl }]}>
        <View style={styles.sectionHeader}>
          <AppText variant="h3">Recommended for You</AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate('ShopHome')}
            accessibilityLabel="See all products"
            accessibilityRole="link"
          >
            <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>
              See all
            </AppText>
          </TouchableOpacity>
        </View>

        {recommendedProducts.length === 0 ? (
          <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
            <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
              No products to show yet
            </AppText>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.md }}
          >
            {recommendedProducts.map((product: { id: string; name: string; category: string; price: number; imageUrl: string; tags: string[] }) => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.productCard,
                  {
                    backgroundColor: colors.surface.default,
                    borderRadius: spacing.md,
                  },
                ]}
                onPress={() => navigation.navigate('ShopHome')}
                activeOpacity={0.7}
                accessibilityLabel={`${product.name}, ${formatCurrency(product.price)}`}
                accessibilityRole="button"
                accessibilityHint={`View ${product.name} in the shop`}
              >
                <View
                  style={[
                    styles.productImagePlaceholder,
                    {
                      backgroundColor: colors.background.secondary,
                      borderRadius: spacing.sm,
                    },
                  ]}
                >
                  <Image
                    source={product.imageUrl ? { uri: product.imageUrl } : productImageContainer}
                    style={{ width: '100%', height: '100%', borderRadius: spacing.sm }}
                    contentFit="cover"
                    placeholder={{ blurhash: 'LGF5?xYk^6%M%%2e2~qoJ^Rj@AjZ' }}
                  />
                </View>
                <View style={{ padding: spacing.sm }}>
                  <AppText
                    variant="caption"
                    style={{ color: colors.action.primary, fontWeight: '600' }}
                  >
                    {product.category}
                  </AppText>
                  <AppText
                    variant="bodySmall"
                    style={{ color: colors.text.primary, marginTop: spacing.xs }}
                    numberOfLines={1}
                  >
                    {product.name}
                  </AppText>
                  <AppText
                    variant="body"
                    style={{ color: colors.action.primary, fontWeight: '700', marginTop: spacing.xs }}
                  >
                    {formatCurrency(product.price)}
                  </AppText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Recent Health Records */}
      <View style={[styles.section, { paddingHorizontal: spacing.lg, marginTop: spacing.xxl }]}>
        <View style={styles.sectionHeader}>
          <AppText variant="h3">Recent Health Records</AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate('HealthRecords')}
            accessibilityLabel="See all health records"
            accessibilityRole="link"
          >
            <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>
              See all
            </AppText>
          </TouchableOpacity>
        </View>

        {recentRecords.length === 0 ? (
          <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
            <Clipboard width={32} height={32} color={colors.text.tertiary} />
            <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginTop: spacing.sm }}>
              No health records yet
            </AppText>
          </View>
        ) : (
          recentRecords.map((record) => (
            <TouchableOpacity
              key={record.id}
              style={[
                styles.recordCard,
                {
                  backgroundColor: colors.surface.default,
                  borderRadius: spacing.md,
                  padding: spacing.md,
                },
              ]}
              onPress={() => navigation.navigate('HealthRecords')}
              activeOpacity={0.7}
              accessibilityLabel={`${RECORD_TYPE_LABELS[record.type]}: ${record.title}`}
              accessibilityRole="button"
              accessibilityHint={`View ${record.title} health record details`}
            >
              <View
                style={[
                  styles.recordIcon,
                  { backgroundColor: colors.action.primarySoft },
                ]}
              >
                <Clipboard width={20} height={20} color={colors.action.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <AppText
                  variant="body"
                  style={{ color: colors.text.primary, fontWeight: '600' }}
                  numberOfLines={1}
                >
                  {record.title}
                </AppText>
                <AppText
                  variant="bodySmall"
                  style={{ color: colors.text.secondary, marginTop: spacing.xs }}
                >
                  {RECORD_TYPE_LABELS[record.type]}
                </AppText>
              </View>
              <AppText variant="caption" style={{ color: colors.text.tertiary }}>
                {formatDate(record.occurredAt)}
              </AppText>
            </TouchableOpacity>
          ))
        )}
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
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  joinButton: {
    marginTop: 16,
    paddingVertical: 12,
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
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  productCard: {
    width: 160,
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
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
