import { describe, expect, it } from 'vitest'

import {
  mapCategories,
  mapProduct,
  mapProductDetail,
  mapProductsResponse,
} from '@/features/products/mappers'

const rawProduct = {
  id: 7,
  title: '  Headphone Nirkabel  ',
  description: 'Suara jernih.',
  category: 'audio',
  brand: 'Contoh',
  price: '129.99',
  rating: '4.6',
  stock: '12',
  thumbnail: 'https://cdn.example.com/thumb.jpg',
  images: [
    'https://cdn.example.com/1.jpg',
    'javascript:alert(1)',
    'https://cdn.example.com/1.jpg',
    null,
  ],
  sku: 'SHOULD-NOT-LEAK',
}

describe('mapProduct', () => {
  it('normalizes a valid product and exposes only known fields', () => {
    const product = mapProduct(rawProduct)

    expect(product).toEqual({
      id: 7,
      title: 'Headphone Nirkabel',
      description: 'Suara jernih.',
      category: 'audio',
      brand: 'Contoh',
      price: 129.99,
      rating: 4.6,
      stock: 12,
      thumbnail: 'https://cdn.example.com/thumb.jpg',
      images: ['https://cdn.example.com/1.jpg', 'https://cdn.example.com/1.jpg'],
    })
    expect(product).not.toHaveProperty('sku')
  })

  it('rejects an item without a usable id', () => {
    expect(mapProduct({ ...rawProduct, id: 0 })).toBeNull()
    expect(mapProduct(null)).toBeNull()
  })

  it('falls back on invalid optional values instead of dropping the product', () => {
    const product = mapProduct({
      id: 8,
      title: '   ',
      category: '',
      price: -1,
      rating: 9,
      stock: 2.5,
      thumbnail: 'data:image/png;base64,abc',
      images: 'not-an-array',
    })

    expect(product).toMatchObject({
      id: 8,
      title: 'Tanpa judul',
      category: 'Lainnya',
      price: 0,
      rating: 0,
      stock: 0,
      thumbnail: null,
      images: [],
    })
  })

  it('throws for an invalid detail payload', () => {
    expect(() => mapProductDetail({ id: 'x' })).toThrow('Detail produk tidak valid.')
  })
})

describe('mapProductsResponse', () => {
  it('keeps valid items and maps pagination meta', () => {
    const result = mapProductsResponse({
      data: [rawProduct, { id: 'invalid' }],
      meta: {
        current_page: '2',
        per_page: '10',
        total: '21',
        last_page: '3',
      },
    })

    expect(result.items).toHaveLength(1)
    expect(result.meta).toEqual({
      currentPage: 2,
      perPage: 10,
      total: 21,
      lastPage: 3,
    })
  })

  it('derives meta when the server omits it', () => {
    const result = mapProductsResponse({ data: [rawProduct] })

    expect(result.meta).toEqual({
      currentPage: 1,
      perPage: 20,
      total: 1,
      lastPage: 1,
    })
  })

  it('throws when the envelope is malformed', () => {
    expect(() => mapProductsResponse({ data: 'nope' })).toThrow('Respons data tidak valid.')
  })
})

describe('mapCategories', () => {
  it('removes duplicates, blanks, and non-string values', () => {
    expect(
      mapCategories({
        data: ['audio', ' audio ', 'laptops', '', null, 42, 'audio'],
      }),
    ).toEqual(['audio', 'laptops'])
  })

  it('throws when the payload is not an envelope', () => {
    expect(() => mapCategories({ data: null })).toThrow('Respons kategori tidak valid.')
  })
})
