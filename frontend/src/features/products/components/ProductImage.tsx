import { ImageOff } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

type ProductImageProps = {
  src: string | null
  alt: string
  className?: string
  iconClassName?: string
}

export function ProductImage({ src, alt, className, iconClassName }: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = src !== null && failedSrc === src

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex items-center justify-center rounded-md border bg-muted text-muted-foreground',
          className,
        )}
      >
        <ImageOff aria-hidden className={cn('h-4 w-4', iconClassName)} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={cn('rounded-md border bg-muted object-cover', className)}
    />
  )
}
