import { StatusPage } from '@/components/shared/StatusPage'

export function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      title="Halaman tidak ditemukan"
      description="Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan."
      actionLabel="Kembali ke beranda"
      actionTo="/products"
    />
  )
}
