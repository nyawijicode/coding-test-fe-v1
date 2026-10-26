import { Component, type ErrorInfo, type ReactNode } from 'react'

import { StatusPage } from '@/components/shared/StatusPage'

type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('Terjadi kesalahan pada UI.', error, info.componentStack)
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <StatusPage
          code="500"
          title="Terjadi kesalahan"
          description="Halaman ini gagal ditampilkan. Muat ulang atau kembali ke beranda."
          actionLabel="Kembali ke beranda"
          actionTo="/products"
        />
      )
    }

    return this.props.children
  }
}
