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

interface DoctorSearchScreenProps {
  onBack: () => void;
  onDoctorPress: (doctorId: string) => void;
}

const RECENT_SEARCHES = ['Panchakarma', 'Skin specialist', 'Dr. Sharma', 'Mental wellness'];
const RECENTLY_VIEWED = [
  { id: 'doc_00001', name: 'Dr. Aarav Sharma', specialization: 'Panchakarma', photoUrl: 'https://api.dicebear.com/7.x/person/svg?seed=1' },
  { id: 'doc_00002', name: 'Dr. Priya Patel', specialization: 'Skin & Hair', photoUrl: 'https://api.dicebear.com/7.x/person/svg?seed=2' },
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
      <View style={[styles.searchHeader, { backgroundColor: colors.surface.default, borderBottomColor: colors.border.default }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <AppText variant="body" style={{ color: colors.action.primary }}>←</AppText>
        </TouchableOpacity>
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="Search doctors, specializations..."
          placeholderTextColor={colors.text.tertiary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearchSubmit}
          autoFocus
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <AppText variant="body" style={{ color: colors.text.tertiary }}>✕</AppText>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {recentSearches.length > 0 && (
          <View style={{ marginBottom: spacing.xxl }}>
            <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase' }}>Recent searches</AppText>
            <View style={styles.chipRow}>
              {recentSearches.map((term) => (
                <View key={term} style={[styles.chip, { backgroundColor: colors.surface.default, borderColor: colors.border.default, borderRadius: 999 }]}>
                  <AppText variant="bodySmall" style={{ color: colors.text.primary }}>{term}</AppText>
                  <TouchableOpacity onPress={() => handleRemoveSearch(term)} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
                    <AppText variant="bodySmall" style={{ color: colors.text.tertiary, marginLeft: spacing.sm }}>✕</AppText>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {RECENTLY_VIEWED.length > 0 && (
          <View>
            <AppText variant="label" style={{ color: colors.text.secondary, marginBottom: spacing.md, textTransform: 'uppercase' }}>Recently viewed</AppText>
            {RECENTLY_VIEWED.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={[styles.viewedRow, { borderBottomColor: colors.border.light, borderBottomWidth: 1, paddingVertical: spacing.md }]}
                onPress={() => onDoctorPress(doc.id)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: doc.photoUrl }} style={[styles.viewedAvatar, { borderRadius: spacing.md }]} contentFit="cover" />
                <View style={styles.viewedInfo}>
                  <AppText variant="body" style={{ color: colors.text.primary }}>{doc.name}</AppText>
                  <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>{doc.specialization}</AppText>
                </View>
                <AppText variant="body" style={{ color: colors.text.tertiary }}>›</AppText>
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
  searchHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { padding: 8, marginRight: 4 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 4 },
  clearBtn: { padding: 8 },
  content: { padding: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1 },
  viewedRow: { flexDirection: 'row', alignItems: 'center' },
  viewedAvatar: { width: 48, height: 48, backgroundColor: '#E8F3EC' },
  viewedInfo: { flex: 1, marginLeft: 12 },
});
