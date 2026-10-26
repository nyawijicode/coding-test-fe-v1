import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RotateCw } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'

describe('EmptyState', () => {
  it('announces the empty result and renders the optional action', async () => {
    const onAction = vi.fn()
    const user = userEvent.setup()

    render(
      <EmptyState
        icon={RotateCw}
        title="Belum ada data"
        description="Coba filter lain."
        actionLabel="Reset filter"
        onAction={onAction}
      />,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Belum ada data' })).toBeInTheDocument()
    expect(screen.getByText('Coba filter lain.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset filter' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('omits the action when no handler is provided', () => {
    render(<EmptyState title="Kosong" actionLabel="Tidak tampil" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('ErrorState', () => {
  it('shows the default message and triggers retry', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()

    render(<ErrorState onRetry={onRetry} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Data gagal dimuat' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /coba lagi/i }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('disables retry while a request is in flight', () => {
    render(<ErrorState title="Gagal" onRetry={() => undefined} isRetrying />)

    expect(screen.getByRole('button', { name: /coba lagi/i })).toBeDisabled()
  })
})
