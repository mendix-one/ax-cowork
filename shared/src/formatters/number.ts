export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}, locale?: string): string {
  return new Intl.NumberFormat(locale, options).format(value)
}

export function formatPercent(value: number, decimals = 0, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatCompact(value: number, locale?: string): string {
  return new Intl.NumberFormat(locale, { notation: 'compact' }).format(value)
}
