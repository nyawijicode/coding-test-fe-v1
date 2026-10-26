import { Check } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { RouteLoading } from '@/app/RouteLoading'
import { Brand } from '@/components/layout/Brand'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useAuth } from '@/features/auth/AuthProvider'
import { safeRedirectTarget } from '@/lib/navigation'

type LoginState = {
  from?: unknown
  expired?: boolean
}

const expiredNoticeShown = new Set<string>()

const HIGHLIGHTS = [
  'Pencarian, filter, dan pagination di sisi server',
  'Detail produk dan pengguna tanpa meninggalkan halaman',
  'Sesi cookie HttpOnly dengan proteksi CSRF',
] as const

export function LoginPage() {
  const { status } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state ?? null) as LoginState | null
  const destination = useMemo(() => safeRedirectTarget(state?.from), [state?.from])
  const expired = state?.expired === true

  useEffect(() => {
    if (!expired || expiredNoticeShown.has(location.key)) {
      return
    }

    expiredNoticeShown.add(location.key)
    toast.info('Sesi Anda berakhir. Silakan masuk kembali.')
    navigate(location.pathname, { replace: true, state: null })
  }, [expired, location.key, location.pathname, navigate])

  if (status === 'loading') {
    return <RouteLoading label="Memeriksa sesi…" />
  }

  if (status === 'authenticated') {
    return <Navigate to={destination} replace />
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex min-h-svh flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Brand />
          <ThemeToggle />
        </div>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[360px] space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight">Masuk</h1>
              <p className="text-sm text-muted-foreground">
                Gunakan akun Anda untuk membuka katalog produk dan pengguna.
              </p>
            </div>

            <LoginForm redirectTo={destination} />

            <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
              <p>
                Sesi disimpan pada cookie HttpOnly. Token tidak pernah disimpan di localStorage.
              </p>
              {import.meta.env.DEV ? (
                <div className="rounded-md border bg-muted/40 px-3 py-2">
                  <span className="font-medium text-foreground">Akun demo</span>
                  <span className="mx-1">·</span>
                  <span className="whitespace-nowrap">admin@example.com</span>
                  <span className="mx-1">/</span>
                  <span className="whitespace-nowrap">Admin#12345</span>
                </div>
              ) : null}
            </div>
          </div>
        </main>

        <footer className="text-xs text-muted-foreground">© 2026 Katalog Data</footer>
      </div>

      <aside className="hidden border-l bg-muted p-10 lg:flex lg:flex-col lg:justify-between">
        <p className="text-sm font-medium">Katalog Data</p>

        <div className="max-w-md space-y-5">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Satu tempat untuk produk dan pengguna.
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Data DummyJSON diimpor ke MySQL oleh Laravel, lalu disajikan lewat API dengan validasi
            dan field yang sudah disaring.
          </p>
          <ul className="space-y-2.5">
            {HIGHLIGHTS.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">Sumber data: DummyJSON · Basis data: MySQL</p>
      </aside>
    </div>
  )
}
