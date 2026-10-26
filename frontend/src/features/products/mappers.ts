import { z } from 'zod'

import { safeImageUrl } from '@/lib/images'
import { logInvalidItem, mapPaginated, type Paginated } from '@/lib/paginated'
import type { Product } from '@/features/products/types'

const productSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1).catch('Tanpa judul'),
  description: z.string().catch(''),
  category: z.string().trim().min(1).catch('Lainnya'),
  brand: z.string().trim().catch(''),
  price: z.coerce.number().finite().nonnegative().catch(0),
  rating: z.coerce.number().finite().min(0).max(5).catch(0),
  stock: z.coerce.number().int().nonnegative().catch(0),
  thumbnail: z
    .string()
    .nullish()
    .transform((value) => safeImageUrl(value))
    .catch(null),
  images: z
    .array(z.unknown())
    .catch([])
    .transform((values) =>
      values
        .map((value) => (typeof value === 'string' ? safeImageUrl(value) : null))
        .filter((value): value is string => value !== null),
    ),
})

const categorySchema = z.string().trim().min(1)

export function mapProduct(raw: unknown): Product | null {
  const parsed = productSchema.safeParse(raw)

  if (!parsed.success) {
    logInvalidItem('products', raw, parsed.error.issues[0]?.message)
    return null
  }

  return parsed.data
}

export function mapProductDetail(raw: unknown): Product {
  const product = mapProduct(raw)

  if (!product) {
    throw new Error('Detail produk tidak valid.')
  }

  return product
}

export function mapProductsResponse(raw: unknown): Paginated<Product> {
  return mapPaginated(raw, mapProduct, 'products')
}

export function mapCategories(raw: unknown): string[] {
  const parsed = z.object({ data: z.array(z.unknown()) }).safeParse(raw)

  if (!parsed.success) {
    throw new Error('Respons kategori tidak valid.')
  }

  const categories = parsed.data.data
    .map((value) => categorySchema.safeParse(value))
    .flatMap((result) => (result.success ? [result.data] : []))

  return [...new Set(categories)]
}
