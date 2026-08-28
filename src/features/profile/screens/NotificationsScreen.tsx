// Profile Module - Notifications Screen

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { AppText } from '../../../shared/components/AppText';

import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { useAuthContext } from '../../../infrastructure/auth/AuthContext';
import {
  Bell,
  Clock,
  AlertTriangle,
  Stethoscope,
  ShoppingBag,
  Shield,
} from '../../../shared/assets/icons';

type NotificationType = 'consultation' | 'order' | 'health' | 'reminder' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NOTIFICATION_ICONS: Record<NotificationType, React.ComponentType<{ width: number; height: number; color?: string }>> = {
  consultation: Stethoscope,
  order: ShoppingBag,
  health: Shield,
  reminder: Clock,
  system: AlertTriangle,
};

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  consultation: '#2D6A4F',
  order: '#F59E0B',
  health: '#3B82F6',
  reminder: '#7C3AED',
  system: '#DC2626',
};

interface NotificationsScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // In a real app, this would fetch from backend
    // For now, we show an empty state which is the correct behavior
    // when no notifications exist yet
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleNotificationPress = useCallback((notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
  }, []);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.sm }]}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={navigation.goBack} hitSlop={8}>
            <AppText variant="body" style={{ color: colors.action.primary }}>
              ← Back
            </AppText>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <AppText variant="h1">Notifications</AppText>
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.action.primary }]}>
                <AppText variant="caption" style={{ color: colors.text.inverse, fontWeight: '700' }}>
                  {unreadCount}
                </AppText>
              </View>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead}>
              <AppText variant="bodySmall" style={{ color: colors.action.primary, fontWeight: '600' }}>
                Mark all read
              </AppText>
            </TouchableOpacity>
          )}
          {unreadCount === 0 && <View style={{ width: 60 }} />}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.action.primary}
            colors={[colors.action.primary]}
          />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: colors.action.primarySoft }]}>
              <Bell width={40} height={40} color={colors.action.primary} />
            </View>
            <AppText variant="h3" style={{ color: colors.text.primary, marginTop: spacing.lg, marginBottom: spacing.sm }}>
              No notifications yet
            </AppText>
            <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center', lineHeight: 22 }}>
              You'll see notifications about your consultations, orders, and health records here.
            </AppText>
          </View>
        ) : (
          notifications.map((notification) => {
            const IconComponent = NOTIFICATION_ICONS[notification.type];
            const iconColor = NOTIFICATION_COLORS[notification.type];

            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  {
                    backgroundColor: notification.read ? colors.surface.default : colors.action.primarySoft,
                    borderRadius: spacing.md,
                    padding: spacing.md,
                    marginBottom: spacing.sm,
                  },
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View style={styles.notificationRow}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: iconColor + '15', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
                    ]}
                  >
                    <IconComponent width={20} height={20} color={iconColor} />
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <AppText
                        variant="body"
                        style={{ color: colors.text.primary, fontWeight: notification.read ? '400' : '600', flex: 1 }}
                        numberOfLines={1}
                      >
                        {notification.title}
                      </AppText>
                      {!notification.read && (
                        <View style={[styles.unreadDot, { backgroundColor: colors.action.primary }]} />
                      )}
                    </View>
                    <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginTop: spacing.xs }} numberOfLines={2}>
                      {notification.message}
                    </AppText>
                    <AppText variant="caption" style={{ color: colors.text.tertiary, marginTop: spacing.xs }}>
                      {formatTimestamp(notification.timestamp)}
                    </AppText>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {},
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    minWidth: 24,
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {},
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});
