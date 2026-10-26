import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { LoginForm } from '@/features/auth/components/LoginForm'

const server = setupServer(
  http.get('*/sanctum/csrf-cookie', () => new HttpResponse(null, { status: 204 })),
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }

    if (body.password === 'WrongPass#1') {
      return HttpResponse.json(
        {
          message: 'The given data was invalid.',
          errors: { email: ['Email atau kata sandi tidak sesuai.'] },
        },
        { status: 422 },
      )
    }

    if (body.password === 'Throttled#1') {
      return HttpResponse.json(
        { message: 'Too many login attempts.' },
        { status: 429, headers: { 'Retry-After': '30' } },
      )
    }

    return HttpResponse.json({
      data: {
        id: 1,
        name: 'Admin Katalog',
        email: 'admin@example.com',
        role: 'admin',
      },
    })
  }),
)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginForm redirectTo="/products" />} />
          <Route path="/products" element={<h1>Halaman produk</h1>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )

  return { queryClient }
}

describe('LoginForm', () => {
  it('validates required fields before calling the API', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(await screen.findByText('Email wajib diisi.')).toBeInTheDocument()
    expect(screen.getByText('Kata sandi minimal 8 karakter.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('rejects an invalid email and a short password', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText('Email'), 'bukan-email')
    await user.type(screen.getByLabelText('Kata sandi'), 'pendek')
    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(await screen.findByText('Format email tidak valid.')).toBeInTheDocument()
    expect(screen.getByText('Kata sandi minimal 8 karakter.')).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderForm()

    const password = screen.getByLabelText('Kata sandi')
    expect(password).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Tampilkan kata sandi' }))

    expect(password).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Sembunyikan kata sandi' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('signs in and redirects to the destination', async () => {
    const user = userEvent.setup()
    const { queryClient } = renderForm()

    await user.type(screen.getByLabelText('Email'), 'admin@example.com')
    await user.type(screen.getByLabelText('Kata sandi'), 'Admin#12345')
    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(await screen.findByRole('heading', { name: 'Halaman produk' })).toBeInTheDocument()
    expect(queryClient.getQueryData(['auth', 'me'])).toMatchObject({
      email: 'admin@example.com',
    })
  })

  it('maps a 422 response to the matching field', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText('Email'), 'admin@example.com')
    await user.type(screen.getByLabelText('Kata sandi'), 'WrongPass#1')
    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(await screen.findByText('Email atau kata sandi tidak sesuai.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows the throttle window and locks the submit button on 429', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText('Email'), 'admin@example.com')
    await user.type(screen.getByLabelText('Kata sandi'), 'Throttled#1')
    await user.click(screen.getByRole('button', { name: 'Masuk' }))

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent('Terlalu banyak percobaan. Coba lagi dalam 30 detik.')
    expect(screen.getByRole('button', { name: /tunggu 30 detik/i })).toBeDisabled()
  })
})
