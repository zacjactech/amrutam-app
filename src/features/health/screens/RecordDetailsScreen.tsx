// Health Records Module - Record Details Screen

import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useHealthRecord } from '../hooks';
import { Button } from '../../../shared/components/Button';
import { AppText } from '../../../shared/components/AppText';
import { RecordTypeChip } from '../components/RecordTypeChip';
import { AttachmentThumbnail } from '../components/AttachmentThumbnail';
import { HealthRecord } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface RecordDetailsScreenProps {
  route: {
    params: { recordId: string };
  };
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: { attachment: HealthRecord['attachments'][0] }) => void;
  };
}

export function RecordDetailsScreen({ route, navigation }: RecordDetailsScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { recordId } = route.params;
  const { data: record, isLoading, isError } = useHealthRecord(recordId);

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.action.primary} />
      </View>
    );
  }

  if (isError || !record) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <AppText variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
          Record not found
        </AppText>
        <Button title="Go Back" variant="primary" size="medium" onPress={navigation.goBack} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.content, { padding: spacing.lg }]}>
        <AppText variant="h2" style={{ marginBottom: spacing.sm }}>
          {record.title}
        </AppText>
        <View style={styles.metaRow}>
          <RecordTypeChip type={record.type} />
          <AppText variant="bodySmall" style={{ color: colors.text.secondary }}>
            {new Date(record.occurredAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </AppText>
        </View>

        {record.description && (
          <View style={[styles.section, { marginTop: spacing.lg }]}>
            <AppText variant="h3" style={{ marginBottom: spacing.sm }}>Description</AppText>
            <AppText variant="body" style={{ color: colors.text.secondary }}>
              {record.description}
            </AppText>
          </View>
        )}

        {record.tags.length > 0 && (
          <View style={[styles.section, { marginTop: spacing.lg }]}>
            <AppText variant="h3" style={{ marginBottom: spacing.sm }}>Tags</AppText>
            <View style={styles.tagRow}>
              {record.tags.map((tag) => (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.background.secondary, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 4 }]}>
                  <AppText variant="caption" style={{ color: colors.text.secondary }}>
                    #{tag}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        )}

        {record.attachments.length > 0 && (
          <View style={[styles.section, { marginTop: spacing.lg }]}>
            <AppText variant="h3" style={{ marginBottom: spacing.sm }}>Attachments</AppText>
            <View style={styles.attachmentRow}>
              {record.attachments.map((attachment) => (
                <AttachmentThumbnail
                  key={attachment.id}
                  attachment={attachment}
                  onPress={(att) => navigation.navigate('AttachmentPreview', { attachment: att })}
                />
              ))}
            </View>
          </View>
        )}

        <View style={{ marginTop: spacing.xxl }}>
          <Button
            title="Close"
            variant="primary"
            size="large"
            onPress={navigation.goBack}
            style={styles.closeButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {},
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  section: {},
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {},
  attachmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  closeButton: {
    width: '100%',
  },
});
