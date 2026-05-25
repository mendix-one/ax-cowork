import { WEBHOOK_SCHEMA_SAMPLE_LIMIT, inferWebhookSchema } from './webhook-schema.infer'

describe('inferWebhookSchema', () => {
  it('infers a flat object with string/integer/number/boolean fields', () => {
    const schema = inferWebhookSchema([{ name: 'a', count: 3, ratio: 0.5, active: true }])
    expect(schema.fields).toEqual([
      { name: 'active', type: 'boolean' },
      { name: 'count', type: 'integer' },
      { name: 'name', type: 'string' },
      { name: 'ratio', type: 'number' },
    ])
    expect(schema.raw).toMatchObject({ source: 'webhook-inline', sampleSize: 1, totalRecords: 1 })
    expect(typeof schema.raw.sampledAt).toBe('string')
  })

  it('classifies array, object, and Date values distinctly', () => {
    const schema = inferWebhookSchema([{ tags: ['x'], meta: { k: 1 }, at: new Date() }])
    expect(schema.fields.find((f) => f.name === 'tags')?.type).toBe('array')
    expect(schema.fields.find((f) => f.name === 'meta')?.type).toBe('object')
    expect(schema.fields.find((f) => f.name === 'at')?.type).toBe('date')
  })

  it('marks a field nullable when ANY sample record sees null', () => {
    const schema = inferWebhookSchema([
      { id: 1, label: 'a' },
      { id: 2, label: null },
    ])
    expect(schema.fields.find((f) => f.name === 'id')).toEqual({ name: 'id', type: 'integer' })
    expect(schema.fields.find((f) => f.name === 'label')).toEqual({ name: 'label', type: 'string', nullable: true })
  })

  it('marks a field nullable when it is missing in some records', () => {
    const schema = inferWebhookSchema([{ id: 1, ext: 'optional' }, { id: 2 }])
    expect(schema.fields.find((f) => f.name === 'ext')?.nullable).toBe(true)
  })

  it('first non-null observation wins — does not widen to "unknown" when later records contradict', () => {
    const schema = inferWebhookSchema([{ v: 'string-first' }, { v: 99 }])
    expect(schema.fields.find((f) => f.name === 'v')?.type).toBe('string')
  })

  it(`samples at most ${WEBHOOK_SCHEMA_SAMPLE_LIMIT} records but reports the full total`, () => {
    const records = Array.from({ length: 50 }, (_, i) => ({ id: i }))
    const schema = inferWebhookSchema(records)
    expect(schema.raw.sampleSize).toBe(WEBHOOK_SCHEMA_SAMPLE_LIMIT)
    expect(schema.raw.totalRecords).toBe(50)
  })

  it('returns an empty fields array when given an empty input', () => {
    const schema = inferWebhookSchema([])
    expect(schema.fields).toEqual([])
    expect(schema.raw.sampleSize).toBe(0)
    expect(schema.raw.totalRecords).toBe(0)
  })

  it('sorts fields alphabetically for stable hashes across runs', () => {
    const a = inferWebhookSchema([{ zeta: 1, alpha: 2, mu: 3 }])
    const b = inferWebhookSchema([{ mu: 3, alpha: 2, zeta: 1 }])
    expect(a.fields.map((f) => f.name)).toEqual(b.fields.map((f) => f.name))
  })
})
