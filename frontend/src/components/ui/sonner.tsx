import { Toaster as SonnerToaster } from 'sonner'

import { useTheme } from '@/app/theme'

export function Toaster() {
  const { resolvedTheme } = useTheme()

  return (
    <SonnerToaster
      theme={resolvedTheme}
      position="bottom-right"
      duration={4000}
      closeButton
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast border bg-popover text-popover-foreground shadow-lg',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
    />
  )
}
