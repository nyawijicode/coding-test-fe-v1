import axios from 'axios'

type ApiErrorBody = {
  message?: string
  errors?: Record<string, string[] | string>
}

export function getApiErrorBody(error: unknown): ApiErrorBody | null {
  if (!axios.isAxiosError(error)) {
    return null
  }

  const data: unknown = error.response?.data

  if (typeof data !== 'object' || data === null) {
    return null
  }

  return data as ApiErrorBody
}

export function getErrorStatus(error: unknown): number | null {
  return axios.isAxiosError(error) ? (error.response?.status ?? null) : null
}

export function getRetryAfterSeconds(error: unknown, fallback = 60): number {
  if (!axios.isAxiosError(error)) {
    return fallback
  }

  const header = error.response?.headers['retry-after']
  const raw = Array.isArray(header) ? header[0] : header

  if (!raw) {
    return fallback
  }

  const seconds = Number.parseInt(String(raw), 10)

  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds
  }

  const date = Date.parse(String(raw))

  if (Number.isNaN(date)) {
    return fallback
  }

  return Math.max(0, Math.ceil((date - Date.now()) / 1000))
}

export function getFieldErrors(error: unknown): Record<string, string> {
  const body = getApiErrorBody(error)

  if (!body?.errors) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(body.errors).flatMap(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : messages
      return message ? [[field, message]] : []
    }),
  )
}

export function getErrorMessage(error: unknown, fallback: string): string {
  const message = getApiErrorBody(error)?.message
  return message?.trim() ? message : fallback
}

export function isNotFoundError(error: unknown): boolean {
  return getErrorStatus(error) === 404
}
