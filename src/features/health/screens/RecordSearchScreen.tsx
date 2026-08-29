// Health Records Module - Record Search Screen

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SearchBar } from '../../../shared/components/SearchBar';
import { AppText } from '../../../shared/components/AppText';
import { HealthRecord, RECORD_TYPE_LABELS } from '../types';
import { useSearchRecords } from '../hooks';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { Flask, Pill, Stethoscope, Syringe, AlertTriangle, ArrowLeft } from '../../../shared/assets/icons';

const RECORD_TYPE_ICONS: Record<string, React.ComponentType<{ width: number; height: number; color?: string }>> = {
  lab_report: Flask,
  prescription: Pill,
  consultation: Stethoscope,
  vaccination: Syringe,
  allergy: AlertTriangle,
};

const RECORD_TYPE_THEME: Record<string, string> = {
  lab_report: 'lab',
  prescription: 'prescription',
  consultation: 'consultation',
  vaccination: 'vaccination',
  allergy: 'allergy',
};

interface RecordSearchScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params: { recordId: string }) => void;
  };
}

export function RecordSearchScreen({ navigation }: RecordSearchScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Blood Test',
    'Prescription',
    'Vaccination',
  ]);

  const { data: results, isLoading } = useSearchRecords(query);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
  }, []);

  const handleRecentPress = useCallback((search: string) => {
    setQuery(search);
  }, []);

  const handleRemoveRecent = useCallback((search: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  }, []);

  const displayResults = useMemo(() => results ?? [], [results]);

  const renderResultItem = useCallback(
    ({ item }: { item: HealthRecord }) => {
      const typeKey = RECORD_TYPE_THEME[item.type] ?? 'lab';
      const typeColor = colors.record[typeKey as keyof typeof colors.record];
      const IconComponent = RECORD_TYPE_ICONS[item.type];
      const date = new Date(item.occurredAt);

      return (
        <TouchableOpacity
          style={[
            styles.resultCard,
            {
              backgroundColor: colors.surface.default,
              padding: spacing.md,
              borderRadius: spacing.md,
              marginBottom: spacing.sm,
            },
          ]}
          onPress={() => navigation.navigate('RecordDetail', { recordId: item.id })}
          activeOpacity={0.7}
          accessibilityLabel={`View ${item.title}`}
          accessibilityRole="button"
        >
          <View style={styles.resultRow}>
            <View
              style={[
                styles.resultIcon,
                {
                  backgroundColor: typeColor + '15',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              {IconComponent && <IconComponent width={18} height={18} color={typeColor} />}
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <AppText variant="body" style={{ color: colors.text.primary, fontWeight: '600' }}>
                {item.title}
              </AppText>
              <View style={styles.metaRow}>
                <AppText variant="caption" style={{ color: typeColor, fontWeight: '500' }}>
                  {RECORD_TYPE_LABELS[item.type]}
                </AppText>
                <AppText variant="caption" style={{ color: colors.text.tertiary }}> • </AppText>
                <AppText variant="caption" style={{ color: colors.text.secondary }}>
                  {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </AppText>
              </View>
              <AppText variant="caption" style={{ color: colors.text.secondary, marginTop: 2 }}>
                {item.description}
              </AppText>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [colors, spacing, navigation],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm, backgroundColor: colors.surface.default }]}>
        <TouchableOpacity onPress={navigation.goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.backBtn} accessibilityLabel="Go back" accessibilityRole="button">
          <ArrowLeft width={20} height={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <SearchBar
            placeholder="Search your health records..."
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      </View>

      {query.length === 0 && (
        <View style={[styles.section, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }]}>
          <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Recent searches
          </AppText>
          <View style={styles.chipRow}>
            {recentSearches.map((search) => (
              <TouchableOpacity
                key={search}
                onPress={() => handleRecentPress(search)}
                style={[
                  styles.recentChip,
                  {
                    backgroundColor: colors.background.secondary,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: 999,
                    marginRight: spacing.sm,
                    marginBottom: spacing.sm,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}
                accessibilityLabel={`Search for ${search}`}
                accessibilityRole="button"
              >
                <AppText variant="body" style={{ color: colors.text.primary, marginRight: spacing.sm }}>
                  {search}
                </AppText>
                <TouchableOpacity
                  onPress={() => handleRemoveRecent(search)}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  accessibilityLabel={`Remove ${search} from recent searches`}
                  accessibilityRole="button"
                >
                  <AppText variant="caption" style={{ color: colors.text.tertiary }}>✕</AppText>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {query.length > 0 && (
        <View style={[styles.resultsSection, { paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}>
          <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Matching Records ({displayResults.length})
          </AppText>
        </View>
      )}

      <FlashList
        data={displayResults}
        renderItem={renderResultItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
        ListEmptyComponent={
          query.length > 0 && !isLoading ? (
            <View style={[styles.emptyState, { padding: spacing.xxl }]}>
              <AppText variant="h3" style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.sm }}>
                No records found
              </AppText>
              <AppText variant="body" style={{ color: colors.text.tertiary, textAlign: 'center' }}>
                Try a different search term
              </AppText>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 4,
  },
  section: {},
  resultsSection: {},
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentChip: {},
  resultCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  resultIcon: {},
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
