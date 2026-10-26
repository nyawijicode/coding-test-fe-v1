import type { PerPage } from '@/lib/query-params'

export const PRODUCT_SORTS = ['title', 'price', 'rating', 'stock', 'category'] as const

export type ProductSort = (typeof PRODUCT_SORTS)[number]

export type SortOrder = 'asc' | 'desc'

export type Product = {
  id: number
  title: string
  description: string
  category: string
  brand: string
  price: number
  rating: number
  stock: number
  thumbnail: string | null
  images: string[]
}

export type ProductFilters = {
  q: string
  category: string
  sort: ProductSort
  order: SortOrder
  page: number
  perPage: PerPage
}

export type ProductSortOption = `${ProductSort}-${SortOrder}`

export const DEFAULT_PRODUCT_SORT: ProductSort = 'title'
export const DEFAULT_PRODUCT_ORDER: SortOrder = 'asc'

export const PRODUCT_SORT_OPTIONS: Array<{ value: ProductSortOption; label: string }> = [
  { value: 'title-asc', label: 'Judul A–Z' },
  { value: 'title-desc', label: 'Judul Z–A' },
  { value: 'price-asc', label: 'Harga terendah' },
  { value: 'price-desc', label: 'Harga tertinggi' },
  { value: 'rating-desc', label: 'Rating tertinggi' },
  { value: 'rating-asc', label: 'Rating terendah' },
]
