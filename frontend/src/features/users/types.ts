import type { PerPage } from '@/lib/query-params'

export type AppUser = {
  id: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  avatar: string | null
  companyName: string
  city: string
}

export type UserFilters = {
  q: string
  page: number
  perPage: PerPage
}
