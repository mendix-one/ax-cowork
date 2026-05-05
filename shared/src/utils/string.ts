export function capitalize(value: string): string {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function isBlank(value: string | null | undefined): boolean {
  return value == null || value.trim().length === 0
}

export function truncate(value: string, max: number, suffix = '…'): string {
  if (value.length <= max) return value
  return value.slice(0, Math.max(0, max - suffix.length)) + suffix
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
