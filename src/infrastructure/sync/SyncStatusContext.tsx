// Sync Status Context - Tracks sync queue state and exposes it to the UI

import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import { getPendingSyncCount, getFailedSyncOperations, retryFailedOperation, processSyncQueue } from './syncWorker';
import { logger } from '../logging/logger';

type SyncStatus = 'idle' | 'syncing' | 'pending' | 'error' | 'offline';

interface FailedOperation {
  id: string;
  type: string;
  lastError: string | null;
  attemptCount: number;
  updatedAt: string;
}

interface SyncStatusContextValue {
  /** Current sync status */
  status: SyncStatus;
  /** Number of operations waiting to sync */
  pendingCount: number;
  /** Number of permanently failed operations */
  failedCount: number;
  /** List of failed operations with details */
  failedOperations: FailedOperation[];
  /** Last sync result summary */
  lastSyncResult: { processed: number; succeeded: number; failed: number } | null;
  /** Trigger a manual sync */
  retryAll: () => Promise<void>;
  /** Retry a specific failed operation */
  retryOperation: (operationId: string) => Promise<void>;
  /** Refresh counts from the database */
  refresh: () => Promise<void>;
}

const SyncStatusContext = createContext<SyncStatusContextValue | null>(null);

const POLL_INTERVAL_MS = 10_000; // Refresh status every 10 seconds

export function SyncStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [failedOperations, setFailedOperations] = useState<FailedOperation[]>([]);
  const [lastSyncResult, setLastSyncResult] = useState<{ processed: number; succeeded: number; failed: number } | null>(null);
  const isMountedRef = useRef(true);
  const isSyncingRef = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const [pending, failedOps] = await Promise.all([
        getPendingSyncCount(),
        getFailedSyncOperations(),
      ]);

      if (!isMountedRef.current) return;

      setPendingCount(pending);
      setFailedCount(failedOps.length);
      setFailedOperations(
        failedOps.map((op) => ({
          id: op.id,
          type: op.type,
          lastError: op.lastError,
          attemptCount: op.attemptCount,
          updatedAt: op.updatedAt,
        })),
      );

      // Update status based on counts (use ref to avoid stale closure)
      if (isSyncingRef.current) return;

      if (pending > 0) {
        setStatus('pending');
      } else if (failedOps.length > 0) {
        setStatus('error');
      } else {
        setStatus('idle');
      }
    } catch (error) {
      logger.error('SyncStatus: failed to refresh', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, []);

  const retryAll = useCallback(async () => {
    isSyncingRef.current = true;
    setStatus('syncing');
    setLastSyncResult(null);

    try {
      const result = await processSyncQueue();
      setLastSyncResult(result);
      logger.info('SyncStatus: manual retry completed', result);
    } catch (error) {
      logger.error('SyncStatus: manual retry failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      isSyncingRef.current = false;
    }

    // Refresh counts after sync
    await refresh();
  }, [refresh]);

  const retryOperation = useCallback(async (operationId: string) => {
    try {
      await retryFailedOperation(operationId);
      logger.info('SyncStatus: retried operation', { operationId });
      await refresh();
    } catch (error) {
      logger.error('SyncStatus: failed to retry operation', {
        operationId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [refresh]);

  // Poll for status changes (refresh has no deps, so this runs once)
  useEffect(() => {
    isMountedRef.current = true;
    refresh();

    const interval = setInterval(() => {
      if (isMountedRef.current) {
        refresh();
      }
    }, POLL_INTERVAL_MS);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [refresh]);

  const value: SyncStatusContextValue = {
    status,
    pendingCount,
    failedCount,
    failedOperations,
    lastSyncResult,
    retryAll,
    retryOperation,
    refresh,
  };

  return <SyncStatusContext.Provider value={value}>{children}</SyncStatusContext.Provider>;
}

export function useSyncStatus(): SyncStatusContextValue {
  const context = useContext(SyncStatusContext);
  if (context === null) {
    throw new Error('useSyncStatus must be used within a SyncStatusProvider');
  }
  return context;
}


