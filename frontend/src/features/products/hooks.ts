import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { fetchProduct, fetchProductCategories, fetchProducts } from '@/features/products/api'
import type { ProductFilters } from '@/features/products/types'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
}

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    placeholderData: keepPreviousData,
  })
}

export function useProduct(id: number | null) {
  return useQuery({
    queryKey: productKeys.detail(id ?? 0),
    queryFn: () => {
      if (id === null) {
        throw new Error('ID produk tidak tersedia.')
      }

      return fetchProduct(id)
    },
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProductCategories() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: fetchProductCategories,
    staleTime: 30 * 60 * 1000,
  })
}
