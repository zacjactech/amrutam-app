// Shop Module - Product Types

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

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  currency: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  updatedAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}
