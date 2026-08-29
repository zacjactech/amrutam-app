// TabBar - Bottom tab navigation bar

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';
import { TabHome, TabConsults, TabShop, TabRecords, TabProfile } from '../assets/icons';

type TabKey = 'home' | 'consults' | 'shop' | 'records' | 'profile';

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ width: number; height: number; color?: string }>;
}

interface TabBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  style?: ViewStyle;
}

const TABS: TabItem[] = [
  { key: 'home', label: 'Home', icon: TabHome },
  { key: 'consults', label: 'Consults', icon: TabConsults },
  { key: 'shop', label: 'Shop', icon: TabShop },
  { key: 'records', label: 'Records', icon: TabRecords },
  { key: 'profile', label: 'Profile', icon: TabProfile },
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
          paddingBottom: spacing.md,
          paddingTop: spacing.md,
        },
        style,
      ]}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        const IconComponent = tab.icon;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <IconComponent
              width={32}
              height={32}
              color={isActive ? colors.action.primary : colors.text.tertiary}
            />
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
});
