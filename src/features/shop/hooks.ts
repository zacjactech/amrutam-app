// Shop Module - Hooks

import { useState, useEffect } from 'react';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productRepository } from './repository';
import { cartRepository } from './cartRepository';
import { wishlistRepository } from './wishlistRepository';
import { ProductFilter, DEFAULT_PRODUCT_FILTER, SortOption } from './types';
import { useAuthContext } from '../../infrastructure/auth/AuthContext';
import type { Product } from './types';
import { getProductCacheAsync } from './generator';
import { logger } from '../../infrastructure/logging/logger';

/** Error handler — set via setShopErrorHandler, avoids module-level mutable */
const _errorHandlerRef: { current: ((message: string) => void) | null } = { current: null };

export function setShopErrorHandler(handler: (message: string) => void): void {
  _errorHandlerRef.current = handler;
}

function handleError(label: string, error: unknown): void {
  const message = error instanceof Error ? error.message : `${label} failed`;
  logger.error(label, { error: message });
  _errorHandlerRef.current?.(message);
}

export const shopKeys = {
  all: ['shop'] as const,
  products: (filter: ProductFilter) => [...shopKeys.all, 'products', filter] as const,
  product: (id: string) => [...shopKeys.all, 'product', id] as const,
  cart: () => [...shopKeys.all, 'cart'] as const,
  wishlist: () => [...shopKeys.all, 'wishlist'] as const,
};

const PAGE_SIZE = 40;

export function useProducts(
  filter: ProductFilter = DEFAULT_PRODUCT_FILTER,
  sortBy: SortOption = 'popularity',
) {
  return useQuery({
    queryKey: shopKeys.products(filter),
    queryFn: () =>
      productRepository.getProducts(
        filter,
        { page: 0, pageSize: PAGE_SIZE },
        sortBy,
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInfiniteProducts(
  filter: ProductFilter = DEFAULT_PRODUCT_FILTER,
  sortBy: SortOption = 'popularity',
) {
  return useInfiniteQuery({
    queryKey: shopKeys.products(filter),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      productRepository.getProducts(
        filter,
        { page: pageParam, pageSize: PAGE_SIZE },
        sortBy,
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage === undefined || lastPage === null) return undefined;
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: shopKeys.product(productId),
    queryFn: () => productRepository.getProductById(productId),
    enabled: productId.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCart() {
  const queryClient = useQueryClient();
  const { patientId } = useAuthContext();

  const cartQuery = useQuery({
    queryKey: shopKeys.cart(),
    queryFn: () => cartRepository.getAllItems(),
    staleTime: 0,
  });

  const addToCart = useMutation({
    mutationFn: ({ productId, unitPrice }: { productId: string; unitPrice: number }) =>
      cartRepository.addItem(productId, unitPrice, patientId ?? undefined),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopKeys.cart() });
    },
    onError: (error) => handleError('Cart: add item', error),
  });

  const updateCartQuantity = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartRepository.updateQuantity(productId, quantity, patientId ?? undefined),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopKeys.cart() });
    },
    onError: (error) => handleError('Cart: update quantity', error),
  });

  const removeFromCart = useMutation({
    mutationFn: (productId: string) => cartRepository.removeItem(productId, patientId ?? undefined),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopKeys.cart() });
    },
    onError: (error) => handleError('Cart: remove item', error),
  });

  const clearCart = useMutation({
    mutationFn: () => cartRepository.clearAll(patientId ?? undefined),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopKeys.cart() });
    },
    onError: (error) => handleError('Cart: clear', error),
  });

  return {
    ...cartQuery,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  };
}

export function useWishlist() {
  const queryClient = useQueryClient();
  const { patientId } = useAuthContext();

  const wishlistQuery = useQuery({
    queryKey: shopKeys.wishlist(),
    queryFn: async () => {
      const items = await wishlistRepository.getAllItems();
      return items.map((item) => item.productId);
    },
    staleTime: 0,
  });

  const toggleWishlist = useMutation({
    mutationFn: async ({ productId, isAdded }: { productId: string; isAdded: boolean }) => {
      if (isAdded) {
        await wishlistRepository.removeItem(productId, patientId ?? undefined);
        return { productId, isAdded: false };
      }
      await wishlistRepository.addItem(productId, patientId ?? undefined);
      return { productId, isAdded: true };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopKeys.wishlist() });
    },
    onError: (error) => handleError('Wishlist: toggle', error),
  });

  const isInWishlist = (productId: string): boolean => {
    return (wishlistQuery.data ?? []).includes(productId);
  };

  return {
    ...wishlistQuery,
    toggleWishlist,
    isInWishlist,
  };
}

export function useProductCache(): Product[] {
  const [cache, setCache] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    getProductCacheAsync().then((products) => {
      if (!cancelled) {
        setCache(products);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return cache;
}
