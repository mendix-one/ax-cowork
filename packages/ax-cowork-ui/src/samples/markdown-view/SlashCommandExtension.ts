import { Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import type { Editor, Range } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import type { SuggestionProps } from '@tiptap/suggestion'
import tippy from 'tippy.js'
import type { Instance, GetReferenceClientRect } from 'tippy.js'
import { SlashCommandPopup } from './SlashCommandPopup'
import type { SlashCommandPopupHandle, SlashItem } from './SlashCommandPopup'
import { newChartBody, newTableBody } from './blockTemplates'

// Slash-command items. Each one is a TipTap chain that runs on selection.
// Keep `command` pure-functional so the suggestion plugin can call it from
// inside its own command pipeline without surprises.
const ITEMS: SlashItem[] = [
  {
    title: 'Heading 1',
    description: 'Top-level section heading',
    icon: 'mdiFormatHeader1',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Mid-level heading',
    icon: 'mdiFormatHeader2',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Sub-heading',
    icon: 'mdiFormatHeader3',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet list',
    description: 'Unordered list',
    icon: 'mdiFormatListBulleted',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: 'Numbered list',
    description: 'Ordered list',
    icon: 'mdiFormatListNumbered',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: 'Quote',
    description: 'Block quote',
    icon: 'mdiFormatQuoteOpen',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: 'Code block',
    description: 'Fenced code',
    icon: 'mdiCodeTags',
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'Chart',
    description: 'Insert ax-chart block',
    icon: 'mdiChartBar',
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: 'axChartBlock', attrs: { body: newChartBody() } })
        .run(),
  },
  {
    title: 'Table',
    description: 'Insert ax-table block',
    icon: 'mdiTable',
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: 'axTableBlock', attrs: { body: newTableBody() } })
        .run(),
  },
]

type SuggestionRenderProps = SuggestionProps<SlashItem, SlashItem>

// Build the render handlers — wires ReactRenderer (the popup component)
// to a tippy.js floating positioned next to the caret.
function buildRender() {
  return () => {
    let component: ReactRenderer<SlashCommandPopupHandle> | null = null
    let popup: Instance[] | null = null

    return {
      onStart(props: SuggestionRenderProps) {
        component = new ReactRenderer(SlashCommandPopup, {
          props,
          editor: props.editor,
        })
        if (!props.clientRect) return
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },
      onUpdate(props: SuggestionRenderProps) {
        component?.updateProps(props)
        if (popup && popup[0] && props.clientRect) {
          popup[0].setProps({ getReferenceClientRect: props.clientRect as GetReferenceClientRect })
        }
      },
      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === 'Escape') {
          popup?.[0]?.hide()
          return true
        }
        return component?.ref?.onKeyDown(props) ?? false
      },
      onExit() {
        popup?.[0]?.destroy()
        component?.destroy()
        popup = null
        component = null
      },
    }
  }
}

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: SlashItem }) => {
          props.command({ editor, range })
        },
        items: ({ query }: { query: string }) => {
          const q = query.toLowerCase()
          return ITEMS.filter((item) => item.title.toLowerCase().includes(q))
        },
        render: buildRender(),
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
