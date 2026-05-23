import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { AxChartNodeView } from './AxChartNodeView'

// TipTap node for embedded ax-chart blocks. Stores the raw JSON `body` as an
// attribute so the chart can be re-rendered + serialized back to a fenced
// ```ax-chart block unchanged.
//
// Round-trip strategy: markdown is pre-processed in ProseEditor to replace
// fences with <div data-ax-chart="<url-encoded body>"> placeholders. TipTap
// parseHTML below picks them up. The storage.markdown.serialize then writes
// the fence back out — no post-processing needed.
export const AxChartBlockExtension = Node.create({
  name: 'axChartBlock',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      body: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-ax-chart]',
        getAttrs: (el) => {
          if (typeof el === 'string') return null
          const encoded = (el as HTMLElement).getAttribute('data-ax-chart')
          if (encoded === null) return false
          try {
            return { body: decodeURIComponent(encoded) }
          } catch {
            return { body: encoded }
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-ax-chart': encodeURIComponent(node.attrs.body as string) })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AxChartNodeView)
  },

  // tiptap-markdown reads this storage entry. `serialize` is the only side we
  // need to override — parse happens via the HTML placeholder pipeline.
  addStorage() {
    return {
      markdown: {
        serialize(state: { write: (s: string) => void; closeBlock: (n: unknown) => void }, node: { attrs: { body: string } }) {
          state.write('```ax-chart\n')
          state.write(node.attrs.body)
          state.write('\n```')
          state.closeBlock(node)
        },
        parse: {},
      },
    }
  },
})
