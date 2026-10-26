import axios, { type InternalAxiosRequestConfig } from 'axios'

export const AUTH_UNAUTHORIZED_EVENT = 'katalog:unauthorized'

type RetryableConfig = InternalAxiosRequestConfig & { _csrfRetried?: boolean }

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

const csrfClient = axios.create({
  baseURL: '/',
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export async function ensureCsrfCookie(): Promise<void> {
  await csrfClient.get('/sanctum/csrf-cookie')
}

function isAuthEndpoint(url: string | undefined): boolean {
  return Boolean(url && (url.includes('/auth/me') || url.includes('/auth/login')))
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }

    const status = error.response?.status
    const config = error.config as RetryableConfig | undefined

    if (status === 419 && config && !config._csrfRetried) {
      config._csrfRetried = true

      try {
        await ensureCsrfCookie()
        return await api.request(config)
      } catch {
        return Promise.reject(error)
      }
    }

    if (status === 401 && !isAuthEndpoint(config?.url)) {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
    }

    return Promise.reject(error)
  },
)
