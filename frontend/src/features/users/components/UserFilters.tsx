import { RotateCcw } from 'lucide-react'

import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/ui/button'

type UserFiltersProps = {
  q: string
  canReset: boolean
  onSearchChange: (q: string) => void
  onReset: () => void
}

export function UserFilters({ q, canReset, onSearchChange, onReset }: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <SearchInput
        id="user-search"
        value={q}
        onDebouncedChange={onSearchChange}
        label="Cari pengguna"
        placeholder="Cari nama atau email…"
      />

      {canReset ? (
        <Button variant="ghost" size="sm" onClick={onReset} className="justify-start sm:mb-0.5">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset filter
        </Button>
      ) : null}
    </div>
  )
}
