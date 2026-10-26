import { ChevronRight, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { AccountMenu } from '@/components/layout/AccountMenu'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const PAGE_LABELS: Record<string, string> = {
  '/products': 'Produk',
  '/users': 'Pengguna',
  '/403': 'Akses ditolak',
}

type TopbarProps = {
  onOpenMenu: () => void
}

export function Topbar({ onOpenMenu }: TopbarProps) {
  const location = useLocation()
  const label = PAGE_LABELS[location.pathname] ?? 'Katalog'

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenMenu}
        aria-label="Buka menu navigasi"
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex min-w-0 items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        <span className="hidden text-muted-foreground sm:inline">Katalog</span>
        <ChevronRight
          aria-hidden
          className="hidden h-3.5 w-3.5 text-muted-foreground/70 sm:inline"
        />
        <span className="truncate font-medium">{label}</span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-1 h-5" />
        <AccountMenu />
      </div>
    </header>
  )
}
