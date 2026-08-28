// Sync Scheduler - Triggers sync queue processing on app foreground and connectivity changes

import { AppState, AppStateStatus } from 'react-native';
import { subscribeToConnection, getConnectionInfo } from '../connectivity/connectionManager';
import { processSyncQueue, getPendingSyncCount } from './syncWorker';
import { logger } from '../logging/logger';

type SchedulerState = {
  isProcessing: boolean;
  appStateSubscription: ReturnType<typeof AppState.addEventListener> | null;
  connectionUnsubscribe: (() => void) | null;
  pollingInterval: ReturnType<typeof setInterval> | null;
};

const state: SchedulerState = {
  isProcessing: false,
  appStateSubscription: null,
  connectionUnsubscribe: null,
  pollingInterval: null,
};

const POLL_INTERVAL_MS = 30_000; // Check for pending operations every 30 seconds
const DEBOUNCE_MS = 2_000; // Debounce rapid foreground/connectivity transitions

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Safely triggers sync queue processing with debouncing.
 * Prevents multiple rapid triggers from flooding the queue.
 */
async function triggerSync(source: string): Promise<void> {
  if (state.isProcessing) {
    logger.debug('Sync scheduler: already processing, skipping', { source });
    return;
  }

  // Debounce rapid triggers
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    const t0 = Date.now();
    const pendingCount = await getPendingSyncCount();
    if (pendingCount === 0) {
      return;
    }

    state.isProcessing = true;
    logger.info('Sync scheduler: triggered', { source, pendingCount });

    try {
      const tSync = Date.now();
      const result = await processSyncQueue();
      const elapsedMs = Date.now() - tSync;
      logger.info('Sync scheduler: completed', {
        source,
        processed: result.processed,
        succeeded: result.succeeded,
        failed: result.failed,
        elapsedMs,
        avgPerOperationMs: result.processed > 0 ? Math.round(elapsedMs / result.processed) : 0,
      });
    } catch (error) {
      logger.error('Sync scheduler: unexpected error', {
        source,
        elapsedMs: Date.now() - t0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      state.isProcessing = false;
    }
  }, DEBOUNCE_MS);
}

/**
 * Handle app state changes (foreground/background transitions).
 */
function handleAppStateChange(nextState: AppStateStatus): void {
  if (nextState === 'active') {
    logger.debug('Sync scheduler: app came to foreground');
    triggerSync('foreground');
  }
}

/**
 * Handle connectivity changes.
 */
function handleConnectivityChange(): void {
  const { status } = getConnectionInfo();
  if (status === 'online') {
    logger.debug('Sync scheduler: connectivity restored');
    triggerSync('connectivity');
  }
}

/**
 * Start the sync scheduler.
 * Call this once when the app initializes (e.g., in App.tsx or a root provider).
 *
 * Triggers sync processing when:
 * 1. App comes to foreground
 * 2. Connectivity is restored
 * 3. Periodic polling (every 30 seconds while app is active)
 */
export function startSyncScheduler(): void {
  if (state.appStateSubscription) {
    logger.warn('Sync scheduler: already started');
    return;
  }

  logger.info('Sync scheduler: starting');

  // Listen for app state changes (foreground/background)
  state.appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

  // Listen for connectivity changes
  state.connectionUnsubscribe = subscribeToConnection(handleConnectivityChange);

  // Periodic polling for pending operations
  state.pollingInterval = setInterval(() => {
    const { status } = getConnectionInfo();
    if (status === 'online') {
      triggerSync('poll');
    }
  }, POLL_INTERVAL_MS);

  // Trigger an initial sync if we're online and have pending operations
  triggerSync('startup');
}

/**
 * Stop the sync scheduler.
 * Call this on app shutdown or when sync is no longer needed.
 */
export function stopSyncScheduler(): void {
  logger.info('Sync scheduler: stopping');

  if (state.appStateSubscription) {
    state.appStateSubscription.remove();
    state.appStateSubscription = null;
  }

  if (state.connectionUnsubscribe) {
    state.connectionUnsubscribe();
    state.connectionUnsubscribe = null;
  }

  if (state.pollingInterval) {
    clearInterval(state.pollingInterval);
    state.pollingInterval = null;
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  state.isProcessing = false;
}

/**
 * Manually trigger a sync (e.g., pull-to-refresh).
 * Returns the sync result.
 */
export async function manualSync(): Promise<{ processed: number; succeeded: number; failed: number; conflicts: number }> {
  const { status } = getConnectionInfo();
  if (status !== 'online') {
    logger.warn('Sync scheduler: manual sync skipped, offline');
    return { processed: 0, succeeded: 0, failed: 0, conflicts: 0 };
  }

  logger.info('Sync scheduler: manual sync triggered');
  const t0 = Date.now();
  const result = await processSyncQueue();
  logger.info('Sync scheduler: manual sync completed', {
    processed: result.processed,
    succeeded: result.succeeded,
    failed: result.failed,
    conflicts: result.conflicts,
    elapsedMs: Date.now() - t0,
  });
  return result;
}

/**
 * Check if the scheduler is currently processing.
 */
export function isSyncInProgress(): boolean {
  return state.isProcessing;
}
