import { Package, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Brand } from '@/components/layout/Brand'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/products', label: 'Produk', icon: Package },
  { to: '/users', label: 'Pengguna', icon: Users },
] as const

type AppSidebarProps = {
  onNavigate?: () => void
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center border-b px-4">
        <Brand to="/products" />
      </div>

      <nav aria-label="Navigasi utama" className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex h-9 items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  isActive
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                )
              }
            >
              <Icon aria-hidden className="h-4 w-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t p-3">
        <p className="px-3 text-xs leading-relaxed text-muted-foreground">
          Data dari DummyJSON, disimpan di MySQL.
        </p>
      </div>
    </div>
  )
}
