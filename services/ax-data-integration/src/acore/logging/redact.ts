export const REDACTED = '[REDACTED]' as const

// Field names whose values must never appear in logs. Case-insensitive match against
// the FULL key name (not a substring) to avoid collateral redaction of legitimate keys.
export const SENSITIVE_KEY_PATTERN = /^(password|pwd|token|api[-_]?key|secret|credentials?|authorization)$/i

/**
 * Recursively walks a value and replaces the value of any key matching SENSITIVE_KEY_PATTERN
 * with the REDACTED marker. Plain objects and arrays are recursed; class instances
 * (Buffer, Date, Error, Map, Set, …) are returned as-is to avoid breaking their semantics.
 */
export function deepRedact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(deepRedact)
  if (value !== null && typeof value === 'object') {
    const proto: object | null = Object.getPrototypeOf(value) as object | null
    if (proto !== Object.prototype && proto !== null) return value
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEY_PATTERN.test(k) ? REDACTED : deepRedact(v)
    }
    return out
  }
  return value
}
