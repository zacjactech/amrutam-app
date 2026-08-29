// Shop Module - Wishlist Repository (SQLite + Supabase sync)

import type { WishlistItem } from './types';
import { wishlistItemSchema } from './schemas';
import { getDatabase } from '../../infrastructure/database/database';
import { supabase } from '../../infrastructure/supabase/client';
import { logger } from '../../infrastructure/logging/logger';

export interface WishlistRepository {
  getAllItems(): Promise<WishlistItem[]>;
  addItem(productId: string, patientId?: string): Promise<void>;
  removeItem(productId: string, patientId?: string): Promise<void>;
  isInWishlist(productId: string): Promise<boolean>;
  clearAll(patientId?: string): Promise<void>;
  syncToCloud(patientId: string): Promise<void>;
}

async function syncWishlistToCloud(patientId: string): Promise<void> {
  try {
    const items = await wishlistRepository.getAllItems();

    const { error: deleteError } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('patient_id', patientId);

    if (deleteError) throw deleteError;

    if (items.length > 0) {
      const inserts = items.map((item) => ({
        patient_id: patientId,
        product_id: item.productId,
      }));

      const { error: insertError } = await supabase
        .from('wishlist_items')
        .insert(inserts);

      if (insertError) throw insertError;
    }

    logger.debug('Wishlist synced to cloud', { patientId, itemCount: items.length });
  } catch (error) {
    logger.error('Wishlist: cloud sync failed', { error: error instanceof Error ? error.message : 'Unknown' });
    throw error;
  }
}

export const wishlistRepository: WishlistRepository = {
  async getAllItems(): Promise<WishlistItem[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<{ product_id: string; added_at: string }>(
      'SELECT * FROM wishlist_items ORDER BY added_at DESC',
    );
    return result.map((row) =>
      wishlistItemSchema.parse({
        productId: row.product_id,
        addedAt: row.added_at,
      }),
    );
  },

  async addItem(productId: string, patientId?: string): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      'INSERT OR IGNORE INTO wishlist_items (product_id, added_at) VALUES (?, ?)',
      [productId, now],
    );

    if (patientId) {
      syncWishlistToCloud(patientId).catch((error) => {
        logger.warn('Wishlist: failed to sync addItem to cloud', { error: error instanceof Error ? error.message : 'Unknown' });
      });
    }
  },

  async removeItem(productId: string, patientId?: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM wishlist_items WHERE product_id = ?', [productId]);

    if (patientId) {
      syncWishlistToCloud(patientId).catch((error) => {
        logger.warn('Wishlist: failed to sync removeItem to cloud', { error: error instanceof Error ? error.message : 'Unknown' });
      });
    }
  },

  async isInWishlist(productId: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ product_id: string }>(
      'SELECT product_id FROM wishlist_items WHERE product_id = ?',
      [productId],
    );
    return result !== undefined;
  },

  async clearAll(patientId?: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM wishlist_items');

    if (patientId) {
      syncWishlistToCloud(patientId).catch((error) => {
        logger.warn('Wishlist: failed to sync clearAll to cloud', { error: error instanceof Error ? error.message : 'Unknown' });
      });
    }
  },

  async syncToCloud(patientId: string): Promise<void> {
    await syncWishlistToCloud(patientId);
  },
};
