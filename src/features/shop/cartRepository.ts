// Shop Module - Cart Repository (SQLite + Supabase sync)

import type { CartItem } from './types';
import { cartItemSchema } from './schemas';
import { getDatabase } from '../../infrastructure/database/database';
import { supabase } from '../../infrastructure/supabase/client';
import { logger } from '../../infrastructure/logging/logger';

export interface CartRepository {
  getAllItems(): Promise<CartItem[]>;
  addItem(productId: string, unitPrice: number, patientId?: string): Promise<CartItem>;
  updateQuantity(productId: string, quantity: number, patientId?: string): Promise<void>;
  removeItem(productId: string, patientId?: string): Promise<void>;
  clearAll(patientId?: string): Promise<void>;
  getTotalItems(): Promise<number>;
  syncToCloud(patientId: string): Promise<void>;
}

async function syncCartToCloud(patientId: string): Promise<void> {
  try {
    const items = await cartRepository.getAllItems();
    if (items.length === 0) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('patient_id', patientId);
      if (error) throw error;
      return;
    }

    const upserts = items.map((item) => ({
      patient_id: patientId,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }));

    const { error: upsertError } = await supabase
      .from('cart_items')
      .upsert(upserts, { onConflict: 'patient_id,product_id' });

    if (upsertError) throw upsertError;

    logger.debug('Cart synced to cloud', { patientId, itemCount: items.length });
  } catch (error) {
    logger.error('Cart: cloud sync failed', { error: error instanceof Error ? error.message : 'Unknown' });
    throw error;
  }
}

export const cartRepository: CartRepository = {
  async getAllItems(): Promise<CartItem[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<{
      product_id: string;
      quantity: number;
      unit_price: number;
      updated_at: string;
    }>('SELECT * FROM cart_items ORDER BY updated_at DESC');
    return result.map((row) =>
      cartItemSchema.parse({
        productId: row.product_id,
        quantity: row.quantity,
        unitPrice: row.unit_price,
        updatedAt: row.updated_at,
      }),
    );
  },

  async addItem(productId: string, unitPrice: number, patientId?: string): Promise<CartItem> {
    const db = await getDatabase();
    const existing = await db.getFirstAsync<{ quantity: number }>(
      'SELECT quantity FROM cart_items WHERE product_id = ?',
      [productId],
    );
    const newQuantity = (existing?.quantity ?? 0) + 1;
    const now = new Date().toISOString();

    const updateResult = await db.runAsync(
      'UPDATE cart_items SET quantity = ?, unit_price = ?, updated_at = ? WHERE product_id = ?',
      [newQuantity, unitPrice, now, productId],
    );

    if ((updateResult as { rowsAffected?: number }).rowsAffected === 0) {
      await db.runAsync(
        'INSERT INTO cart_items (product_id, quantity, unit_price, updated_at) VALUES (?, ?, ?, ?)',
        [productId, newQuantity, unitPrice, now],
      );
    }

    if (patientId) {
      syncCartToCloud(patientId).catch((error) => {
        logger.warn('Cart: failed to sync addItem to cloud', { error: error instanceof Error ? error.message : 'Unknown' });
      });
    }

    return cartItemSchema.parse({ productId, quantity: newQuantity, unitPrice, updatedAt: now });
  },

  async updateQuantity(productId: string, quantity: number, patientId?: string): Promise<void> {
    const db = await getDatabase();
    if (quantity <= 0) {
      await db.runAsync('DELETE FROM cart_items WHERE product_id = ?', [productId]);
    } else {
      const now = new Date().toISOString();
      await db.runAsync(
        'UPDATE cart_items SET quantity = ?, updated_at = ? WHERE product_id = ?',
        [quantity, now, productId],
      );
    }

    if (patientId) {
      syncCartToCloud(patientId).catch((error) => {
        logger.warn('Cart: failed to sync updateQuantity to cloud', { error: error instanceof Error ? error.message : 'Unknown' });
      });
    }
  },

  async removeItem(productId: string, patientId?: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM cart_items WHERE product_id = ?', [productId]);

    if (patientId) {
      syncCartToCloud(patientId).catch((error) => {
        logger.warn('Cart: failed to sync removeItem to cloud', { error: error instanceof Error ? error.message : 'Unknown' });
      });
    }
  },

  async clearAll(patientId?: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM cart_items');

    if (patientId) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('patient_id', patientId);
      if (error) {
        logger.warn('Cart: failed to clear cloud cart', { error: error.message });
      }
    }
  },

  async getTotalItems(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT SUM(quantity) as total FROM cart_items',
    );
    return result?.total ?? 0;
  },

  async syncToCloud(patientId: string): Promise<void> {
    await syncCartToCloud(patientId);
  },
};
