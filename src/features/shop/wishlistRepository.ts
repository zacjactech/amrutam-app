// Shop Module - Wishlist Repository

import { WishlistItem } from './types';
import { wishlistItemSchema } from './schemas';
import { getDatabase } from '../../infrastructure/database/database';

export interface WishlistRepository {
  getAllItems(): Promise<WishlistItem[]>;
  addItem(productId: string): Promise<void>;
  removeItem(productId: string): Promise<void>;
  isInWishlist(productId: string): Promise<boolean>;
  clearAll(): Promise<void>;
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

  async addItem(productId: string): Promise<void> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await db.runAsync(
      'INSERT OR IGNORE INTO wishlist_items (product_id, added_at) VALUES (?, ?)',
      [productId, now],
    );
  },

  async removeItem(productId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM wishlist_items WHERE product_id = ?', [productId]);
  },

  async isInWishlist(productId: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ product_id: string }>(
      'SELECT product_id FROM wishlist_items WHERE product_id = ?',
      [productId],
    );
    return result !== undefined;
  },

  async clearAll(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM wishlist_items');
  },
};
