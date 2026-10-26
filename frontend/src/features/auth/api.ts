import { api, ensureCsrfCookie } from '@/lib/api'
import { authUserSchema, type LoginInput } from '@/features/auth/schemas'
import type { AuthUser } from '@/features/auth/types'

function parseAuthUser(raw: unknown): AuthUser {
  const parsed = authUserSchema.safeParse(raw)

  if (!parsed.success) {
    throw new Error('Respons autentikasi tidak valid.')
  }

  return parsed.data
}

export async function login(input: LoginInput): Promise<AuthUser> {
  // Establish the session + XSRF cookie before the stateful login request.
  await ensureCsrfCookie()

  const response = await api.post<{ data: unknown }>('/auth/login', input)

  return parseAuthUser(response.data.data)
}

export async function fetchSession(): Promise<AuthUser> {
  const response = await api.get<{ data: unknown }>('/auth/me')

  return parseAuthUser(response.data.data)
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
