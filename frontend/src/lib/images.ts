const HTTP_IMAGE = /^https?:\/\//i

export function safeImageUrl(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  if (!HTTP_IMAGE.test(trimmed)) {
    return null
  }

  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}
