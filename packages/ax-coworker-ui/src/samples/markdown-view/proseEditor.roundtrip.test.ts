import { describe, it, expect, beforeAll } from 'vitest'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import { AxChartBlockExtension } from './AxChartBlockExtension'
import { AxTableBlockExtension } from './AxTableBlockExtension'
import { preprocessMarkdown } from './markdownPreprocess'

// jsdom doesn't implement canvas getContext — ECharts (rendered inside
// AxChartNodeView) calls it on mount. Stub before any editor instantiation so
// the React node view doesn't blow up during EditorView creation.
beforeAll(() => {
  if (typeof HTMLCanvasElement !== 'undefined' && !HTMLCanvasElement.prototype.getContext) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: () => null,
      writable: true,
    })
  }
})

function mountEditor(md: string): Editor {
  const element = document.createElement('div')
  return new Editor({
    element,
    extensions: [StarterKit, Markdown.configure({ html: true, breaks: false, tightLists: true, linkify: false }), AxChartBlockExtension, AxTableBlockExtension],
    content: preprocessMarkdown(md),
  })
}

function getMarkdown(editor: Editor): string {
  return (editor.storage.markdown as { getMarkdown: () => string }).getMarkdown()
}

// Compare markdown ignoring trailing whitespace per line + final newline.
// tiptap-markdown's serializer normalizes some things (e.g. trailing newlines).
function normalize(s: string): string {
  return s
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n+$/, '')
}

describe('ProseEditor round-trip', () => {
  it('passes plain markdown through unchanged', () => {
    const md = '# Title\n\nThis is a paragraph with **bold** and *italic*.\n\n- item 1\n- item 2'
    const editor = mountEditor(md)
    expect(normalize(getMarkdown(editor))).toBe(normalize(md))
    editor.destroy()
  })

  it('preserves an ax-chart block verbatim', () => {
    const body = '{\n  "id": "cht-1",\n  "option": {\n    "series": []\n  }\n}'
    const md = '# T\n\n```ax-chart\n' + body + '\n```\n\nafter'
    const editor = mountEditor(md)
    const out = getMarkdown(editor)
    expect(out).toContain('```ax-chart')
    expect(out).toContain('"id": "cht-1"')
    expect(out).toContain('after')
    editor.destroy()
  })

  it('preserves an ax-table block verbatim', () => {
    const body = '{"id":"tbl-1","columns":[{"key":"a","title":"A"}],"data":[{"a":1}]}'
    const md = '```ax-table\n' + body + '\n```'
    const editor = mountEditor(md)
    const out = getMarkdown(editor)
    expect(out).toContain('```ax-table')
    expect(out).toContain('"id":"tbl-1"')
    expect(out).toContain('"a":1')
    editor.destroy()
  })

  it('preserves both kinds + prose in the same doc', () => {
    const md = `# Report

Intro paragraph.

\`\`\`ax-table
{"id":"t","columns":[{"key":"a","title":"A"}],"data":[]}
\`\`\`

Middle text.

\`\`\`ax-chart
{"id":"c","option":{}}
\`\`\`

End.`
    const editor = mountEditor(md)
    const out = getMarkdown(editor)
    expect(out).toContain('# Report')
    expect(out).toContain('Intro paragraph.')
    expect(out).toContain('```ax-table')
    expect(out).toContain('"id":"t"')
    expect(out).toContain('Middle text.')
    expect(out).toContain('```ax-chart')
    expect(out).toContain('"id":"c"')
    expect(out).toContain('End')
    editor.destroy()
  })

  it('preserves block ids after no-op load (regression for find-by-id)', () => {
    const md = '```ax-chart\n{"id":"keep-this-id","option":{"foo":42}}\n```'
    const editor = mountEditor(md)
    const out = getMarkdown(editor)
    expect(out).toContain('"id":"keep-this-id"')
    expect(out).toContain('"foo":42')
    editor.destroy()
  })
})
