// Database Initialization Tests
// Tests for getDatabase() serialization, error recovery, and closeDatabase().

const mockExecAsync = jest.fn();
const mockCloseAsync = jest.fn();

const mockDb = {
  execAsync: mockExecAsync,
  closeAsync: mockCloseAsync,
  runAsync: jest.fn(),
  getFirstAsync: jest.fn(),
  getAllAsync: jest.fn(),
};

const mockOpenDatabaseAsync = jest.fn();

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: (...args: unknown[]) => mockOpenDatabaseAsync(...args),
}));

jest.mock('../../logging/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Import AFTER mocks are set up — but we need fresh module state per test,
// so we dynamically import in beforeEach after jest.resetModules().
let getDatabase: typeof import('../database').getDatabase;
let closeDatabase: typeof import('../database').closeDatabase;

describe('database', () => {
  beforeEach(() => {
    jest.resetModules();
    mockExecAsync.mockReset();
    mockCloseAsync.mockReset();
    mockOpenDatabaseAsync.mockReset();

    // Default: openDatabaseAsync resolves with mockDb
    mockOpenDatabaseAsync.mockResolvedValue(mockDb);
    mockExecAsync.mockResolvedValue(undefined);

    const mod = require('../database');
    getDatabase = mod.getDatabase;
    closeDatabase = mod.closeDatabase;
  });

  afterEach(async () => {
    // Ensure clean state between tests
    try {
      await closeDatabase();
    } catch {
      // ignore
    }
  });

  describe('getDatabase', () => {
    it('opens the database and runs migrations', async () => {
      const db = await getDatabase();

      expect(mockOpenDatabaseAsync).toHaveBeenCalledTimes(1);
      expect(mockOpenDatabaseAsync).toHaveBeenCalledWith('amrutam.db');
      expect(mockExecAsync).toHaveBeenCalled();
      expect(db).toBe(mockDb);
    });

    it('returns the same instance on subsequent calls (caching)', async () => {
      const db1 = await getDatabase();
      const db2 = await getDatabase();

      expect(db1).toBe(db2);
      expect(mockOpenDatabaseAsync).toHaveBeenCalledTimes(1);
    });

    it('serializes concurrent callers — only one openDatabaseAsync runs', async () => {
      // Fire 5 concurrent callers before any resolves
      const p1 = getDatabase();
      const p2 = getDatabase();
      const p3 = getDatabase();
      const p4 = getDatabase();
      const p5 = getDatabase();

      const results = await Promise.all([p1, p2, p3, p4, p5]);

      // All should resolve to the same instance
      expect(results.every((r) => r === results[0])).toBe(true);
      // openDatabaseAsync should only have been called once
      expect(mockOpenDatabaseAsync).toHaveBeenCalledTimes(1);
    });

    it('retries after initialization failure (resets dbInitPromise)', async () => {
      // First call fails
      mockOpenDatabaseAsync.mockRejectedValueOnce(new Error('open failed'));

      await expect(getDatabase()).rejects.toThrow('open failed');
      expect(mockOpenDatabaseAsync).toHaveBeenCalledTimes(1);

      // Second call should attempt again (not stuck on the failed promise)
      mockOpenDatabaseAsync.mockResolvedValueOnce(mockDb);
      const db = await getDatabase();

      expect(db).toBe(mockDb);
      expect(mockOpenDatabaseAsync).toHaveBeenCalledTimes(2);
    });

    it('propagates migration errors and resets state', async () => {
      // open succeeds but execAsync (migration) fails
      mockExecAsync.mockRejectedValueOnce(new Error('migration failed'));

      await expect(getDatabase()).rejects.toThrow('migration failed');

      // Should be able to retry
      mockExecAsync.mockResolvedValue(undefined);
      const db = await getDatabase();
      expect(db).toBe(mockDb);
    });

    it('concurrent callers after failure all get the retry result', async () => {
      // First call fails
      mockOpenDatabaseAsync.mockRejectedValueOnce(new Error('open failed'));

      const p1 = getDatabase().catch(() => null);
      const p2 = getDatabase().catch(() => null);
      await Promise.all([p1, p2]);

      // Now retry succeeds
      mockOpenDatabaseAsync.mockResolvedValueOnce(mockDb);
      const db1 = await getDatabase();
      const db2 = await getDatabase();

      expect(db1).toBe(mockDb);
      expect(db2).toBe(mockDb);
      expect(mockOpenDatabaseAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('closeDatabase', () => {
    it('closes an open database and resets state', async () => {
      await getDatabase();
      await closeDatabase();

      expect(mockCloseAsync).toHaveBeenCalledTimes(1);
    });

    it('is a no-op when no database is open', async () => {
      await closeDatabase();

      expect(mockCloseAsync).not.toHaveBeenCalled();
    });

    it('allows re-initialization after close', async () => {
      const db1 = await getDatabase();
      await closeDatabase();

      mockOpenDatabaseAsync.mockResolvedValueOnce(mockDb);
      const db2 = await getDatabase();

      expect(db1).toBe(db2);
      expect(mockOpenDatabaseAsync).toHaveBeenCalledTimes(2);
    });
  });
});
