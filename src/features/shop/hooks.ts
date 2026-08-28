// Shop Module - Hooks

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productRepository } from './repository';
import { cartRepository } from './cartRepository';
import { wishlistRepository } from './wishlistRepository';
import { ProductFilter, DEFAULT_PRODUCT_FILTER, SortOption } from './types';
import { useAuthContext } from '../../infrastructure/auth/AuthContext';

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
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
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
  });

  const updateCartQuantity = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartRepository.updateQuantity(productId, quantity, patientId ?? undefined),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopKeys.cart() });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: (productId: string) => cartRepository.removeItem(productId, patientId ?? undefined),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopKeys.cart() });
    },
  });

  const clearCart = useMutation({
    mutationFn: () => cartRepository.clearAll(patientId ?? undefined),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: shopKeys.cart() });
    },
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
