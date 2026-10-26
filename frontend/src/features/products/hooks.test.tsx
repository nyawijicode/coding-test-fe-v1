import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { ReactNode } from 'react'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { useProducts } from '@/features/products/hooks'
import type { ProductFilters } from '@/features/products/types'

const requests: URL[] = []

const server = setupServer(
  http.get('*/api/v1/products', ({ request }) => {
    requests.push(new URL(request.url))

    return HttpResponse.json({
      data: [
        {
          id: 1,
          title: 'Headphone',
          description: 'Suara jernih.',
          category: 'audio',
          brand: 'Contoh',
          price: 129.99,
          rating: 4.6,
          stock: 12,
          thumbnail: 'https://cdn.example.com/thumb.jpg',
          images: [],
        },
        { id: 'invalid' },
      ],
      meta: {
        current_page: 2,
        per_page: 10,
        total: 11,
        last_page: 2,
      },
    })
  }),
)

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  requests.length = 0
  server.resetHandlers()
})
afterAll(() => server.close())

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

const filters: ProductFilters = {
  q: 'headphone',
  category: 'audio',
  sort: 'price',
  order: 'desc',
  page: 2,
  perPage: 10,
}

describe('useProducts', () => {
  it('requests the active filters and returns mapped data', async () => {
    const { result } = renderHook(() => useProducts(filters), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.items[0]?.title).toBe('Headphone')
    expect(result.current.data?.meta).toEqual({
      currentPage: 2,
      perPage: 10,
      total: 11,
      lastPage: 2,
    })

    expect(requests).toHaveLength(1)
    expect(requests[0]?.searchParams.get('q')).toBe('headphone')
    expect(requests[0]?.searchParams.get('category')).toBe('audio')
    expect(requests[0]?.searchParams.get('sort')).toBe('price')
    expect(requests[0]?.searchParams.get('order')).toBe('desc')
    expect(requests[0]?.searchParams.get('page')).toBe('2')
    expect(requests[0]?.searchParams.get('per_page')).toBe('10')
  })

  it('omits empty optional filters', async () => {
    const { result } = renderHook(() => useProducts({ ...filters, q: '', category: '' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(requests[0]?.searchParams.has('q')).toBe(false)
    expect(requests[0]?.searchParams.has('category')).toBe(false)
  })

  it('surfaces a request failure as an error state', async () => {
    server.use(
      http.get('*/api/v1/products', () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => useProducts(filters), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.data).toBeUndefined()
  })
})
