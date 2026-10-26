import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { fetchUser, fetchUsers } from '@/features/users/api'
import type { UserFilters } from '@/features/users/types'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
    placeholderData: keepPreviousData,
  })
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: userKeys.detail(id ?? 0),
    queryFn: () => {
      if (id === null) {
        throw new Error('ID pengguna tidak tersedia.')
      }

      return fetchUser(id)
    },
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  })
}
