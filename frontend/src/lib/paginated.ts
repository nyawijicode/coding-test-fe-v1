import { z } from 'zod'

import { DEFAULT_PER_PAGE } from '@/lib/query-params'

export type PageMeta = {
  currentPage: number
  perPage: number
  total: number
  lastPage: number
}

export type Paginated<T> = {
  items: T[]
  meta: PageMeta
}

const rawMetaSchema = z.object({
  current_page: z.coerce.number().int().min(1).catch(1),
  per_page: z.coerce.number().int().min(1).catch(DEFAULT_PER_PAGE),
  total: z.coerce.number().int().min(0).catch(0),
  last_page: z.coerce.number().int().min(1).catch(1),
})

const envelopeSchema = z.object({
  data: z.array(z.unknown()),
  meta: rawMetaSchema.nullable().catch(null),
})

export function logInvalidItem(resource: string, raw: unknown, reason?: string): void {
  if (import.meta.env.DEV) {
    console.warn(`[${resource}] Item dilewati karena data tidak valid.`, { reason, raw })
  }
}

export function mapPaginated<T>(
  raw: unknown,
  mapItem: (item: unknown) => T | null,
  resource: string,
): Paginated<T> {
  const parsed = envelopeSchema.safeParse(raw)

  if (!parsed.success) {
    if (import.meta.env.DEV) {
      console.warn(`[${resource}] Bentuk respons list tidak valid.`, parsed.error)
    }

    throw new Error('Respons data tidak valid.')
  }

  const items = parsed.data.data.map(mapItem).filter((item): item is T => item !== null)

  const meta = parsed.data.meta
  const perPage = meta?.per_page ?? DEFAULT_PER_PAGE
  const total = meta?.total ?? items.length
  const lastPage = Math.max(1, meta?.last_page ?? Math.ceil(total / perPage))

  return {
    items,
    meta: {
      currentPage: meta?.current_page ?? 1,
      perPage,
      total,
      lastPage,
    },
  }
}
