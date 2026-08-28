// Shop Module - Product Repository (Supabase)

import { Product, ProductFilter, SortOption } from './types';
import { supabase } from '../../infrastructure/supabase/client';
import { Database } from '../../infrastructure/supabase/database.types';

type ProductRow = Database['public']['Tables']['products']['Row'];

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ProductRepository {
  getProducts(
    filter: ProductFilter,
    pagination: PaginationParams,
    sortBy: SortOption,
  ): Promise<PaginatedResult<Product>>;
  getProductById(productId: string): Promise<Product | null>;
  searchProducts(query: string): Promise<Product[]>;
}

function mapProductRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category as Product['category'],
    price: row.price,
    currency: row.currency,
    imageUrl: row.image_url,
    rating: row.rating,
    reviewCount: row.review_count,
    stock: row.stock,
    tags: row.tags,
  };
}

function getSortColumn(sortBy: SortOption): { column: string; ascending: boolean } {
  switch (sortBy) {
    case 'rating':
      return { column: 'rating', ascending: false };
    case 'newest':
      return { column: 'created_at', ascending: false };
    case 'price-asc':
      return { column: 'price', ascending: true };
    case 'price-desc':
      return { column: 'price', ascending: false };
    case 'popularity':
    default:
      return { column: 'review_count', ascending: false };
  }
}

export const productRepository: ProductRepository = {
  async getProducts(
    filter: ProductFilter,
    pagination: PaginationParams,
    sortBy: SortOption = 'popularity',
  ): Promise<PaginatedResult<Product>> {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    if (filter.searchQuery) {
      query = query.or(`name.ilike.%${filter.searchQuery}%,description.ilike.%${filter.searchQuery}%`);
    }

    if (filter.categories.length > 0) {
      query = query.in('category', filter.categories);
    }

    if (filter.minPrice !== null) {
      query = query.gte('price', filter.minPrice);
    }

    if (filter.maxPrice !== null) {
      query = query.lte('price', filter.maxPrice);
    }

    if (filter.minRating !== null) {
      query = query.gte('rating', filter.minRating);
    }

    if (filter.inStockOnly) {
      query = query.gt('stock', 0);
    }

    const { column, ascending } = getSortColumn(sortBy);
    const from = pagination.page * pagination.pageSize;
    const to = from + pagination.pageSize - 1;

    const { data, count, error } = await query
      .order(column, { ascending })
      .range(from, to);

    if (error) throw error;

    const products = (data || []).map(mapProductRowToProduct);
    const total = count || 0;

    return {
      data: products,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      hasMore: total > (pagination.page + 1) * pagination.pageSize,
    };
  },

  async getProductById(productId: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return mapProductRowToProduct(data);
  },

  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('rating', { ascending: false })
      .limit(20);

    if (error) throw error;

    return (data || []).map(mapProductRowToProduct);
  },
};
