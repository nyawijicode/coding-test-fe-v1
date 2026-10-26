import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type SearchInputProps = {
  id: string
  value: string
  onDebouncedChange: (value: string) => void
  placeholder: string
  label: string
  delay?: number
  className?: string
}

export function SearchInput({
  id,
  value,
  onDebouncedChange,
  placeholder,
  label,
  delay = 300,
  className,
}: SearchInputProps) {
  const [draft, setDraft] = useState(value)
  const [previousValue, setPreviousValue] = useState(value)
  const onChangeRef = useRef(onDebouncedChange)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    onChangeRef.current = onDebouncedChange
  }, [onDebouncedChange])

  if (value !== previousValue) {
    setPreviousValue(value)
    setDraft(value)
  }

  useEffect(() => {
    if (draft === value) {
      return
    }

    timerRef.current = setTimeout(() => {
      onChangeRef.current(draft)
    }, delay)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [draft, value, delay])

  const flush = (next: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setDraft(next)
    onChangeRef.current(next)
  }

  return (
    <div className={cn('w-full space-y-1.5 sm:max-w-xs', className)}>
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={id}
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && draft !== '') {
              event.preventDefault()
              flush('')
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="pl-9 pr-9 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {draft !== '' ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Hapus pencarian"
            onClick={() => flush('')}
            className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
