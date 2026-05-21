import type { AdapterRecord } from '../adapters'
import type { JobConfigIdentity } from '../domain/job-config'
import { computeRecordKey, stableStringify } from './compute-record-key'

function rec(payload: Record<string, unknown>, sourceInfo?: AdapterRecord['sourceInfo']): AdapterRecord {
  return { payload, sourceInfo }
}

describe('computeRecordKey — primary-key', () => {
  const identity: JobConfigIdentity = { strategy: 'primary-key', fields: ['id'] }

  it('returns the string form of the PK field value', () => {
    expect(computeRecordKey({ identity, record: rec({ id: 42, name: 'Alice' }) })).toBe('42')
  })

  it('coerces number and string to the same key (silent merge — caller is responsible for logging warn)', () => {
    const a = computeRecordKey({ identity, record: rec({ id: 42 }) })
    const b = computeRecordKey({ identity, record: rec({ id: '42' }) })
    expect(a).toBe(b)
  })

  it('serializes Date to ISO string', () => {
    const date = new Date('2026-01-15T10:00:00Z')
    expect(computeRecordKey({ identity: { ...identity, fields: ['createdAt'] }, record: rec({ createdAt: date }) })).toBe(date.toISOString())
  })

  it('throws on null PK value', () => {
    expect(() => computeRecordKey({ identity, record: rec({ id: null }) })).toThrow(/null\/undefined/)
  })

  it('throws on missing PK field', () => {
    expect(() => computeRecordKey({ identity, record: rec({}) })).toThrow(/null\/undefined/)
  })
})

describe('computeRecordKey — composite', () => {
  const identity: JobConfigIdentity = { strategy: 'composite', fields: ['orgId', 'userId'] }

  it('joins fields with the || delimiter in declared order', () => {
    expect(computeRecordKey({ identity, record: rec({ orgId: 'org1', userId: 'user2', other: 'ignored' }) })).toBe('org1||user2')
  })

  it('escapes || in field values to avoid collision (P002 §9.1 caveat)', () => {
    const k1 = computeRecordKey({ identity: { strategy: 'composite', fields: ['a', 'b'] }, record: rec({ a: 'X||Y', b: '' }) })
    const k2 = computeRecordKey({ identity: { strategy: 'composite', fields: ['a', 'b'] }, record: rec({ a: 'X', b: 'Y||' }) })
    expect(k1).not.toBe(k2)
  })

  it('maps null / undefined / missing field to empty string', () => {
    expect(
      computeRecordKey({
        identity: { strategy: 'composite', fields: ['a', 'b', 'c'] },
        record: rec({ a: null, c: 'x' }), // b missing → undefined
      }),
    ).toBe('||||x')
  })

  it('field order in the identity changes the key', () => {
    const ab = computeRecordKey({ identity: { strategy: 'composite', fields: ['a', 'b'] }, record: rec({ a: 'x', b: 'y' }) })
    const ba = computeRecordKey({ identity: { strategy: 'composite', fields: ['b', 'a'] }, record: rec({ a: 'x', b: 'y' }) })
    expect(ab).not.toBe(ba)
  })

  it('all-null payload still produces a deterministic key of pure delimiters', () => {
    expect(computeRecordKey({ identity: { strategy: 'composite', fields: ['a', 'b', 'c'] }, record: rec({}) })).toBe('||||')
  })

  it('serializes Date field values as ISO strings (pinned behaviour — change with care)', () => {
    const date = new Date('2026-01-01T00:00:00Z')
    expect(
      computeRecordKey({
        identity: { strategy: 'composite', fields: ['org', 'createdAt'] },
        record: rec({ org: 'a', createdAt: date }),
      }),
    ).toBe(`a||${date.toISOString()}`)
  })

  it('serializes object field values via stableStringify (deterministic across insertion order)', () => {
    const k1 = computeRecordKey({
      identity: { strategy: 'composite', fields: ['scope', 'tag'] },
      record: rec({ scope: { a: 1, b: 2 }, tag: 't' }),
    })
    const k2 = computeRecordKey({
      identity: { strategy: 'composite', fields: ['scope', 'tag'] },
      record: rec({ scope: { b: 2, a: 1 }, tag: 't' }),
    })
    expect(k1).toBe(k2)
    expect(k1).toBe('{"a":1,"b":2}||t')
  })
})

describe('computeRecordKey — hash', () => {
  const identity: JobConfigIdentity = { strategy: 'hash', fields: [], acknowledgeHashSemantics: true }

  it('produces a 64-char sha256 hex string', () => {
    expect(computeRecordKey({ identity, record: rec({ x: 1 }) })).toMatch(/^[a-f0-9]{64}$/)
  })

  it('is deterministic across payload key insertion order', () => {
    const a = computeRecordKey({ identity, record: rec({ a: 1, b: 2, c: 3 }) })
    const b = computeRecordKey({ identity, record: rec({ c: 3, a: 1, b: 2 }) })
    expect(a).toBe(b)
  })

  it('produces different keys for different payload contents', () => {
    const a = computeRecordKey({ identity, record: rec({ id: 1 }) })
    const b = computeRecordKey({ identity, record: rec({ id: 2 }) })
    expect(a).not.toBe(b)
  })
})

describe('computeRecordKey — row-number', () => {
  const identity: JobConfigIdentity = { strategy: 'row-number', fields: [] }

  it('formats as `sourceFileId:rowNumber`', () => {
    expect(computeRecordKey({ identity, record: rec({}, { rowNumber: 7 }), sourceFileId: 'abc123' })).toBe('abc123:7')
  })

  it('throws when sourceFileId is missing', () => {
    expect(() => computeRecordKey({ identity, record: rec({}, { rowNumber: 1 }) })).toThrow(/sourceFileId/)
  })

  it('throws when sourceInfo.rowNumber is missing or non-numeric', () => {
    expect(() => computeRecordKey({ identity, record: rec({}), sourceFileId: 'abc' })).toThrow(/rowNumber/)
    expect(() =>
      computeRecordKey({
        identity,
        record: rec({}, { rowNumber: 'three' as unknown as number }),
        sourceFileId: 'abc',
      }),
    ).toThrow(/rowNumber/)
  })
})

describe('stableStringify', () => {
  it('sorts object keys alphabetically (top-level)', () => {
    expect(stableStringify({ b: 2, a: 1 })).toBe(stableStringify({ a: 1, b: 2 }))
  })

  it('sorts nested object keys', () => {
    expect(stableStringify({ outer: { z: 1, a: 2 } })).toBe('{"outer":{"a":2,"z":1}}')
  })

  it('preserves array element order', () => {
    expect(stableStringify([3, 1, 2])).toBe('[3,1,2]')
  })

  it('handles primitives unchanged', () => {
    expect(stableStringify('hello')).toBe('"hello"')
    expect(stableStringify(42)).toBe('42')
    expect(stableStringify(null)).toBe('null')
    expect(stableStringify(true)).toBe('true')
  })

  it('does not recurse into class instances (Date → ISO string via JSON.stringify)', () => {
    const date = new Date('2026-01-01T00:00:00Z')
    expect(stableStringify({ d: date })).toBe('{"d":"2026-01-01T00:00:00.000Z"}')
  })

  it('sorts object keys recursively inside array elements', () => {
    // Critical: hash strategy hashes the full payload — if a nested array of objects didn't
    // get its keys sorted, two equivalent payloads with different insertion order would hash
    // differently and we'd lose dedup.
    const a = stableStringify({
      items: [
        { z: 1, a: 2 },
        { y: 3, b: 4 },
      ],
    })
    const b = stableStringify({
      items: [
        { a: 2, z: 1 },
        { b: 4, y: 3 },
      ],
    })
    expect(a).toBe(b)
    expect(a).toBe('{"items":[{"a":2,"z":1},{"b":4,"y":3}]}')
  })

  it('omits undefined-valued keys (matches JSON.stringify) — payloads with undefined collide', () => {
    // Pinning down current behaviour: {a:1, b:undefined} and {a:1} stringify identically.
    // The hash strategy will treat them as the same record. If we ever want to surface
    // undefined explicitly (e.g. as null), update the test and the docs together.
    expect(stableStringify({ a: 1, b: undefined })).toBe('{"a":1}')
    expect(stableStringify({ a: 1, b: undefined })).toBe(stableStringify({ a: 1 }))
  })
})
