import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedLayout } from '@/app/ProtectedLayout'
import { RouteContentLoading } from '@/app/RouteLoading'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })),
)

const ProductsPage = lazy(() =>
  import('@/pages/ProductsPage').then((module) => ({ default: module.ProductsPage })),
)

const UsersPage = lazy(() =>
  import('@/pages/UsersPage').then((module) => ({ default: module.UsersPage })),
)

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<RouteContentLoading label="Memuat halaman masuk…" />}>
            <LoginPage />
          </Suspense>
        }
      />

      <Route element={<ProtectedLayout />}>
        <Route
          path="/products"
          element={
            <Suspense fallback={<RouteContentLoading label="Memuat produk…" />}>
              <ProductsPage />
            </Suspense>
          }
        />
        <Route
          path="/users"
          element={
            <Suspense fallback={<RouteContentLoading label="Memuat pengguna…" />}>
              <UsersPage />
            </Suspense>
          }
        />
        <Route path="/403" element={<ForbiddenPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
