// Health Records Module - Tag Filter Bottom Sheet

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheet } from '../../../shared/components/BottomSheet';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

const AVAILABLE_TAGS = [
  'Routine',
  'Follow-up',
  'Chronic',
  'Blood Test',
  'Medication',
  'Allergy',
  'Vaccination',
  'Prevention',
  'Annual',
] as const;

interface TagFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedTags: string[];
  onApply: (tags: string[]) => void;
}

export function TagFilterSheet({ visible, onClose, selectedTags, onApply }: TagFilterSheetProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const [localTags, setLocalTags] = useState<string[]>(selectedTags);

  React.useEffect(() => {
    setLocalTags(selectedTags);
  }, [selectedTags]);

  const toggleTag = useCallback((tag: string) => {
    setLocalTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const handleReset = useCallback(() => {
    setLocalTags([]);
  }, []);

  const handleApply = useCallback(() => {
    onApply(localTags);
    onClose();
  }, [localTags, onApply, onClose]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Filter by tags"
      bottomAction={
        <View style={styles.bottomActions}>
          <Button title="Clear" variant="ghost" size="medium" onPress={handleReset} style={{ flex: 1 }} />
          <Button title="Apply Tags" variant="primary" size="medium" onPress={handleApply} style={{ flex: 2 }} />
        </View>
      }
    >
      <View style={styles.headerRow}>
        <AppText variant="h4" style={{ color: colors.text.primary }}>
          Filter by tags
        </AppText>
        <TouchableOpacity onPress={handleReset} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <AppText variant="body" style={{ color: colors.action.primary, fontWeight: '600' }}>
            Reset
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.chipGrid}>
        {AVAILABLE_TAGS.map((tag) => {
          const isSelected = localTags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              onPress={() => toggleTag(tag)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.action.primary : 'transparent',
                  borderColor: isSelected ? colors.action.primary : colors.border.default,
                },
              ]}
            >
              {isSelected && (
                <AppText variant="caption" style={{ color: colors.text.inverse, marginRight: spacing.xs }}>
                  ✓
                </AppText>
              )}
              <AppText
                variant="body"
                style={{
                  color: isSelected ? colors.text.inverse : colors.text.primary,
                  fontWeight: isSelected ? '600' : '400',
                }}
              >
                {tag}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
