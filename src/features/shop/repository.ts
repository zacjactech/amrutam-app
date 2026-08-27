// Shop Module - Product Repository

import {
  Product,
  ProductFilter,
  SortOption,
} from './types';
import {
  getProductCache,
  applyProductFilter,
  sortProducts,
} from './generator';
import { shouldFail, createFailureError } from '../../infrastructure/testing/failureInjector';

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

    const allProducts = getProductCache();
    const filtered = applyProductFilter(allProducts, filter);
    const sorted = sortProducts(filtered, sortBy);

    const start = pagination.page * pagination.pageSize;
    const end = start + pagination.pageSize;
    const data = sorted.slice(start, end);

    return {
      data,
      total: filtered.length,
      page: pagination.page,
      pageSize: pagination.pageSize,
      hasMore: end < filtered.length,
    };
  },

  async getProductById(productId: string): Promise<Product | null> {
    const failure = shouldFail({ endpoint: `/products/${productId}`, method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const cache = getProductCache();
    const product = cache.find((p) => p.id === productId);
    if (product === undefined) {
      return null;
    }
    return product;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const failure = shouldFail({ endpoint: '/products/search', method: 'GET' });
    if (failure) {
      throw createFailureError(failure);
    }

    const allProducts = getProductCache();
    const lowerQuery = query.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  },
};
