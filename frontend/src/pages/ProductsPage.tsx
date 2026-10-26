import type { SortingState } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { PaginationBar } from '@/components/shared/PaginationBar'
import { ProductDetailSheet } from '@/features/products/components/ProductDetailSheet'
import { ProductFilters } from '@/features/products/components/ProductFilters'
import {
  createProductColumns,
  ProductMobileCard,
} from '@/features/products/components/ProductTable'
import { useProductCategories, useProducts } from '@/features/products/hooks'
import {
  buildProductSearchParams,
  isProductSort,
  parseProductFilters,
} from '@/features/products/params'
import {
  DEFAULT_PRODUCT_ORDER,
  DEFAULT_PRODUCT_SORT,
  type Product,
  type ProductFilters as ProductFiltersState,
} from '@/features/products/types'
import { formatNumber } from '@/lib/formatters'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseProductFilters(searchParams), [searchParams])
  const productsQuery = useProducts(filters)
  const categoriesQuery = useProductCategories()
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const columns = useMemo(() => createProductColumns(), [])

  const data = productsQuery.data

  const updateFilters = (patch: Partial<ProductFiltersState>) => {
    const next: ProductFiltersState = { ...filters, ...patch }
    const resetsPage = ['q', 'category', 'sort', 'order', 'perPage'].some((key) => key in patch)

    if (resetsPage) {
      next.page = 1
    }

    setSearchParams(buildProductSearchParams(next), { replace: true })
  }

  const resetFilters = () => {
    updateFilters({
      q: '',
      category: '',
      sort: DEFAULT_PRODUCT_SORT,
      order: DEFAULT_PRODUCT_ORDER,
    })
  }

  useEffect(() => {
    const lastPage = data?.meta.lastPage

    if (lastPage && filters.page > lastPage) {
      setSearchParams(buildProductSearchParams({ ...filters, page: lastPage }), {
        replace: true,
      })
    }
  }, [data?.meta.lastPage, filters, setSearchParams])

  const sorting: SortingState = [{ id: filters.sort, desc: filters.order === 'desc' }]

  const handleSortingChange = (next: SortingState) => {
    const first = next[0]

    if (!first || !isProductSort(first.id)) {
      updateFilters({ sort: DEFAULT_PRODUCT_SORT, order: DEFAULT_PRODUCT_ORDER })
      return
    }

    updateFilters({ sort: first.id, order: first.desc ? 'desc' : 'asc' })
  }

  const hasSearchFilters = filters.q !== '' || filters.category !== ''
  const canReset =
    hasSearchFilters ||
    filters.sort !== DEFAULT_PRODUCT_SORT ||
    filters.order !== DEFAULT_PRODUCT_ORDER

  const emptyTitle = filters.q
    ? filters.category
      ? `Tidak ada produk untuk kata kunci '${filters.q}' pada kategori ini`
      : `Tidak ada produk untuk kata kunci '${filters.q}'`
    : filters.category
      ? 'Tidak ada produk pada kategori ini'
      : 'Belum ada data produk'

  const emptyDescription = hasSearchFilters
    ? 'Coba kata kunci lain atau hapus filter yang aktif.'
    : 'Data produk belum tersedia saat ini.'

  return (
    <div className="space-y-5">
      <PageHeader
        title="Produk"
        description="Telusuri katalog, filter kategori, dan buka detail produk."
        meta={data ? `${formatNumber(data.meta.total)} produk` : undefined}
      />

      <ProductFilters
        q={filters.q}
        category={filters.category}
        sort={filters.sort}
        order={filters.order}
        categories={categoriesQuery.data ?? []}
        categoriesLoading={categoriesQuery.isLoading}
        canReset={canReset}
        onSearchChange={(q) => updateFilters({ q })}
        onCategoryChange={(category) => updateFilters({ category })}
        onSortChange={(sort, order) => updateFilters({ sort, order })}
        onReset={resetFilters}
      />

      <DataTable<Product>
        ariaLabel="Daftar produk"
        columns={columns}
        data={data?.items ?? []}
        getRowId={(product) => String(product.id)}
        onRowClick={(product) => setSelectedProductId(product.id)}
        isLoading={productsQuery.isLoading}
        isRefreshing={productsQuery.isFetching && !productsQuery.isLoading}
        isError={productsQuery.isError}
        onRetry={() => void productsQuery.refetch()}
        skeletonRows={filters.perPage}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        mobileItem={(product) => <ProductMobileCard product={product} />}
        emptyState={
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            actionLabel={hasSearchFilters ? 'Reset filter' : undefined}
            onAction={hasSearchFilters ? resetFilters : undefined}
          />
        }
        footer={
          data && data.items.length > 0 ? (
            <PaginationBar
              page={filters.page}
              perPage={filters.perPage}
              total={data.meta.total}
              lastPage={data.meta.lastPage}
              itemLabel="produk"
              onPageChange={(page) => updateFilters({ page })}
              onPerPageChange={(perPage) => updateFilters({ perPage })}
            />
          ) : null
        }
      />

      <ProductDetailSheet
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  )
}
