import { describe, expect, it } from 'vitest'

import { mapUser, mapUserDetail, mapUsersResponse } from '@/features/users/mappers'

const rawUser = {
  id: 3,
  first_name: '  Siti ',
  last_name: ' Rahma ',
  full_name: null,
  email: 'siti@example.com',
  phone: '+62 812 0000',
  avatar: 'https://cdn.example.com/avatar.png',
  company_name: 'Contoh Co',
  city: 'Bandung',
  password: 'SHOULD-NOT-LEAK',
}

describe('mapUser', () => {
  it('maps the API fields to the app shape', () => {
    const user = mapUser(rawUser)

    expect(user).toEqual({
      id: 3,
      firstName: 'Siti',
      lastName: 'Rahma',
      fullName: 'Siti Rahma',
      email: 'siti@example.com',
      phone: '+62 812 0000',
      avatar: 'https://cdn.example.com/avatar.png',
      companyName: 'Contoh Co',
      city: 'Bandung',
    })
    expect(user).not.toHaveProperty('password')
  })

  it('prefers a provided full name', () => {
    expect(mapUser({ ...rawUser, full_name: ' Siti R. ' })?.fullName).toBe('Siti R.')
  })

  it('uses a safe fallback name and rejects a non-http avatar', () => {
    const user = mapUser({
      ...rawUser,
      first_name: '',
      last_name: '',
      full_name: '',
      avatar: 'javascript:alert(1)',
    })

    expect(user?.fullName).toBe('Tanpa nama')
    expect(user?.avatar).toBeNull()
  })

  it('rejects an item without a usable id', () => {
    expect(mapUser({ ...rawUser, id: -1 })).toBeNull()
  })

  it('throws for an invalid detail payload', () => {
    expect(() => mapUserDetail({})).toThrow('Detail pengguna tidak valid.')
  })
})

describe('mapUsersResponse', () => {
  it('filters invalid rows and keeps the pagination meta', () => {
    const result = mapUsersResponse({
      data: [rawUser, { id: 'invalid' }],
      meta: {
        current_page: 1,
        per_page: 20,
        total: 2,
        last_page: 1,
      },
    })

    expect(result.items).toHaveLength(1)
    expect(result.items[0]?.fullName).toBe('Siti Rahma')
    expect(result.meta.total).toBe(2)
  })
})
