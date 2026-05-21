import { createHash } from 'crypto'

import type { AdapterRecord } from '../adapters'
import type { JobConfigIdentity } from '../domain/job-config'

const COMPOSITE_DELIMITER = '||'
const ESCAPED_DELIMITER = '\\|\\|'

export interface ComputeRecordKeyInput {
  identity: JobConfigIdentity
  record: AdapterRecord
  /** Required only for `strategy='row-number'`. Hex string of the source_files `_id`. */
  sourceFileId?: string
}

/**
 * Derives the per-source `recordKey` from one adapter-emitted record according to
 * `identity.strategy`. Per-strategy caveats are documented in P002 §9.1 and enforced
 * upstream by `validateJobConfigIdentity` (T-C04); this function assumes a valid identity
 * but still defends against runtime inputs that cannot produce a usable key
 * (null PK value, missing row-number metadata, etc.).
 */
export function computeRecordKey({ identity, record, sourceFileId }: ComputeRecordKeyInput): string {
  switch (identity.strategy) {
    case 'primary-key': {
      const field = identity.fields[0]
      const value = record.payload[field]
      if (value === null || value === undefined) {
        throw new Error(`primary-key field "${field}" is null/undefined`)
      }
      return primitiveToString(value)
    }
    case 'composite':
      return identity.fields.map((f) => escapeCompositeValue(record.payload[f])).join(COMPOSITE_DELIMITER)
    case 'hash':
      return createHash('sha256').update(stableStringify(record.payload)).digest('hex')
    case 'row-number': {
      if (!sourceFileId) {
        throw new Error('row-number strategy requires sourceFileId')
      }
      const rowNumber = record.sourceInfo?.rowNumber
      if (typeof rowNumber !== 'number') {
        throw new Error('row-number strategy requires record.sourceInfo.rowNumber to be a number')
      }
      return `${sourceFileId}:${rowNumber}`
    }
  }
}

function escapeCompositeValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  return primitiveToString(value).replaceAll(COMPOSITE_DELIMITER, ESCAPED_DELIMITER)
}

function primitiveToString(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value)
  if (value instanceof Date) return value.toISOString()
  // For object/array — fall back to deterministic JSON.
  return stableStringify(value)
}

/**
 * `JSON.stringify` with sorted object keys, so the output for a given JS value is
 * deterministic regardless of property insertion order. Used by the `hash` strategy
 * (and reused by the sync executor when computing `payloadHash`).
 *
 * Behavior:
 * - Arrays: order is preserved (arrays carry positional meaning).
 * - Plain objects: keys are sorted alphabetically, recursively.
 * - Class instances (Buffer / Date / Map / Set / etc.): passed through to JSON.stringify
 *   as-is, so a Date becomes its ISO string and exotic objects get their JSON serialization.
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value))
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue)
  if (value !== null && typeof value === 'object') {
    const proto: object | null = Object.getPrototypeOf(value) as object | null
    if (proto !== Object.prototype && proto !== null) return value
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortValue((value as Record<string, unknown>)[key])
    }
    return sorted
  }
  return value
}
