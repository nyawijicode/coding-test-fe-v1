const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('id-ID')

const compactNumberFormatter = new Intl.NumberFormat('id-ID', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** DummyJSON menyajikan harga dalam USD, jadi format mata uang dikunci ke USD. */
export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) {
    return '—'
  }

  return currencyFormatter.format(value)
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '—'
  }

  return numberFormatter.format(value)
}

export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '—'
  }

  return compactNumberFormatter.format(value)
}

export function formatRating(value: number): string {
  if (!Number.isFinite(value)) {
    return '—'
  }

  return value.toFixed(1)
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) {
    return '—'
  }

  return `${Math.round(value)}%`
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)

  if (parts.length === 0) {
    return '?'
  }

  return parts.map((part) => part.charAt(0).toUpperCase()).join('')
}

export function formatPhone(phone: string): string {
  const trimmed = phone.trim()
  return trimmed.length > 0 ? trimmed : '—'
}
