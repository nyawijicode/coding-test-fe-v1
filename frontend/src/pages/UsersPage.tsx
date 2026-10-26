import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DataTable } from '@/components/shared/DataTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { PaginationBar } from '@/components/shared/PaginationBar'
import { UserDetailSheet } from '@/features/users/components/UserDetailSheet'
import { UserFilters } from '@/features/users/components/UserFilters'
import { createUserColumns, UserMobileCard } from '@/features/users/components/UserTable'
import { useUsers } from '@/features/users/hooks'
import { buildUserSearchParams, parseUserFilters } from '@/features/users/params'
import type { AppUser, UserFilters as UserFiltersState } from '@/features/users/types'
import { formatNumber } from '@/lib/formatters'

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseUserFilters(searchParams), [searchParams])
  const usersQuery = useUsers(filters)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const columns = useMemo(() => createUserColumns(), [])

  const data = usersQuery.data

  const updateFilters = (patch: Partial<UserFiltersState>) => {
    const next: UserFiltersState = { ...filters, ...patch }
    const resetsPage = 'q' in patch || 'perPage' in patch

    if (resetsPage) {
      next.page = 1
    }

    setSearchParams(buildUserSearchParams(next), { replace: true })
  }

  const resetFilters = () => {
    updateFilters({ q: '' })
  }

  useEffect(() => {
    const lastPage = data?.meta.lastPage

    if (lastPage && filters.page > lastPage) {
      setSearchParams(buildUserSearchParams({ ...filters, page: lastPage }), {
        replace: true,
      })
    }
  }, [data?.meta.lastPage, filters, setSearchParams])

  const hasSearch = filters.q !== ''

  const emptyTitle = hasSearch
    ? `Tidak ada pengguna untuk kata kunci '${filters.q}'`
    : 'Belum ada data pengguna'

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pengguna"
        description="Cari pengguna berdasarkan nama atau email, lalu buka detailnya."
        meta={data ? `${formatNumber(data.meta.total)} pengguna` : undefined}
      />

      <UserFilters
        q={filters.q}
        canReset={hasSearch || filters.page > 1}
        onSearchChange={(q) => updateFilters({ q })}
        onReset={resetFilters}
      />

      <DataTable<AppUser>
        ariaLabel="Daftar pengguna"
        columns={columns}
        data={data?.items ?? []}
        getRowId={(user) => String(user.id)}
        onRowClick={(user) => setSelectedUserId(user.id)}
        isLoading={usersQuery.isLoading}
        isRefreshing={usersQuery.isFetching && !usersQuery.isLoading}
        isError={usersQuery.isError}
        onRetry={() => void usersQuery.refetch()}
        skeletonRows={filters.perPage}
        mobileItem={(user) => <UserMobileCard user={user} />}
        emptyState={
          <EmptyState
            title={emptyTitle}
            description={
              hasSearch
                ? 'Coba kata kunci lain atau hapus pencarian yang aktif.'
                : 'Data pengguna belum tersedia saat ini.'
            }
            actionLabel={hasSearch ? 'Reset filter' : undefined}
            onAction={hasSearch ? resetFilters : undefined}
          />
        }
        footer={
          data && data.items.length > 0 ? (
            <PaginationBar
              page={filters.page}
              perPage={filters.perPage}
              total={data.meta.total}
              lastPage={data.meta.lastPage}
              itemLabel="pengguna"
              onPageChange={(page) => updateFilters({ page })}
              onPerPageChange={(perPage) => updateFilters({ perPage })}
            />
          ) : null
        }
      />

      <UserDetailSheet userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </div>
  )
}
