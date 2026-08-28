// Shop Module - Types

import type { Product, CartItem, WishlistItem } from '../../shared/types';

export type { Product, CartItem, WishlistItem };

export type ProductCategory =
  | 'Herbal Supplements'
  | 'Oils & Ghee'
  | 'Skin Care'
  | 'Hair Care'
  | 'Immunity'
  | 'Digestive Health'
  | 'Respiratory'
  | 'Joint Care'
  | 'Women\'s Wellness'
  | 'Men\'s Wellness'
  | 'Kids & Baby'
  | 'Food & Beverages'
  | 'Personal Care'
  | 'Home Remedies';

export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export interface ProductFilter {
  searchQuery: string;
  categories: ProductCategory[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  inStockOnly: boolean;
  sortBy: SortOption;
}

export const DEFAULT_PRODUCT_FILTER: ProductFilter = {
  searchQuery: '',
  categories: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  inStockOnly: false,
  sortBy: 'popularity',
};

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
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
] as const;

export type ShopNavigation = {
  navigate: (screen: string, params?: Record<string, unknown>) => void;
  goBack: () => void;
};

export type ShopStackParamList = {
  ShopHome: undefined;
  ProductList: undefined;
  ProductSearch: undefined;
  ProductDetails: { productId: string };
  Wishlist: undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: undefined;
  OrderFailed: undefined;
};
