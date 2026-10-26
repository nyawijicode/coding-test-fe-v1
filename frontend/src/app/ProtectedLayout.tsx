import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { RouteLoading } from '@/app/RouteLoading'
import { AppShell } from '@/components/layout/AppShell'
import { useAuth } from '@/features/auth/AuthProvider'

export function ProtectedLayout() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <RouteLoading label="Memeriksa sesi…" />
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
    )
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
