import { deepRedact, REDACTED } from './redact'

describe('deepRedact', () => {
  it('passes primitives through unchanged', () => {
    expect(deepRedact('hello')).toBe('hello')
    expect(deepRedact(42)).toBe(42)
    expect(deepRedact(null)).toBeNull()
    expect(deepRedact(undefined)).toBeUndefined()
    expect(deepRedact(true)).toBe(true)
  })

  it('masks top-level sensitive keys, keeps other keys', () => {
    expect(deepRedact({ password: 'p', name: 'n' })).toEqual({ password: REDACTED, name: 'n' })
  })

  it('masks deeply nested sensitive keys', () => {
    expect(deepRedact({ a: { b: { token: 't', other: 'x' } } })).toEqual({ a: { b: { token: REDACTED, other: 'x' } } })
  })

  it('masks inside arrays', () => {
    expect(deepRedact([{ apiKey: 'k' }, { name: 'x' }])).toEqual([{ apiKey: REDACTED }, { name: 'x' }])
  })

  it('matches case-insensitively and common aliases', () => {
    expect(deepRedact({ Password: 'p', API_KEY: 'k', api_key: 'k2', Secret: 's', credentials: 'c', Authorization: 'b' })).toEqual({
      Password: REDACTED,
      API_KEY: REDACTED,
      api_key: REDACTED,
      Secret: REDACTED,
      credentials: REDACTED,
      Authorization: REDACTED,
    })
  })

  it('does not match substrings (e.g. "tokenized" is NOT redacted)', () => {
    expect(deepRedact({ tokenized: 'safe', tokenName: 'safe' })).toEqual({ tokenized: 'safe', tokenName: 'safe' })
  })

  it('does not recurse into class instances (Buffer/Date)', () => {
    const buf = Buffer.from('secret-bytes')
    const date = new Date('2026-01-01T00:00:00Z')
    const result = deepRedact({ buf, date, payload: { token: 't' } }) as { buf: Buffer; date: Date; payload: { token: string } }
    expect(result.buf).toBe(buf)
    expect(result.date).toBe(date)
    expect(result.payload).toEqual({ token: REDACTED })
  })
})
