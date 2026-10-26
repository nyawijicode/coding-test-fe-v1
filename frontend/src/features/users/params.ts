import {
  DEFAULT_PER_PAGE,
  normalizeSearchTerm,
  parsePerPage,
  parsePositiveInt,
} from '@/lib/query-params'
import type { UserFilters } from '@/features/users/types'

export function parseUserFilters(params: URLSearchParams): UserFilters {
  return {
    q: normalizeSearchTerm(params.get('q')),
    page: parsePositiveInt(params.get('page'), 1),
    perPage: parsePerPage(params.get('per_page')),
  }
}

export function buildUserSearchParams(filters: UserFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.q !== '') {
    params.set('q', filters.q)
  }

  if (filters.page > 1) {
    params.set('page', String(filters.page))
  }

  if (filters.perPage !== DEFAULT_PER_PAGE) {
    params.set('per_page', String(filters.perPage))
  }

  return params
}
