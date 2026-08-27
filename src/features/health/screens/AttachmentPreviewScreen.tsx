// Health Records Module - Attachment Preview Screen

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '../../../shared/components/AppText';
import { Attachment } from '../types';
import { useThemeColors, useThemeSpacing } from '../../../shared/components/ThemeProvider';

interface AttachmentPreviewScreenProps {
  route: {
    params: { attachment: Attachment };
  };
  navigation: {
    goBack: () => void;
  };
}

export function AttachmentPreviewScreen({ route }: AttachmentPreviewScreenProps) {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const { attachment } = route.params;
  const isPdf = attachment.mimeType === 'application/pdf';

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView contentContainerStyle={[styles.content, { padding: spacing.lg }]}>
        <AppText variant="h3" style={{ marginBottom: spacing.md, textAlign: 'center' }}>
          {attachment.name}
        </AppText>
        {isPdf ? (
          <View style={[styles.pdfPlaceholder, { backgroundColor: colors.status.error + '20', padding: spacing.xxl, borderRadius: spacing.md, alignItems: 'center' }]}>
            <AppText variant="h2" style={{ color: colors.status.error, marginBottom: spacing.sm }}>
              PDF Document
            </AppText>
            <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>
              PDF preview is not available in this build.
              {'\n'}
              Please use an external PDF viewer.
            </AppText>
          </View>
        ) : attachment.thumbnailUrl ? (
          <Image
            source={{ uri: attachment.thumbnailUrl }}
            style={styles.image}
            contentFit="contain"
            placeholder={{ blurhash: 'LGF5?xYk^6%M%%2e2~qoJ^Rj@AjZ' }}
          />
        ) : (
          <View style={[styles.pdfPlaceholder, { backgroundColor: colors.status.error + '20', padding: spacing.xxl, borderRadius: spacing.md, alignItems: 'center' }]}>
            <AppText variant="h2" style={{ color: colors.status.error, marginBottom: spacing.sm }}>
              No Preview
            </AppText>
            <AppText variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>
              Preview is not available for this attachment.
            </AppText>
          </View>
        )}
        <View style={[styles.meta, { marginTop: spacing.lg, padding: spacing.md, backgroundColor: colors.surface.default, borderRadius: spacing.md }]}>
          <AppText variant="body" style={{ color: colors.text.secondary }}>
            Type: {attachment.mimeType}
          </AppText>
          {attachment.sizeBytes && (
            <AppText variant="body" style={{ color: colors.text.secondary }}>
              Size: {(attachment.sizeBytes / 1024).toFixed(1)} KB
            </AppText>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F0F2EF',
    borderRadius: 8,
  },
  pdfPlaceholder: {},
  meta: {},
});
