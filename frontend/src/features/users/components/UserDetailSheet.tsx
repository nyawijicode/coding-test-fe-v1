import { SearchX } from 'lucide-react'

import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/features/users/components/UserAvatar'
import { useUser } from '@/features/users/hooks'
import { isNotFoundError } from '@/lib/errors'

type UserDetailSheetProps = {
  userId: number | null
  onClose: () => void
}

export function UserDetailSheet({ userId, onClose }: UserDetailSheetProps) {
  const query = useUser(userId)
  const user = query.data
  const notFound = isNotFoundError(query.error)
  const isLoading = query.isLoading && userId !== null

  const title = user?.fullName ?? (notFound ? 'Pengguna tidak ditemukan' : 'Detail pengguna')

  return (
    <Sheet open={userId !== null} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader className="border-b pr-12">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>Detail pengguna dari katalog data.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 pb-6" aria-busy={isLoading}>
          {isLoading ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-52" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-44" />
                  </div>
                ))}
              </div>
            </div>
          ) : notFound ? (
            <EmptyState
              icon={SearchX}
              title="Pengguna tidak ditemukan"
              description="Data pengguna ini tidak tersedia atau sudah dihapus."
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
          ) : user ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <UserAvatar user={user} className="h-16 w-16" fallbackClassName="text-lg" />
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold tracking-tight">{user.fullName}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.email || 'Email tidak tersedia'}
                  </p>
                </div>
              </div>

              <Separator />

              <dl className="space-y-4">
                <div className="space-y-1">
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="text-sm">
                    {user.email ? (
                      <a href={`mailto:${user.email}`} className="hover:underline">
                        {user.email}
                      </a>
                    ) : (
                      '—'
                    )}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-xs text-muted-foreground">Telepon</dt>
                  <dd className="text-sm tabular-nums">
                    {user.phone ? (
                      <a href={`tel:${user.phone}`} className="hover:underline">
                        {user.phone}
                      </a>
                    ) : (
                      '—'
                    )}
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-xs text-muted-foreground">Perusahaan</dt>
                  <dd className="text-sm">{user.companyName || '—'}</dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-xs text-muted-foreground">Kota</dt>
                  <dd className="text-sm">{user.city || '—'}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
