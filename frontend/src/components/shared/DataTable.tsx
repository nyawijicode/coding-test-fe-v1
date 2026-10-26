import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import type { KeyboardEvent, ReactNode } from 'react'

import { ErrorState } from '@/components/shared/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type DataTableProps<TData> = {
  ariaLabel: string
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  getRowId: (row: TData) => string
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  isRefreshing?: boolean
  isError?: boolean
  onRetry?: () => void
  emptyState: ReactNode
  mobileItem: (row: TData) => ReactNode
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  skeletonRows?: number
  footer?: ReactNode
}

export function DataTable<TData>({
  ariaLabel,
  columns,
  data,
  getRowId,
  onRowClick,
  isLoading = false,
  isRefreshing = false,
  isError = false,
  onRetry,
  emptyState,
  mobileItem,
  sorting,
  onSortingChange,
  skeletonRows = 10,
  footer,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => getRowId(row),
    manualSorting: true,
    state: { sorting },
    onSortingChange: onSortingChange
      ? (updater) => {
          const next = typeof updater === 'function' ? updater(sorting ?? []) : updater
          onSortingChange(next)
        }
      : undefined,
  })

  if (isError) {
    return (
      <div className="rounded-lg border bg-card">
        <ErrorState onRetry={onRetry} isRetrying={isRefreshing} />
      </div>
    )
  }

  if (!isLoading && data.length === 0) {
    return <div className="rounded-lg border bg-card">{emptyState}</div>
  }

  const skeletonCount = Math.min(skeletonRows, 10)

  const handleRowKeyDown = (row: TData) => (event: KeyboardEvent) => {
    if (!onRowClick) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onRowClick(row)
    }
  }

  return (
    <div
      className="overflow-hidden rounded-lg border bg-card"
      aria-busy={isLoading || isRefreshing}
    >
      <div className="hidden sm:block">
        <Table>
          <caption className="sr-only">{ariaLabel}</caption>
          <TableHeader className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className={cn('transition-opacity', isRefreshing && !isLoading && 'opacity-60')}
          >
            {isLoading
              ? Array.from({ length: skeletonCount }, (_, index) => (
                  <TableRow key={`skeleton-${index}`} className="hover:bg-transparent">
                    {columns.map((column, columnIndex) => (
                      <TableCell key={column.id ?? columnIndex}>
                        <Skeleton
                          className={cn('h-4 w-full', columnIndex === 0 && 'h-10 w-10 rounded-md')}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    tabIndex={onRowClick ? 0 : undefined}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    onKeyDown={handleRowKeyDown(row.original)}
                    className={cn(
                      onRowClick &&
                        'cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <ul className="divide-y sm:hidden" aria-label={ariaLabel}>
        {isLoading
          ? Array.from({ length: skeletonCount }, (_, index) => (
              <li key={`skeleton-${index}`} className="flex items-center gap-3 p-4">
                <Skeleton className="h-11 w-11 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </li>
            ))
          : table.getRowModel().rows.map((row) => (
              <li
                key={row.id}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                onKeyDown={handleRowKeyDown(row.original)}
                className={cn(
                  'transition-colors',
                  onRowClick &&
                    'cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                  isRefreshing && !isLoading && 'opacity-60',
                )}
              >
                {mobileItem(row.original)}
              </li>
            ))}
      </ul>

      {footer}
    </div>
  )
}
