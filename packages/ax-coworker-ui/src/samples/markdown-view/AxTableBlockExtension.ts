import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { AxTableNodeView } from './AxTableNodeView'

// See AxChartBlockExtension for the round-trip strategy. Same pattern, swap
// data attribute + fence tag.
export const AxTableBlockExtension = Node.create({
  name: 'axTableBlock',
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
        tag: 'div[data-ax-table]',
        getAttrs: (el) => {
          if (typeof el === 'string') return null
          const encoded = (el as HTMLElement).getAttribute('data-ax-table')
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
    return ['div', mergeAttributes(HTMLAttributes, { 'data-ax-table': encodeURIComponent(node.attrs.body as string) })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AxTableNodeView)
  },

  addStorage() {
    return {
      markdown: {
        serialize(state: { write: (s: string) => void; closeBlock: (n: unknown) => void }, node: { attrs: { body: string } }) {
          state.write('```ax-table\n')
          state.write(node.attrs.body)
          state.write('\n```')
          state.closeBlock(node)
        },
        parse: {},
      },
    }
  },
})
