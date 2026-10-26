export function safeRedirectTarget(value: unknown, fallback = '/products'): string {
  if (typeof value !== 'string') {
    return fallback
  }

  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/login')) {
    return fallback
  }

  return value
}
