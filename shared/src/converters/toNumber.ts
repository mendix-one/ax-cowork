export function stringToNumber(value: string | null | undefined): number | null {
  if (value == null) return null
  const cleaned = value.replace(/[^\d.\-+eE]/g, '')
  if (cleaned === '' || cleaned === '-' || cleaned === '+') return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

export function stringToInt(value: string | null | undefined, radix = 10): number | null {
  if (value == null) return null
  const n = parseInt(value.trim(), radix)
  return Number.isNaN(n) ? null : n
}
