import { describe, it, expect } from 'vitest'
import { findBlock, replaceBlock } from './source-ops'

const SAMPLE = `# Header

Intro paragraph.

\`\`\`ax-chart
{"id":"cht-1","option":{"a":1}}
\`\`\`

Middle text.

\`\`\`ax-table
{"id":"tbl-1","columns":[{"key":"a","title":"A"}],"data":[]}
\`\`\`

End text.
`

describe('findBlock', () => {
  it('finds a chart block by id', () => {
    const block = findBlock(SAMPLE, 'cht-1')
    expect(block).not.toBeNull()
    expect(block!.kind).toBe('chart')
    expect(block!.tag).toBe('ax-chart')
    expect(block!.body).toContain('"option"')
  })

  it('finds a table block by id', () => {
    const block = findBlock(SAMPLE, 'tbl-1')
    expect(block).not.toBeNull()
    expect(block!.kind).toBe('table')
    expect(block!.tag).toBe('ax-table')
  })

  it('returns null when the id is not present', () => {
    expect(findBlock(SAMPLE, 'nope')).toBeNull()
  })

  it('skips blocks with invalid JSON instead of throwing', () => {
    const md = '```ax-chart\n{not valid json}\n```\n\n```ax-chart\n{"id":"good","option":{}}\n```'
    const block = findBlock(md, 'good')
    expect(block).not.toBeNull()
  })

  it('ignores non-ax fenced blocks even if they mention the id', () => {
    const md = '```js\nconst id = "cht-1"\n```\n'
    expect(findBlock(md, 'cht-1')).toBeNull()
  })
})

describe('replaceBlock', () => {
  it('replaces the matched block body and preserves surrounding markdown', () => {
    const newBody = '{"id":"cht-1","option":{"b":42}}'
    const result = replaceBlock(SAMPLE, 'cht-1', newBody)
    expect(result).not.toBeNull()
    expect(result).toContain('# Header')
    expect(result).toContain('Intro paragraph.')
    expect(result).toContain('Middle text.')
    expect(result).toContain('End text.')
    expect(result).toContain('"b":42')
    expect(result).not.toContain('"a":1')
  })

  it('leaves other blocks untouched', () => {
    const result = replaceBlock(SAMPLE, 'cht-1', '{"id":"cht-1","option":{}}')
    expect(result).toContain('"id":"tbl-1"')
  })

  it('returns null when the id is not found', () => {
    expect(replaceBlock(SAMPLE, 'nope', '{}')).toBeNull()
  })

  it('round-trips: replace then findBlock sees the new body', () => {
    const updated = replaceBlock(SAMPLE, 'cht-1', '{"id":"cht-1","option":{"x":99}}')
    expect(updated).not.toBeNull()
    const refound = findBlock(updated!, 'cht-1')
    expect(refound!.body).toContain('"x":99')
  })

  it('preserves the original fence tag (chart stays chart)', () => {
    const updated = replaceBlock(SAMPLE, 'cht-1', '{"id":"cht-1","option":{}}')
    expect(updated).toContain('```ax-chart')
    // Sanity: count of each fence tag should still match input.
    expect(updated!.match(/```ax-chart/g)!.length).toBe(1)
    expect(updated!.match(/```ax-table/g)!.length).toBe(1)
  })
})
