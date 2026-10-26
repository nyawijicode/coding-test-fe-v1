import { QueryClient } from '@tanstack/react-query'

import { getErrorStatus } from '@/lib/errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const status = getErrorStatus(error)

        // Kesalahan 4xx tidak akan berubah bila diulang.
        if (status !== null && status < 500) {
          return false
        }

        return failureCount < 2
      },
    },
    mutations: {
      retry: 0,
    },
  },
})
