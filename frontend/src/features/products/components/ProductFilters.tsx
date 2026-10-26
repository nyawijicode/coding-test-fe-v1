import { RotateCcw } from 'lucide-react'

import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PRODUCT_SORT_OPTIONS,
  type ProductSort,
  type ProductSortOption,
  type SortOrder,
} from '@/features/products/types'

type ProductFiltersProps = {
  q: string
  category: string
  sort: ProductSort
  order: SortOrder
  categories: string[]
  categoriesLoading?: boolean
  canReset: boolean
  onSearchChange: (q: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sort: ProductSort, order: SortOrder) => void
  onReset: () => void
}

const ALL_CATEGORIES = '__all__'

export function ProductFilters({
  q,
  category,
  sort,
  order,
  categories,
  categoriesLoading = false,
  canReset,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onReset,
}: ProductFiltersProps) {
  const sortValue: ProductSortOption = `${sort}-${order}`
  const categoryOptions =
    category !== '' && !categories.includes(category) ? [category, ...categories] : categories

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <SearchInput
        id="product-search"
        value={q}
        onDebouncedChange={onSearchChange}
        label="Cari produk"
        placeholder="Cari nama produk…"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1.5 sm:w-[190px]">
          <Label htmlFor="product-category" className="sr-only">
            Kategori
          </Label>
          <Select
            value={category === '' ? ALL_CATEGORIES : category}
            onValueChange={(value) => onCategoryChange(value === ALL_CATEGORIES ? '' : value)}
            disabled={categoriesLoading}
          >
            <SelectTrigger id="product-category" aria-label="Filter kategori">
              <SelectValue placeholder="Semua kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>Semua kategori</SelectItem>
              {categoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 sm:w-[200px]">
          <Label htmlFor="product-sort" className="sr-only">
            Urutkan
          </Label>
          <Select
            value={sortValue}
            onValueChange={(value) => {
              const [nextSort, nextOrder] = value.split('-') as [ProductSort, SortOrder]
              onSortChange(nextSort, nextOrder)
            }}
          >
            <SelectTrigger id="product-sort" aria-label="Urutkan produk">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {canReset ? (
          <Button variant="ghost" size="sm" onClick={onReset} className="justify-start sm:mb-0.5">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset filter
          </Button>
        ) : null}
      </div>
    </div>
  )
}
