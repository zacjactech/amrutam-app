// Health Records Module - Attachment Thumbnail

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Attachment } from '../types';
import { AppText } from '../../../shared/components/AppText';
import { useThemeColors } from '../../../shared/components/ThemeProvider';

interface AttachmentThumbnailProps {
  attachment: Attachment;
  onPress: (attachment: Attachment) => void;
}

export function AttachmentThumbnail({ attachment, onPress }: AttachmentThumbnailProps) {
  const colors = useThemeColors();
  const isPdf = attachment.mimeType === 'application/pdf';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(attachment)}
      activeOpacity={0.7}
    >
      {isPdf || !attachment.thumbnailUrl ? (
        <View style={[styles.pdfPlaceholder, { backgroundColor: colors.status.error + '20' }]}>
          <AppText variant="caption" style={{ color: colors.status.error, fontWeight: '600' }}>
            {isPdf ? 'PDF' : 'IMG'}
          </AppText>
        </View>
      ) : (
        <Image
          source={{ uri: attachment.thumbnailUrl }}
          style={[styles.image, { backgroundColor: colors.background.secondary }]}
          contentFit="cover"
          placeholder={{ blurhash: 'LGF5?xYk^6%M%%2e2~qoJ^Rj@AjZ' }}
        />
      )}
      <AppText variant="caption" style={{ marginTop: 4 }} numberOfLines={1}>
        {attachment.name}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  pdfPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
