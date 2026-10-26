import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

type BrandProps = {
  to?: string
  className?: string
}

export function Brand({ to, className }: BrandProps) {
  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Package aria-hidden className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold tracking-tight">Katalog Data</span>
    </>
  )

  const classes = cn(
    'inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    )
  }

  return <div className={classes}>{content}</div>
}
