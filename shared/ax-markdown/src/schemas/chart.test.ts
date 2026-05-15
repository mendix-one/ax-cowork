import { describe, it, expect } from 'vitest'
import { ChartBlockSchema } from './chart'

describe('ChartBlockSchema', () => {
  it('parses a minimal valid block', () => {
    const result = ChartBlockSchema.safeParse({
      id: 'cht-1',
      option: { series: [] },
    })
    expect(result.success).toBe(true)
  })

  it('accepts optional v: 1', () => {
    const result = ChartBlockSchema.safeParse({
      v: 1,
      id: 'cht-1',
      option: {},
    })
    expect(result.success).toBe(true)
  })

  it('rejects when id is missing (AI hallucinated structure)', () => {
    const result = ChartBlockSchema.safeParse({ option: {} })
    expect(result.success).toBe(false)
  })

  it('rejects when id is empty string', () => {
    const result = ChartBlockSchema.safeParse({ id: '', option: {} })
    expect(result.success).toBe(false)
  })

  it('rejects when option is missing', () => {
    const result = ChartBlockSchema.safeParse({ id: 'x' })
    expect(result.success).toBe(false)
  })

  it('rejects when option is a primitive instead of an object', () => {
    const result = ChartBlockSchema.safeParse({ id: 'x', option: 'oops' })
    expect(result.success).toBe(false)
  })

  it('rejects when option is null', () => {
    const result = ChartBlockSchema.safeParse({ id: 'x', option: null })
    expect(result.success).toBe(false)
  })
})
