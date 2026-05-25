import type { SourceField, SourceFieldType, SourceSchema } from '../../adapters'

/** Hard cap on the number of records used to infer the schema. Beyond this, the payload itself remains the source of truth — the schema is metadata, not validation. */
export const WEBHOOK_SCHEMA_SAMPLE_LIMIT = 10

/**
 * Builds a best-effort `SourceSchema` from up to {@link WEBHOOK_SCHEMA_SAMPLE_LIMIT} records of the
 * current payload. Used by `WebhookIngestionService` (T2-B04) because there is no upstream
 * `discoverMetadata` endpoint for webhook sources — we only see the data when it arrives.
 *
 * Field inference rules:
 *   - The set of fields is the union of keys across the sampled records.
 *   - A field's `type` is the first non-null observation in the sample (no widening / coercion).
 *   - `nullable` is set when any sampled record has the field as `null` OR missing.
 *
 * The `raw` block preserves operator-debuggable context: how many records the schema was inferred
 * from, when, and the source label `'webhook-inline'` so `source_metadata` rows are distinguishable
 * from real adapter discovery (REST, Excel, …).
 */
export function inferWebhookSchema(records: ReadonlyArray<Record<string, unknown>>): SourceSchema {
  const sample = records.slice(0, WEBHOOK_SCHEMA_SAMPLE_LIMIT)
  const keys = new Set<string>()
  const types = new Map<string, SourceFieldType>()
  const nullable = new Set<string>()

  for (const rec of sample) {
    const seenKeys = new Set(Object.keys(rec))
    for (const k of seenKeys) keys.add(k)
    for (const k of keys) {
      if (!seenKeys.has(k)) {
        nullable.add(k)
        continue
      }
      const value = rec[k]
      if (value === null) {
        nullable.add(k)
        continue
      }
      if (!types.has(k)) types.set(k, classifyValue(value))
    }
  }

  const fields: SourceField[] = Array.from(keys)
    .sort()
    .map((name) => {
      const field: SourceField = { name, type: types.get(name) ?? 'unknown' }
      if (nullable.has(name)) field.nullable = true
      return field
    })

  return {
    fields,
    raw: {
      source: 'webhook-inline',
      sampleSize: sample.length,
      totalRecords: records.length,
      sampledAt: new Date().toISOString(),
    },
  }
}

function classifyValue(value: unknown): SourceFieldType {
  if (typeof value === 'string') return 'string'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number'
  if (value instanceof Date) return 'date'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return 'unknown'
}
