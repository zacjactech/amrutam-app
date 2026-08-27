// Shop Module - Zod Validation Schemas

import { z } from 'zod';

export const productCategorySchema = z.enum([
  'Herbal Supplements',
  'Oils & Ghee',
  'Skin Care',
  'Hair Care',
  'Immunity',
  'Digestive Health',
  'Respiratory',
  'Joint Care',
  'Women\'s Wellness',
  'Men\'s Wellness',
  'Kids & Baby',
  'Food & Beverages',
  'Personal Care',
  'Home Remedies',
]);

export const sortOptionSchema = z.enum(['popularity', 'price-asc', 'price-desc', 'rating', 'newest']);

export const productFilterSchema = z.object({
  searchQuery: z.string().max(200),
  categories: z.array(productCategorySchema).default([]),
  minPrice: z.number().nonnegative().nullable().default(null),
  maxPrice: z.number().nonnegative().nullable().default(null),
  minRating: z.number().min(0).max(5).nullable().default(null),
  inStockOnly: z.boolean().default(false),
  sortBy: sortOptionSchema.default('popularity'),
});

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(500),
  description: z.string().max(5000),
  category: productCategorySchema,
  price: z.number().nonnegative(),
  currency: z.string().length(3),
  imageUrl: z.string().url(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  tags: z.array(z.string()),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().max(100),
  unitPrice: z.number().nonnegative(),
  updatedAt: z.string().datetime(),
});

export const wishlistItemSchema = z.object({
  productId: z.string().min(1),
  addedAt: z.string().datetime(),
});

export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type WishlistItem = z.infer<typeof wishlistItemSchema>;
export type ShopProductFilter = z.infer<typeof productFilterSchema>;
