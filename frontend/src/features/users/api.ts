import { api } from '@/lib/api'
import { mapUserDetail, mapUsersResponse } from '@/features/users/mappers'
import type { AppUser, UserFilters } from '@/features/users/types'
import type { Paginated } from '@/lib/paginated'

export async function fetchUsers(filters: UserFilters): Promise<Paginated<AppUser>> {
  const params: Record<string, string | number> = {
    page: filters.page,
    per_page: filters.perPage,
  }

  if (filters.q !== '') {
    params.q = filters.q
  }

  const response = await api.get<unknown>('/users', { params })

  return mapUsersResponse(response.data)
}

export async function fetchUser(id: number): Promise<AppUser> {
  const response = await api.get<{ data: unknown }>(`/users/${id}`)

  return mapUserDetail(response.data.data)
}
