// Consultation Module - Search Screen (C03)

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { ArrowLeft, Search } from '../../../shared/assets/icons';

interface DoctorSearchScreenProps {
  onBack: () => void;
  onDoctorPress: (doctorId: string) => void;
}

const RECENT_SEARCHES = ['Ayurvedic Physician', 'Dr. Sharma', 'Skin'];
const RECENTLY_VIEWED = [
  {
    id: 'doc_00001',
    name: 'Dr. Ananya Sharma',
    specialization: 'Ayurvedic Physician · 12 Yrs Exp',
    photoUrl: 'https://api.dicebear.com/7.x/person/svg?seed=1',
  },
  {
    id: 'doc_00002',
    name: 'Dr. Priya Nair',
    specialization: 'Skin & Hair Specialist · 9 Yrs Exp',
    photoUrl: 'https://api.dicebear.com/7.x/person/svg?seed=2',
  },
];

export function DoctorSearchScreen({
  onBack,
  onDoctorPress,
}: DoctorSearchScreenProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);

  const handleRemoveSearch = useCallback((term: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== term));
  }, []);

  const handleSearchSubmit = useCallback(() => {
    if (query.trim().length > 0 && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev].slice(0, 10));
    }
  }, [query, recentSearches]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View
        style={[
          styles.searchHeader,
          {
            backgroundColor: colors.surface.default,
            borderBottomColor: colors.border.default,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onBack}
          style={{ padding: spacing.xs, marginRight: spacing.sm }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft width={20} height={20} color={colors.text.primary} />
        </TouchableOpacity>
        <View
          style={[
            styles.searchInputContainer,
            {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
        >
          <Search
            width={18}
            height={18}
            color={colors.text.tertiary}
            style={{ marginRight: spacing.sm }}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary, flex: 1 }]}
            placeholder="Search doctors, specializations..."
            placeholderTextColor={colors.text.tertiary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            autoFocus
            returnKeyType="search"
          />
        </View>
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery('')}
            style={{ padding: spacing.xs }}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <AppText variant="body" style={{ color: colors.text.tertiary }}>
              ✕
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {recentSearches.length > 0 && (
          <View style={{ marginBottom: spacing.xxl }}>
            <AppText
              variant="label"
              style={{
                color: colors.text.secondary,
                marginBottom: spacing.md,
                textTransform: 'uppercase',
              }}
            >
              Recent searches
            </AppText>
            <View style={[styles.chipRow, { gap: spacing.sm }]}>
              {recentSearches.map((term) => (
                <View
                  key={term}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: colors.surface.default,
                      borderColor: colors.border.default,
                      borderRadius: 999,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                    },
                  ]}
                >
                  <AppText
                    variant="bodySmall"
                    style={{ color: colors.text.primary }}
                  >
                    {term}
                  </AppText>
                  <TouchableOpacity
                    onPress={() => handleRemoveSearch(term)}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    accessibilityLabel={`Remove ${term} from recent searches`}
                    accessibilityRole="button"
                  >
                    <AppText
                      variant="bodySmall"
                      style={{
                        color: colors.text.tertiary,
                        marginLeft: spacing.sm,
                      }}
                    >
                      ✕
                    </AppText>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {RECENTLY_VIEWED.length > 0 && (
          <View>
            <AppText
              variant="label"
              style={{
                color: colors.text.secondary,
                marginBottom: spacing.md,
                textTransform: 'uppercase',
              }}
            >
              Recently viewed
            </AppText>
            {RECENTLY_VIEWED.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={[
                  styles.viewedRow,
                  {
                    borderBottomColor: colors.border.light,
                    borderBottomWidth: 1,
                    paddingVertical: spacing.md,
                  },
                ]}
                onPress={() => onDoctorPress(doc.id)}
                activeOpacity={0.7}
                accessibilityLabel={`View profile of ${doc.name}`}
                accessibilityRole="button"
              >
                <Image
                  source={{ uri: doc.photoUrl }}
                  style={[
                    styles.viewedAvatar,
                    {
                      borderRadius: spacing.md,
                      backgroundColor: colors.action.primarySoft,
                    },
                  ]}
                  contentFit="cover"
                />
                <View style={[styles.viewedInfo, { marginLeft: spacing.md }]}>
                  <AppText
                    variant="body"
                    style={{ color: colors.text.primary, fontWeight: '500' }}
                  >
                    {doc.name}
                  </AppText>
                  <AppText
                    variant="bodySmall"
                    style={{
                      color: colors.text.secondary,
                      marginTop: spacing.xs,
                    }}
                  >
                    {doc.specialization}
                  </AppText>
                </View>
                <AppText
                  variant="body"
                  style={{ color: colors.text.tertiary }}
                >
                  ›
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  searchInputContainer: {},
  searchInput: { fontSize: 16, paddingVertical: 4 },
  content: {},
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  viewedRow: { flexDirection: 'row', alignItems: 'center' },
  viewedAvatar: { width: 48, height: 48 },
  viewedInfo: { flex: 1 },
});
