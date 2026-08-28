// Health Records Module - Attachment Preview Screen

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '../../../shared/components/AppText';
import { Attachment } from '../types';
import { useThemeSpacing } from '../../../shared/components/ThemeProvider';
import { ArrowLeft, Share, IconDownload, FileText, IconPrinter, Search } from '../../../shared/assets/icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface AttachmentPreviewScreenProps {
  route: {
    params: { attachment: Attachment };
  };
  navigation: {
    goBack: () => void;
  };
}

export function AttachmentPreviewScreen({ route, navigation }: AttachmentPreviewScreenProps) {
  const spacing = useThemeSpacing();
  const { attachment } = route.params;
  const isPdf = attachment.mimeType === 'application/pdf';
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3;

  return (
    <View style={[styles.container, { backgroundColor: '#1A1A1A' }]}>
      <View style={[styles.topBar, { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm }]}>
        <TouchableOpacity onPress={navigation.goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft width={20} height={20} color="#FFFFFF" />
        </TouchableOpacity>
        <AppText variant="body" style={{ color: '#FFFFFF', fontWeight: '600', flex: 1, textAlign: 'center', marginHorizontal: spacing.md }} numberOfLines={1}>
          {attachment.name}
        </AppText>
        <View style={styles.topBarActions}>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.topBarBtn}>
            <Share width={18} height={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.topBarBtn}>
            <IconDownload width={18} height={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {isPdf ? (
        <ScrollView contentContainerStyle={styles.pdfContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.pdfPreviewCard, { backgroundColor: '#2A2A2A', borderRadius: spacing.md, padding: spacing.xxl, alignItems: 'center', marginHorizontal: spacing.lg, marginTop: spacing.xxl }]}>
            <FileText width={48} height={48} color="#FFFFFF" style={{ marginBottom: spacing.sm }} />
            <AppText variant="h3" style={{ color: '#FFFFFF', marginBottom: spacing.xs }}>
              PDF Document
            </AppText>
            <AppText variant="body" style={{ color: '#9CA3AF', textAlign: 'center' }}>
              {attachment.name}
            </AppText>
            {attachment.sizeBytes && (
              <AppText variant="caption" style={{ color: '#6B7280', marginTop: spacing.sm }}>
                {(attachment.sizeBytes / 1024).toFixed(1)} KB
              </AppText>
            )}
          </View>

          <View style={[styles.pageThumbnails, { marginTop: spacing.xl, paddingHorizontal: spacing.lg }]}>
            <AppText variant="label" style={{ color: '#9CA3AF', marginBottom: spacing.md }}>
              Pages
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setCurrentPage(idx)}
                  activeOpacity={0.7}
                  style={[
                    styles.pageThumb,
                    {
                      backgroundColor: currentPage === idx ? '#2D6A4F' : '#333333',
                      borderRadius: spacing.sm,
                      marginRight: spacing.sm,
                      width: 64,
                      height: 80,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: currentPage === idx ? 2 : 0,
                      borderColor: '#2D6A4F',
                    },
                  ]}
                >
                  <AppText variant="caption" style={{ color: currentPage === idx ? '#FFFFFF' : '#9CA3AF' }}>
                    {idx + 1}
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={[styles.openWithSection, { marginTop: spacing.xl, paddingHorizontal: spacing.lg }]}>
            <AppText variant="label" style={{ color: '#9CA3AF', marginBottom: spacing.md, textTransform: 'uppercase' }}>
              Open with
            </AppText>
            <View style={[styles.openWithRow, { flexDirection: 'row', gap: spacing.sm }]}>
              {[
                { icon: '📁', label: 'Drive' },
                { icon: '💬', label: 'WhatsApp' },
                { icon: 'print', label: 'Print', isSvg: true },
              ].map((option) => (
                <TouchableOpacity
                  key={option.label}
                  activeOpacity={0.7}
                  style={[styles.openWithBtn, { backgroundColor: '#333333', borderRadius: spacing.md, padding: spacing.md, flex: 1, alignItems: 'center' }]}
                >
                  {option.isSvg ? <IconPrinter width={24} height={24} color="#FFFFFF" style={{ marginBottom: spacing.xs }} /> : <AppText variant="h3" style={{ marginBottom: spacing.xs }}>{option.icon}</AppText>}
                  <AppText variant="caption" style={{ color: '#FFFFFF' }}>{option.label}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.imageContainer}>
          {attachment.thumbnailUrl ? (
            <Image
              source={{ uri: attachment.thumbnailUrl }}
              style={styles.fullImage}
              contentFit="contain"
              placeholder={{ blurhash: 'LGF5?xYk^6%M%%2e2~qoJ^Rj@AjZ' }}
            />
          ) : (
            <View style={[styles.noPreview, { padding: spacing.xxl }]}>
              <AppText variant="h1" style={{ color: '#FFFFFF', marginBottom: spacing.sm }}>🖼️</AppText>
              <AppText variant="h3" style={{ color: '#FFFFFF', marginBottom: spacing.xs }}>
                No Preview Available
              </AppText>
              <AppText variant="body" style={{ color: '#9CA3AF', textAlign: 'center' }}>
                Image preview is not available for this attachment.
              </AppText>
            </View>
          )}

          <View style={[styles.zoomHint, { position: 'absolute', bottom: spacing.xxl, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 999 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Search width={14} height={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <AppText variant="caption" style={{ color: '#FFFFFF' }}>
                Pinch to zoom
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowLeft, { backgroundColor: 'rgba(0,0,0,0.5)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }]}
            onPress={() => setCurrentPage((p) => Math.max(0, p - 1))}
            activeOpacity={0.7}
          >
            <AppText variant="h3" style={{ color: '#FFFFFF' }}>‹</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowRight, { backgroundColor: 'rgba(0,0,0,0.5)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }]}
            onPress={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            activeOpacity={0.7}
          >
            <AppText variant="h3" style={{ color: '#FFFFFF' }}>›</AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topBarActions: { flexDirection: 'row', gap: 8 },
  topBarBtn: { padding: 8 },
  pdfContainer: { paddingBottom: 40 },
  pdfPreviewCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pageThumbnails: {},
  pageThumb: {},
  openWithSection: {},
  openWithRow: {},
  openWithBtn: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: SCREEN_WIDTH, height: SCREEN_WIDTH, backgroundColor: '#1A1A1A' },
  noPreview: { alignItems: 'center' },
  zoomHint: {},
  navArrow: { position: 'absolute' },
  navArrowLeft: { left: 16 },
  navArrowRight: { right: 16 },
});
