import { describe, it, expect } from 'vitest'
import { TableBlockSchema } from './table'

const aCol = (key = 'a', title = 'A') => ({ key, title })

describe('TableBlockSchema', () => {
  it('parses a minimal valid block', () => {
    const result = TableBlockSchema.safeParse({
      id: 'tbl-1',
      columns: [aCol()],
      data: [],
    })
    expect(result.success).toBe(true)
  })

  it('accepts column.kind = number and sortable = true', () => {
    const result = TableBlockSchema.safeParse({
      id: 'tbl-1',
      columns: [{ key: 'n', title: 'N', kind: 'number', sortable: true }],
      data: [{ n: 1 }],
    })
    expect(result.success).toBe(true)
  })

  it('rejects when columns is empty', () => {
    const result = TableBlockSchema.safeParse({ id: 'x', columns: [], data: [] })
    expect(result.success).toBe(false)
  })

  it('rejects when columns exceeds the 50-cap', () => {
    const cols = Array.from({ length: 51 }, (_, i) => aCol(`c${i}`, `C${i}`))
    const result = TableBlockSchema.safeParse({ id: 'x', columns: cols, data: [] })
    expect(result.success).toBe(false)
  })

  it('rejects when data exceeds the 5000-row cap', () => {
    const data = Array.from({ length: 5001 }, (_, i) => ({ a: i }))
    const result = TableBlockSchema.safeParse({ id: 'x', columns: [aCol()], data })
    expect(result.success).toBe(false)
  })

  it('rejects when column.key is empty', () => {
    const result = TableBlockSchema.safeParse({
      id: 'x',
      columns: [{ key: '', title: 'A' }],
      data: [],
    })
    expect(result.success).toBe(false)
  })

  it('rejects when column.kind is not in the allowed enum', () => {
    const result = TableBlockSchema.safeParse({
      id: 'x',
      columns: [{ key: 'a', title: 'A', kind: 'bool' }],
      data: [],
    })
    expect(result.success).toBe(false)
  })

  it('rejects when id is missing', () => {
    const result = TableBlockSchema.safeParse({ columns: [aCol()], data: [] })
    expect(result.success).toBe(false)
  })

  it('rejects when data is not an array', () => {
    const result = TableBlockSchema.safeParse({ id: 'x', columns: [aCol()], data: 'oops' })
    expect(result.success).toBe(false)
  })
})
