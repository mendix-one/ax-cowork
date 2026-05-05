export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function roundTo(value: number, decimals = 0): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export function sum(values: readonly number[]): number {
  let total = 0
  for (const n of values) total += n
  return total
}

export function mean(values: readonly number[]): number {
  if (values.length === 0) return 0
  return sum(values) / values.length
}

export function range(start: number, end: number, step = 1): number[] {
  if (step === 0) throw new Error('range: step cannot be 0')
  const out: number[] = []
  if (step > 0) {
    for (let i = start; i < end; i += step) out.push(i)
  } else {
    for (let i = start; i > end; i += step) out.push(i)
  }
  return out
}
