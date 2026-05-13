import { describe, it, expect } from 'vitest'
import { readJson, writeJson } from './local'

type Foo = { id: string; n: number }
const isFoo = (v: unknown): v is Foo => typeof v === 'object' && v !== null && typeof (v as Foo).id === 'string' && typeof (v as Foo).n === 'number'

describe('storage/local', () => {
  describe('readJson', () => {
    it('returns null when key is missing', () => {
      expect(readJson('missing', isFoo)).toBeNull()
    })

    it('returns parsed value when JSON is valid and passes guard', () => {
      localStorage.setItem('foo', JSON.stringify({ id: 'a', n: 1 }))
      expect(readJson('foo', isFoo)).toEqual({ id: 'a', n: 1 })
    })

    it('returns null when JSON is corrupted', () => {
      localStorage.setItem('foo', '{not valid json')
      expect(readJson('foo', isFoo)).toBeNull()
    })

    it('returns null when shape does not pass guard', () => {
      localStorage.setItem('foo', JSON.stringify({ id: 'a', n: 'not a number' }))
      expect(readJson('foo', isFoo)).toBeNull()
    })
  })

  describe('writeJson', () => {
    it('persists value as JSON string', () => {
      writeJson('foo', { id: 'b', n: 2 })
      expect(localStorage.getItem('foo')).toBe('{"id":"b","n":2}')
    })

    it('removes key when value is null', () => {
      localStorage.setItem('foo', '"existing"')
      writeJson('foo', null)
      expect(localStorage.getItem('foo')).toBeNull()
    })
  })
})
