export function stringToDate(value: string): Date | null {
  const t = Date.parse(value)
  return Number.isNaN(t) ? null : new Date(t)
}

export function timestampToDate(ms: number): Date {
  return new Date(ms)
}
