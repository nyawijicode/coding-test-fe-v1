import type { Column, ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, Star } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ProductImage } from '@/features/products/components/ProductImage'
import type { Product } from '@/features/products/types'
import { formatCurrency, formatNumber, formatRating } from '@/lib/formatters'
import { cn } from '@/lib/utils'

function SortableHeader({
  column,
  label,
  align = 'left',
}: {
  column: Column<Product, unknown>
  label: string
  align?: 'left' | 'right'
}) {
  if (!column.getCanSort()) {
    return <span className={cn(align === 'right' && 'block text-right')}>{label}</span>
  }

  const sorted = column.getIsSorted()

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      aria-label={`Urutkan berdasarkan ${label}`}
      className={cn(
        'inline-flex items-center gap-1 rounded-sm py-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        align === 'right' && 'w-full justify-end',
      )}
    >
      {label}
      {sorted === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5" aria-hidden />
      ) : sorted === 'desc' ? (
        <ArrowDown className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" aria-hidden />
      )}
    </button>
  )
}

export function createProductColumns(): ColumnDef<Product>[] {
  return [
    {
      id: 'thumbnail',
      header: 'Gambar',
      enableSorting: false,
      cell: ({ row }) => (
        <ProductImage
          src={row.original.thumbnail}
          alt={`Gambar ${row.original.title}`}
          className="h-10 w-10"
        />
      ),
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <SortableHeader column={column} label="Produk" />,
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block max-w-[300px] truncate font-medium" tabIndex={-1}>
              {row.original.title}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{row.original.title}</TooltipContent>
        </Tooltip>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Kategori',
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <SortableHeader column={column} label="Harga" align="right" />,
      cell: ({ row }) => (
        <span className="block whitespace-nowrap text-right tabular-nums">
          {formatCurrency(row.original.price)}
        </span>
      ),
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => <SortableHeader column={column} label="Stok" align="right" />,
      cell: ({ row }) => (
        <div className="text-right tabular-nums">
          {row.original.stock === 0 ? (
            <Badge variant="dangerOutline">Habis</Badge>
          ) : (
            formatNumber(row.original.stock)
          )}
        </div>
      ),
    },
    {
      accessorKey: 'rating',
      header: ({ column }) => <SortableHeader column={column} label="Rating" align="right" />,
      cell: ({ row }) => (
        <span className="flex items-center justify-end gap-1 tabular-nums">
          <Star aria-hidden className="h-3.5 w-3.5 fill-current text-foreground/60" />
          {formatRating(row.original.rating)}
        </span>
      ),
    },
  ]
}

export function ProductMobileCard({ product }: { product: Product }) {
  return (
    <div className="flex gap-3 p-4">
      <ProductImage
        src={product.thumbnail}
        alt={`Gambar ${product.title}`}
        className="h-14 w-14 shrink-0"
      />

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 flex-1 truncate font-medium">{product.title}</p>
          <span className="shrink-0 text-sm font-medium tabular-nums">
            {formatCurrency(product.price)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="font-normal">
            {product.category}
          </Badge>
          {product.stock === 0 ? (
            <Badge variant="dangerOutline">Habis</Badge>
          ) : (
            <span className="tabular-nums">Stok {formatNumber(product.stock)}</span>
          )}
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Star aria-hidden className="h-3 w-3 fill-current text-foreground/60" />
            {formatRating(product.rating)}
          </span>
        </div>
      </div>
    </div>
  )
}
