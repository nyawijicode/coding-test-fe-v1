import { api } from '@/lib/api'
import { mapCategories, mapProductDetail, mapProductsResponse } from '@/features/products/mappers'
import type { Product, ProductFilters } from '@/features/products/types'
import type { Paginated } from '@/lib/paginated'

export async function fetchProducts(filters: ProductFilters): Promise<Paginated<Product>> {
  const params: Record<string, string | number> = {
    page: filters.page,
    per_page: filters.perPage,
    sort: filters.sort,
    order: filters.order,
  }

  if (filters.q !== '') {
    params.q = filters.q
  }

  if (filters.category !== '') {
    params.category = filters.category
  }

  const response = await api.get<unknown>('/products', { params })

  return mapProductsResponse(response.data)
}

export async function fetchProduct(id: number): Promise<Product> {
  const response = await api.get<{ data: unknown }>(`/products/${id}`)

  return mapProductDetail(response.data.data)
}

export async function fetchProductCategories(): Promise<string[]> {
  const response = await api.get<unknown>('/products/categories')

  return mapCategories(response.data)
}
