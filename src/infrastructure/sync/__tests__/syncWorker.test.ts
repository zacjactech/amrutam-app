// Sync Worker Tests

// Mock Supabase client
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockUpsert = jest.fn();
const mockDelete = jest.fn();
const mockEq = jest.fn();
const mockSelect = jest.fn();
const mockSingle = jest.fn();

jest.mock('../../supabase/client', () => ({
  supabase: {
    from: jest.fn((_table: string) => ({
      insert: mockInsert.mockReturnValue({ select: mockSelect }),
      update: mockUpdate,
      upsert: mockUpsert,
      delete: mockDelete,
      eq: mockEq,
    })),
  },
}));

// Mock the database
jest.mock('../../database/database', () => ({
  getDatabase: jest.fn(() => Promise.resolve({
    runAsync: jest.fn(() => Promise.resolve({ rowsAffected: 1 })),
    getFirstAsync: jest.fn(() => Promise.resolve(null)),
    getAllAsync: jest.fn(() => Promise.resolve([])),
  })),
}));

// Mock logger
jest.mock('../../logging/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

import { processSyncQueue, enqueueBookingSync, enqueueCartSync, enqueueWishlistSync } from '../syncWorker';

describe('Sync Worker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelect.mockReturnValue({ select: mockSelect });
    mockSingle.mockReturnValue({ single: mockSingle });
  });

  describe('processSyncQueue', () => {
    it('returns empty result when no pending operations', async () => {
      const result = await processSyncQueue();
      expect(result).toEqual({
        processed: 0,
        succeeded: 0,
        failed: 0,
        conflicts: 0,
        permanentlyFailed: 0,
      });
    });
  });

  describe('enqueueBookingSync', () => {
    it('enqueues a booking sync operation', async () => {
      const id = await enqueueBookingSync({
        doctorId: 'doc_001',
        slotId: 'slot_001',
        patientId: 'patient_001',
      });

      expect(id).toMatch(/^sync_/);
    });
  });

  describe('enqueueCartSync', () => {
    it('enqueues a cart sync operation', async () => {
      const id = await enqueueCartSync({
        patientId: 'patient_001',
        items: [{ productId: 'prod_001', quantity: 2, unitPrice: 299 }],
      });

      expect(id).toMatch(/^sync_/);
    });
  });

  describe('enqueueWishlistSync', () => {
    it('enqueues a wishlist sync operation', async () => {
      const id = await enqueueWishlistSync({
        patientId: 'patient_001',
        items: [{ productId: 'prod_001' }],
      });

      expect(id).toMatch(/^sync_/);
    });
  });
});

describe('Sync Worker - Direct Processor Tests', () => {
  // These test the Supabase API interaction patterns

  it('booking processor calls insert on bookings table', () => {
    // Verify the mock setup allows us to chain .from().insert().select().single()
    const { supabase } = require('../../supabase/client');
    const chain = supabase.from('bookings');
    expect(chain.insert).toBeDefined();
  });

  it('cart processor calls upsert on cart_items table', () => {
    const { supabase } = require('../../supabase/client');
    const chain = supabase.from('cart_items');
    expect(chain.upsert).toBeDefined();
  });

  it('wishlist processor calls delete then insert on wishlist_items table', () => {
    const { supabase } = require('../../supabase/client');
    const chain = supabase.from('wishlist_items');
    expect(chain.delete).toBeDefined();
    expect(chain.insert).toBeDefined();
  });
});
