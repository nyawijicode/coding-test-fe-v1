import { SearchX, Star } from 'lucide-react'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductImage } from '@/features/products/components/ProductImage'
import { useProduct } from '@/features/products/hooks'
import { formatCurrency, formatNumber, formatRating } from '@/lib/formatters'
import { isNotFoundError } from '@/lib/errors'
import { cn } from '@/lib/utils'

type ProductDetailSheetProps = {
  productId: number | null
  onClose: () => void
}

export function ProductDetailSheet({ productId, onClose }: ProductDetailSheetProps) {
  const query = useProduct(productId)
  const [activeImage, setActiveImage] = useState(0)
  const [previousProductId, setPreviousProductId] = useState(productId)
  const product = query.data
  const notFound = isNotFoundError(query.error)
  const isLoading = query.isLoading && productId !== null

  if (productId !== previousProductId) {
    setPreviousProductId(productId)
    setActiveImage(0)
  }

  const gallery = useMemo(() => {
    if (!product) {
      return []
    }

    const all = [product.thumbnail, ...product.images].filter((value): value is string =>
      Boolean(value),
    )

    return [...new Set(all)]
  }, [product])

  const title = product?.title ?? (notFound ? 'Produk tidak ditemukan' : 'Detail produk')
  const description = product
    ? [product.brand, product.category].filter(Boolean).join(' · ') || 'Detail produk'
    : isLoading
      ? 'Memuat data produk…'
      : 'Detail produk'

  return (
    <Sheet open={productId !== null} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader className="border-b pr-12">
          <SheetTitle className="pr-2">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 pb-6" aria-busy={isLoading}>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-md" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} className="h-14 w-14 rounded-md" />
                ))}
              </div>
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          ) : notFound ? (
            <EmptyState
              icon={SearchX}
              title="Produk tidak ditemukan"
              description="Data produk ini tidak tersedia atau sudah dihapus."
              className="py-12"
            />
          ) : query.isError ? (
            <ErrorState
              title="Detail gagal dimuat"
              description="Periksa koneksi Anda lalu coba lagi."
              onRetry={() => void query.refetch()}
              isRetrying={query.isFetching}
              className="py-12"
            />
          ) : product ? (
            <div className="space-y-5">
              <div className="space-y-3">
                <ProductImage
                  src={gallery[activeImage] ?? null}
                  alt={`Gambar ${product.title}`}
                  className="aspect-square w-full"
                  iconClassName="h-8 w-8"
                />

                {gallery.length > 1 ? (
                  <div className="flex flex-wrap gap-2">
                    {gallery.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`Tampilkan gambar ${index + 1}`}
                        aria-pressed={activeImage === index}
                        className={cn(
                          'rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                          activeImage === index &&
                            'ring-2 ring-ring ring-offset-2 ring-offset-background',
                        )}
                      >
                        <ProductImage
                          src={image}
                          alt=""
                          className="h-14 w-14"
                          iconClassName="h-3.5 w-3.5"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <dl className="grid grid-cols-2 gap-4 rounded-md border p-4">
                <div className="space-y-1">
                  <dt className="text-xs text-muted-foreground">Harga</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {formatCurrency(product.price)}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs text-muted-foreground">Stok</dt>
                  <dd className="tabular-nums">
                    {product.stock === 0 ? (
                      <Badge variant="dangerOutline">Habis</Badge>
                    ) : (
                      formatNumber(product.stock)
                    )}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs text-muted-foreground">Rating</dt>
                  <dd className="flex items-center gap-1 tabular-nums">
                    <Star aria-hidden className="h-3.5 w-3.5 fill-current text-foreground/60" />
                    {formatRating(product.rating)}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs text-muted-foreground">Kategori</dt>
                  <dd>
                    <Badge variant="secondary" className="font-normal">
                      {product.category}
                    </Badge>
                  </dd>
                </div>
              </dl>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Deskripsi</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {product.description || 'Deskripsi belum tersedia untuk produk ini.'}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
