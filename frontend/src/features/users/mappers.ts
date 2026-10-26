import { z } from 'zod'

import { logInvalidItem, mapPaginated, type Paginated } from '@/lib/paginated'
import { safeImageUrl } from '@/lib/images'
import type { AppUser } from '@/features/users/types'

const userSchema = z.object({
  id: z.number().int().positive(),
  first_name: z.string().trim().catch(''),
  last_name: z.string().trim().catch(''),
  full_name: z
    .string()
    .nullish()
    .transform((value) => value?.trim() ?? '')
    .catch(''),
  email: z.string().trim().catch(''),
  phone: z.string().trim().catch(''),
  avatar: z
    .string()
    .nullish()
    .transform((value) => safeImageUrl(value))
    .catch(null),
  company_name: z.string().trim().catch(''),
  city: z.string().trim().catch(''),
})

export function mapUser(raw: unknown): AppUser | null {
  const parsed = userSchema.safeParse(raw)

  if (!parsed.success) {
    logInvalidItem('users', raw, parsed.error.issues[0]?.message)
    return null
  }

  const data = parsed.data
  const fullName = data.full_name || `${data.first_name} ${data.last_name}`.trim() || 'Tanpa nama'

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    fullName,
    email: data.email,
    phone: data.phone,
    avatar: data.avatar,
    companyName: data.company_name,
    city: data.city,
  }
}

export function mapUserDetail(raw: unknown): AppUser {
  const user = mapUser(raw)

  if (!user) {
    throw new Error('Detail pengguna tidak valid.')
  }

  return user
}

export function mapUsersResponse(raw: unknown): Paginated<AppUser> {
  return mapPaginated(raw, mapUser, 'users')
}
