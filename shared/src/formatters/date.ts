export function formatDate(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
}

export function formatDateTime(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatTime(date: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(date)
}

const RELATIVE_UNITS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 31_536_000_000],
  ['month', 2_628_000_000],
  ['week', 604_800_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
  ['second', 1000],
]

export function formatRelative(date: Date, base: Date = new Date(), locale?: string): string {
  const diff = date.getTime() - base.getTime()
  const fmt = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms || unit === 'second') {
      return fmt.format(Math.round(diff / ms), unit)
    }
  }
  return fmt.format(0, 'second')
}
