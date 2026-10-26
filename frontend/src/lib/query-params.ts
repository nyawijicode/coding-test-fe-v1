export const PER_PAGE_OPTIONS = [10, 20, 50] as const

export type PerPage = (typeof PER_PAGE_OPTIONS)[number]

export const DEFAULT_PER_PAGE: PerPage = 20

export function parsePositiveInt(value: string | null, fallback: number): number {
  if (value === null || value.trim() === '') {
    return fallback
  }

  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback
  }

  return parsed
}

export function parsePerPage(value: string | null): PerPage {
  const parsed = Number(value)

  return (PER_PAGE_OPTIONS as readonly number[]).includes(parsed)
    ? (parsed as PerPage)
    : DEFAULT_PER_PAGE
}

export function normalizeSearchTerm(value: string | null): string {
  return value?.trim() ?? ''
}
