// Shop Module - Cart Repository

import { CartItem } from './types';
import { cartItemSchema } from './schemas';
import { getDatabase } from '../../infrastructure/database/database';

export interface CartRepository {
  getAllItems(): Promise<CartItem[]>;
  addItem(productId: string, unitPrice: number): Promise<CartItem>;
  updateQuantity(productId: string, quantity: number): Promise<void>;
  removeItem(productId: string): Promise<void>;
  clearAll(): Promise<void>;
  getTotalItems(): Promise<number>;
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

  async addItem(productId: string, unitPrice: number): Promise<CartItem> {
    const db = await getDatabase();
    const existing = await db.getFirstAsync<{ quantity: number }>(
      'SELECT quantity FROM cart_items WHERE product_id = ?',
      [productId],
    );
    const newQuantity = (existing?.quantity ?? 0) + 1;
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO cart_items (product_id, quantity, unit_price, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(product_id) DO UPDATE SET quantity = excluded.quantity, unit_price = excluded.unit_price, updated_at = excluded.updated_at`,
      [productId, newQuantity, unitPrice, now],
    );
    return cartItemSchema.parse({ productId, quantity: newQuantity, unitPrice, updatedAt: now });
  },

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    const db = await getDatabase();
    if (quantity <= 0) {
      await db.runAsync('DELETE FROM cart_items WHERE product_id = ?', [productId]);
      return;
    }
    const now = new Date().toISOString();
    await db.runAsync(
      'UPDATE cart_items SET quantity = ?, updated_at = ? WHERE product_id = ?',
      [quantity, now, productId],
    );
  },

  async removeItem(productId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM cart_items WHERE product_id = ?', [productId]);
  },

  async clearAll(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM cart_items');
  },

  async getTotalItems(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT SUM(quantity) as total FROM cart_items',
    );
    return result?.total ?? 0;
  },
};
