// Shop Module - Product Repository

import { z } from 'zod';
import {
  Product,
  ProductFilter,
  SortOption,
} from './types';
import { productSchema } from './schemas';
import { shouldFail, createFailureError } from '../../infrastructure/testing/failureInjector';
import { apiRequest } from '../../infrastructure/api/apiClient';

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

function applyClientFilters(products: Product[], filter: ProductFilter): Product[] {
  return products.filter((product) => {
    if (filter.categories.length > 0 && !filter.categories.includes(product.category)) {
      return false;
    }
    if (filter.minPrice !== null && product.price < filter.minPrice) {
      return false;
    }
    if (filter.maxPrice !== null && product.price > filter.maxPrice) {
      return false;
    }
    if (filter.minRating !== null && product.rating < filter.minRating) {
      return false;
    }
    if (filter.inStockOnly && product.stock <= 0) {
      return false;
    }
    return true;
  });
}

function getServerSortParams(sortBy: SortOption): { sort: string; order: string } {
  switch (sortBy) {
    case 'rating':
      return { sort: 'rating', order: 'desc' };
    case 'newest':
      return { sort: 'id', order: 'desc' };
    case 'price-asc':
      return { sort: 'price', order: 'asc' };
    case 'price-desc':
      return { sort: 'price', order: 'desc' };
    case 'popularity':
    default:
      return { sort: 'reviewCount', order: 'desc' };
  }
}

export const productRepository: ProductRepository = {
  async getProducts(
    filter: ProductFilter,
    pagination: PaginationParams,
    sortBy: SortOption = 'popularity',
  ): Promise<PaginatedResult<Product>> {
    const failure = shouldFail({ endpoint: '/products', method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const { sort, order } = getServerSortParams(sortBy);
    const params = new URLSearchParams({
      _page: String(pagination.page + 1),
      _limit: String(pagination.pageSize),
      _sort: sort,
      _order: order,
    });

    if (filter.searchQuery) {
      params.set('q', filter.searchQuery);
    }

    const products = await apiRequest(
      { method: 'GET', endpoint: `/products?${params.toString()}` },
      z.array(productSchema),
    );

    const filtered = applyClientFilters(products, filter);
    const total = filtered.length;
    const hasMore = total > pagination.pageSize;

    return {
      data: filtered,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      hasMore,
    };
  },

  async getProductById(productId: string): Promise<Product | null> {
    const failure = shouldFail({ endpoint: `/products/${productId}`, method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    try {
      return await apiRequest(
        { method: 'GET', endpoint: `/products/${productId}` },
        productSchema,
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError') {
        return null;
      }
      throw error;
    }
  },

  async searchProducts(query: string): Promise<Product[]> {
    const failure = shouldFail({ endpoint: '/products/search', method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const products = await apiRequest(
      { method: 'GET', endpoint: `/products?q=${encodeURIComponent(query)}` },
      z.array(productSchema),
    );

    return products;
  },
};
