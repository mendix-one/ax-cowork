import { describe, it, expect } from 'vitest'
import { preprocessMarkdown } from './markdownPreprocess'

describe('preprocessMarkdown', () => {
  it('passes plain markdown through unchanged', () => {
    const md = '# Header\n\nText with **bold** and *italic*.\n\n- item 1\n- item 2\n'
    expect(preprocessMarkdown(md)).toBe(md)
  })

  it('replaces ax-chart fence with data-ax-chart placeholder', () => {
    const md = '```ax-chart\n{"id":"cht-1","option":{}}\n```'
    const out = preprocessMarkdown(md)
    expect(out).toMatch(/^<div data-ax-chart="[^"]+"><\/div>$/)
    expect(out).toContain(encodeURIComponent('{"id":"cht-1","option":{}}'))
  })

  it('replaces ax-table fence with data-ax-table placeholder', () => {
    const md = '```ax-table\n{"id":"tbl-1","columns":[],"data":[]}\n```'
    const out = preprocessMarkdown(md)
    expect(out).toMatch(/^<div data-ax-table="[^"]+"><\/div>$/)
  })

  it('handles multiple ax blocks in one doc, preserving order', () => {
    const md = '# T\n\n```ax-chart\n{"id":"a","option":{}}\n```\n\nmid\n\n```ax-table\n{"id":"b","columns":[{"key":"k","title":"K"}],"data":[]}\n```\n\nend'
    const out = preprocessMarkdown(md)
    const chartIdx = out.indexOf('data-ax-chart')
    const tableIdx = out.indexOf('data-ax-table')
    expect(chartIdx).toBeGreaterThan(-1)
    expect(tableIdx).toBeGreaterThan(chartIdx)
    expect(out).toContain('# T')
    expect(out).toContain('mid')
    expect(out).toContain('end')
  })

  it('leaves non-ax fenced code blocks untouched', () => {
    const md = '```ts\nconst x = 1\n```\n\n```python\nprint("hi")\n```'
    expect(preprocessMarkdown(md)).toBe(md)
  })

  it('does not match similar fence languages (axolotl, ax, ax-foo)', () => {
    const md = '```axolotl\n{"id":"x"}\n```\n\n```ax\nfoo\n```\n\n```ax-foo\nbar\n```'
    expect(preprocessMarkdown(md)).toBe(md)
  })

  it('survives bodies containing quotes, newlines, and unicode', () => {
    const body = '{"id":"x","note":"đây là\\n\\"test\\""}'
    const md = '```ax-chart\n' + body + '\n```'
    const out = preprocessMarkdown(md)
    // URI-encoded body should decode back exactly
    const match = /data-ax-chart="([^"]+)"/.exec(out)
    expect(match).not.toBeNull()
    expect(decodeURIComponent(match![1])).toBe(body)
  })

  it('handles CRLF line endings (Windows-authored markdown)', () => {
    const md = '```ax-chart\r\n{"id":"x","option":{}}\r\n```'
    const out = preprocessMarkdown(md)
    expect(out).toMatch(/data-ax-chart=/)
  })
})
