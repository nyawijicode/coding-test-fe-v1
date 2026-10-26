import {
  DEFAULT_PER_PAGE,
  normalizeSearchTerm,
  parsePerPage,
  parsePositiveInt,
} from '@/lib/query-params'
import {
  DEFAULT_PRODUCT_ORDER,
  DEFAULT_PRODUCT_SORT,
  PRODUCT_SORTS,
  type ProductFilters,
  type ProductSort,
  type SortOrder,
} from '@/features/products/types'

export function isProductSort(value: string | null): value is ProductSort {
  return value !== null && (PRODUCT_SORTS as readonly string[]).includes(value)
}

export function isSortOrder(value: string | null): value is SortOrder {
  return value === 'asc' || value === 'desc'
}

export function parseProductFilters(params: URLSearchParams): ProductFilters {
  const sort = params.get('sort')
  const order = params.get('order')

  return {
    q: normalizeSearchTerm(params.get('q')),
    category: normalizeSearchTerm(params.get('category')),
    sort: isProductSort(sort) ? sort : DEFAULT_PRODUCT_SORT,
    order: isSortOrder(order) ? order : DEFAULT_PRODUCT_ORDER,
    page: parsePositiveInt(params.get('page'), 1),
    perPage: parsePerPage(params.get('per_page')),
  }
}

export function buildProductSearchParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.q !== '') {
    params.set('q', filters.q)
  }

  if (filters.category !== '') {
    params.set('category', filters.category)
  }

  if (filters.sort !== DEFAULT_PRODUCT_SORT || filters.order !== DEFAULT_PRODUCT_ORDER) {
    params.set('sort', filters.sort)
    params.set('order', filters.order)
  }

  if (filters.page > 1) {
    params.set('page', String(filters.page))
  }

  if (filters.perPage !== DEFAULT_PER_PAGE) {
    params.set('per_page', String(filters.perPage))
  }

  return params
}
