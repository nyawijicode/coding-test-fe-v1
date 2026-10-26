import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/app/theme'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isDark ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'}
      title={isDark ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="text-muted-foreground hover:text-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
