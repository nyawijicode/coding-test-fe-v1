import { StatusPage } from '@/components/shared/StatusPage'

export function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      title="Akses ditolak"
      description="Anda tidak memiliki izin untuk membuka halaman ini."
      actionLabel="Kembali ke Produk"
      actionTo="/products"
    />
  )
}
