// TabBar - Bottom tab navigation bar

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

type TabKey = 'home' | 'consults' | 'shop' | 'records' | 'profile';

interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

interface TabBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  style?: ViewStyle;
}

const TABS: TabItem[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'consults', label: 'Consults', icon: '🩺' },
  { key: 'shop', label: 'Shop', icon: '🛒' },
  { key: 'records', label: 'Records', icon: '📋' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

export function TabBar({ activeTab, onTabPress, style }: TabBarProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface.default,
          borderTopColor: colors.border.default,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
        },
        style,
      ]}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, { fontSize: 20, opacity: isActive ? 1 : 0.5 }]}>
              {tab.icon}
            </Text>
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? colors.action.primary : colors.text.tertiary,
                  fontWeight: isActive ? '600' : '400',
                  marginTop: spacing.xs,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export type { TabKey };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    lineHeight: 24,
  },
  label: {
    fontSize: 11,
  },
});
