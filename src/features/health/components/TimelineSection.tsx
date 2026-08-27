// Health Records Module - Timeline Section

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../shared/components/AppText';
import { HealthRecord } from '../types';
import { AttachmentThumbnail } from './AttachmentThumbnail';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface TimelineSectionProps {
  dateLabel: string;
  records: HealthRecord[];
  onAttachmentPress: (attachment: HealthRecord['attachments'][0]) => void;
}

export function TimelineSection({ dateLabel, records, onAttachmentPress }: TimelineSectionProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={[styles.container, { marginBottom: spacing.lg }]}>
      <View style={[styles.dateHeader, { backgroundColor: colors.background.secondary, paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: 4, alignSelf: 'flex-start', marginBottom: spacing.sm }]}>
        <AppText variant="label" style={{ color: colors.text.secondary }}>
          {dateLabel}
        </AppText>
      </View>
      {records.map((record) => (
        <View key={record.id} style={[styles.card, { backgroundColor: colors.surface.default, borderRadius: spacing.md, padding: spacing.md, marginBottom: spacing.sm }]}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <AppText variant="body" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                {record.title}
              </AppText>
              <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
                {record.type.replace('_', ' ').toUpperCase()}
              </AppText>
            </View>
          </View>
          {record.description && (
            <AppText variant="bodySmall" style={{ color: colors.text.secondary, marginTop: spacing.sm, marginBottom: spacing.sm }}>
              {record.description}
            </AppText>
          )}
          {record.tags.length > 0 && (
            <View style={styles.tagRow}>
              {record.tags.map((tag) => (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.background.secondary, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 4 }]}>
                  <AppText variant="caption" style={{ color: colors.text.secondary }}>
                    #{tag}
                  </AppText>
                </View>
              ))}
            </View>
          )}
          {record.attachments.length > 0 && (
            <View style={[styles.attachmentRow, { marginTop: spacing.sm }]}>
              {record.attachments.map((attachment) => (
                <AttachmentThumbnail
                  key={attachment.id}
                  attachment={attachment}
                  onPress={onAttachmentPress}
                />
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  dateHeader: {},
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {},
  attachmentRow: {
    flexDirection: 'row',
  },
});
