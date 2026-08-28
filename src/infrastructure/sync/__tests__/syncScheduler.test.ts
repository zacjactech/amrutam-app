// Sync Scheduler Tests

// Mock dependencies BEFORE importing the module under test
const mockRemove = jest.fn();
const mockAddEventListener = jest.fn().mockReturnValue({ remove: mockRemove });
jest.mock('react-native', () => ({
  AppState: {
    addEventListener: mockAddEventListener,
  },
}));

const mockGetConnectionInfo = jest.fn().mockReturnValue({ status: 'online', isConnected: true });
const mockSubscribeToConnection = jest.fn().mockReturnValue(() => {});

jest.mock('../../connectivity/connectionManager', () => ({
  getConnectionInfo: (...args: unknown[]) => mockGetConnectionInfo(...args),
  subscribeToConnection: (...args: unknown[]) => mockSubscribeToConnection(...args),
}));

const mockProcessSyncQueue = jest.fn().mockResolvedValue({ processed: 0, succeeded: 0, failed: 0, conflicts: 0 });
const mockGetPendingSyncCount = jest.fn().mockResolvedValue(0);

jest.mock('../syncWorker', () => ({
  processSyncQueue: (...args: unknown[]) => mockProcessSyncQueue(...args),
  getPendingSyncCount: (...args: unknown[]) => mockGetPendingSyncCount(...args),
}));

jest.mock('../../logging/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// NOW import the module under test (after mocks are set up)
import { startSyncScheduler, stopSyncScheduler, isSyncInProgress, manualSync } from '../syncScheduler';

describe('Sync Scheduler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockGetConnectionInfo.mockReturnValue({ status: 'online', isConnected: true });
    mockGetPendingSyncCount.mockResolvedValue(0);
    mockProcessSyncQueue.mockResolvedValue({ processed: 0, succeeded: 0, failed: 0, conflicts: 0 });
    stopSyncScheduler();
  });

  afterEach(() => {
    stopSyncScheduler();
    jest.useRealTimers();
  });

  describe('startSyncScheduler', () => {
    it('registers AppState listener', () => {
      startSyncScheduler();
      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('subscribes to connectivity changes', () => {
      startSyncScheduler();
      expect(mockSubscribeToConnection).toHaveBeenCalledWith(expect.any(Function));
    });

    it('does not register duplicate listeners', () => {
      startSyncScheduler();
      const firstCallCount = mockAddEventListener.mock.calls.length;
      startSyncScheduler();
      // Should not have registered additional listeners
      expect(mockAddEventListener.mock.calls.length).toBe(firstCallCount);
    });
  });

  describe('stopSyncScheduler', () => {
    it('cleans up AppState listener', () => {
      startSyncScheduler();
      stopSyncScheduler();

      expect(mockRemove).toHaveBeenCalled();
    });
  });

  describe('isSyncInProgress', () => {
    it('returns false when idle', () => {
      expect(isSyncInProgress()).toBe(false);
    });
  });

  describe('manualSync', () => {
    it('returns empty result when offline', async () => {
      mockGetConnectionInfo.mockReturnValue({ status: 'offline', isConnected: false });
      const result = await manualSync();
      expect(result).toEqual({ processed: 0, succeeded: 0, failed: 0, conflicts: 0 });
      expect(mockProcessSyncQueue).not.toHaveBeenCalled();
    });

    it('calls processSyncQueue when online', async () => {
      mockGetConnectionInfo.mockReturnValue({ status: 'online', isConnected: true });
      await manualSync();
      expect(mockProcessSyncQueue).toHaveBeenCalled();
    });
  });
});
