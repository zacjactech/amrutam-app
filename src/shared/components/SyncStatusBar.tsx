// Sync Status Bar - Shows sync queue status with retry actions
//
// Renders as a compact bar at the top of the screen when there are pending
// or failed sync operations. Includes a "Retry All" button for failed ops
// and a dismissible detail view.

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from './AppText';
import { useSyncStatus } from '../../infrastructure/sync/SyncStatusContext';

const STATUS_CONFIG = {
  idle: { color: 'transparent', textColor: 'transparent', label: '' },
  syncing: { color: '#E8F5E9', textColor: '#2E7D32', label: 'Syncing data...' },
  pending: { color: '#FFF3E0', textColor: '#E65100', label: '' },
  error: { color: '#FFEBEE', textColor: '#C62828', label: '' },
  offline: { color: '#F5F5F5', textColor: '#616161', label: 'You\'re offline' },
} as const;

export function SyncStatusBar() {
  const { status, pendingCount, failedCount, lastSyncResult, retryAll } = useSyncStatus();
  const [expanded, setExpanded] = useState(false);

  // Don't render when idle
  if (status === 'idle') {
    return null;
  }

  const config = STATUS_CONFIG[status];

  const getStatusLabel = (): string => {
    if (status === 'syncing') return 'Syncing data...';

    if (status === 'pending' && pendingCount > 0) {
      return `${pendingCount} item${pendingCount === 1 ? '' : 's'} waiting to sync`;
    }

    if (status === 'error' && failedCount > 0) {
      return `${failedCount} sync ${failedCount === 1 ? 'error' : 'errors'}`;
    }

    return config.label;
  };

  const handleRetry = async () => {
    await retryAll();
  };

  const label = getStatusLabel();

  return (
    <View style={[styles.container, { backgroundColor: config.color }]}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.mainRow}
        activeOpacity={0.7}
      >
        {/* Status icon */}
        {status === 'syncing' && (
          <View style={[styles.dot, { backgroundColor: config.textColor }]} />
        )}
        {status === 'error' && (
          <AppText variant="body" style={{ color: config.textColor }}>⚠</AppText>
        )}
        {status === 'pending' && (
          <AppText variant="body" style={{ color: config.textColor }}>⏳</AppText>
        )}

        {/* Label */}
        <AppText
          variant="caption"
          style={[styles.label, { color: config.textColor }]}
        >
          {label}
        </AppText>

        {/* Action */}
        {status === 'error' && failedCount > 0 && (
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <AppText variant="caption" style={{ color: config.textColor, fontWeight: '600' }}>
              Retry All
            </AppText>
          </TouchableOpacity>
        )}

        {/* Expand indicator */}
        {(status === 'error' || status === 'pending') && (
          <AppText variant="caption" style={{ color: config.textColor, opacity: 0.6 }}>
            {expanded ? '▼' : '▶'}
          </AppText>
        )}
      </TouchableOpacity>

      {/* Expanded detail view */}
      {expanded && status === 'error' && failedCount > 0 && (
        <View style={styles.detail}>
          {lastSyncResult && (
            <View style={styles.resultRow}>
              <AppText variant="caption" style={{ color: config.textColor }}>
                Last sync: {lastSyncResult.succeeded} succeeded, {lastSyncResult.failed} failed
              </AppText>
            </View>
          )}
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={handleRetry} style={[styles.actionButton, { borderColor: config.textColor }]}>
              <AppText variant="caption" style={{ color: config.textColor }}>
                Retry All Failed
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {expanded && status === 'pending' && (
        <View style={styles.detail}>
          <AppText variant="caption" style={{ color: config.textColor }}>
            Data will sync automatically when connection is available.
          </AppText>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={handleRetry} style={[styles.actionButton, { borderColor: config.textColor }]}>
              <AppText variant="caption" style={{ color: config.textColor }}>
                Sync Now
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    flex: 1,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  detail: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  resultRow: {
    opacity: 0.8,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
});
