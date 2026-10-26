import { AlertCircle, RotateCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

export function ErrorState({
  title = 'Data gagal dimuat',
  description = 'Periksa koneksi Anda lalu coba lagi.',
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center gap-3 px-6 py-16 text-center', className)}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-destructive/30 bg-destructive/5">
        <AlertCircle aria-hidden className="h-5 w-5 text-destructive" />
      </div>
      <div className="space-y-1">
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-1"
        >
          <RotateCw className={cn('h-4 w-4', isRetrying && 'animate-spin')} aria-hidden />
          Coba lagi
        </Button>
      ) : null}
    </div>
  )
}
