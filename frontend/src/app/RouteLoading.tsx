import { Brand } from '@/components/layout/Brand'
import { Skeleton } from '@/components/ui/skeleton'

export function RouteContentLoading({ label = 'Memuat halaman…' }: { label?: string }) {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite">
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-9 w-full sm:max-w-xs" />
        <Skeleton className="h-9 w-full sm:w-40" />
        <Skeleton className="h-9 w-full sm:w-44" />
      </div>

      <div className="overflow-hidden rounded-lg border">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="flex h-[52px] items-center gap-4 border-b px-4 last:border-b-0"
          >
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="hidden h-4 w-20 sm:block" />
          </div>
        ))}
      </div>

      <span className="sr-only">{label}</span>
    </div>
  )
}

export function RouteLoading({ label = 'Memeriksa sesi…' }: { label?: string }) {
  return (
    <div className="flex min-h-svh flex-col" aria-busy="true" aria-live="polite">
      <div className="flex h-14 items-center border-b px-4 sm:px-6">
        <Brand />
      </div>

      <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="flex h-[52px] items-center gap-4 border-b px-4 last:border-b-0"
            >
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="hidden h-4 w-24 sm:block" />
              <Skeleton className="hidden h-4 w-20 sm:block" />
            </div>
          ))}
        </div>

        <span className="sr-only">{label}</span>
      </div>
    </div>
  )
}
