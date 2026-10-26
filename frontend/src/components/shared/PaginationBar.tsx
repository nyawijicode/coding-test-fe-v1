import { useId } from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatNumber } from '@/lib/formatters'
import { PER_PAGE_OPTIONS, type PerPage } from '@/lib/query-params'

type PaginationBarProps = {
  page: number
  perPage: PerPage
  total: number
  lastPage: number
  itemLabel: string
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: PerPage) => void
}

function buildPageItems(current: number, last: number): Array<number | 'ellipsis'> {
  if (last <= 7) {
    return Array.from({ length: last }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, last, current - 1, current, current + 1])
  const sorted = [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b)

  const items: Array<number | 'ellipsis'> = []

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1]

    if (previous !== undefined && page - previous > 1) {
      items.push('ellipsis')
    }

    items.push(page)
  })

  return items
}

export function PaginationBar({
  page,
  perPage,
  total,
  lastPage,
  itemLabel,
  onPageChange,
  onPerPageChange,
}: PaginationBarProps) {
  const selectId = useId()
  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = total === 0 ? 0 : Math.min(page * perPage, total)
  const pageItems = buildPageItems(page, Math.max(lastPage, 1))

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
        <p className="tabular-nums">
          Menampilkan {formatNumber(from)}–{formatNumber(to)} dari {formatNumber(total)} {itemLabel}
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor={selectId} className="text-xs text-muted-foreground">
            Per halaman
          </label>
          <Select
            value={String(perPage)}
            onValueChange={(value) => onPerPageChange(Number(value) as PerPage)}
          >
            <SelectTrigger id={selectId} className="h-8 w-[72px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Pagination className="mx-0 w-auto justify-start sm:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-disabled={page <= 1}
            />
          </PaginationItem>

          <span className="px-2 text-xs tabular-nums text-muted-foreground sm:hidden">
            Halaman {formatNumber(page)} dari {formatNumber(Math.max(lastPage, 1))}
          </span>

          {pageItems.map((item, index) => (
            <PaginationItem
              key={item === 'ellipsis' ? `ellipsis-${index}` : item}
              className="hidden sm:block"
            >
              {item === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={item === page}
                  onClick={() => onPageChange(item)}
                  aria-label={`Halaman ${item}`}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(page + 1)}
              disabled={page >= lastPage}
              aria-disabled={page >= lastPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
