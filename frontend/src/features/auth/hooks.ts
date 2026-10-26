import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchSession, login, logout } from '@/features/auth/api'
import type { AuthUser } from '@/features/auth/types'

export const authKeys = {
  me: ['auth', 'me'] as const,
}

export function useSession() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: fetchSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData<AuthUser>(authKeys.me, user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear()
    },
  })
}
