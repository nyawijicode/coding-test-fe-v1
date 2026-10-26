import { Link } from 'react-router-dom'

import { Brand } from '@/components/layout/Brand'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'

type StatusPageProps = {
  code: string
  title: string
  description: string
  actionLabel: string
  actionTo: string
}

export function StatusPage({ code, title, description, actionLabel, actionTo }: StatusPageProps) {
  return (
    <div className="flex min-h-svh flex-col px-6">
      <div className="flex h-14 items-center justify-between">
        <Brand />
        <ThemeToggle />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center pb-20 text-center">
        <p className="text-sm font-medium tabular-nums text-muted-foreground">{code}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        <Button asChild className="mt-6">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      </main>
    </div>
  )
}
