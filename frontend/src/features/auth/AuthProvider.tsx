import { useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { authKeys, useLogout, useSession } from '@/features/auth/hooks'
import type { AuthUser } from '@/features/auth/types'
import { AUTH_UNAUTHORIZED_EVENT } from '@/lib/api'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type AuthContextValue = {
  user: AuthUser | null
  status: AuthStatus
  logout: () => Promise<void>
  isLoggingOut: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession()
  const logoutMutation = useLogout()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.setQueryData<AuthUser | null>(authKeys.me, null)

      if (location.pathname !== '/login') {
        navigate('/login', { replace: true, state: { expired: true } })
      }
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)

    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [location.pathname, navigate, queryClient])

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync()
    } finally {
      queryClient.clear()
      navigate('/login', { replace: true })
    }
  }, [logoutMutation, navigate, queryClient])

  const status: AuthStatus = session.isLoading
    ? 'loading'
    : session.data
      ? 'authenticated'
      : 'unauthenticated'

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session.data ?? null,
      status,
      logout,
      isLoggingOut: logoutMutation.isPending,
    }),
    [logout, logoutMutation.isPending, session.data, status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider')
  }

  return context
}
