import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import { createStyles } from 'antd-style'
import 'tippy.js/dist/tippy.css'
import { AxChartBlockExtension } from './AxChartBlockExtension'
import { AxTableBlockExtension } from './AxTableBlockExtension'
import { SlashCommandExtension } from './SlashCommandExtension'
import { EditorToolbar } from './EditorToolbar'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import { preprocessMarkdown } from './markdownPreprocess'

export interface ProseEditorProps {
  value: string
  onChange: (next: string) => void
}

const useStyles = createStyles(({ token }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    padding: token.padding,
    '& .ProseMirror': {
      outline: 'none',
      minHeight: '100%',
      color: token.colorText,
      fontSize: token.fontSize,
      lineHeight: 1.6,
      maxWidth: 880,
      margin: '0 auto',
    },
    '& .ProseMirror h1, & .ProseMirror h2, & .ProseMirror h3': {
      marginTop: token.marginLG,
      marginBottom: token.marginSM,
      fontWeight: 600,
    },
    '& .ProseMirror h1': { fontSize: token.fontSizeHeading2 },
    '& .ProseMirror h2': { fontSize: token.fontSizeHeading3 },
    '& .ProseMirror h3': { fontSize: token.fontSizeHeading4 },
    '& .ProseMirror p': { margin: `${token.marginSM}px 0` },
    '& .ProseMirror ul, & .ProseMirror ol': { paddingLeft: token.paddingLG, margin: `${token.marginSM}px 0` },
    '& .ProseMirror code': { padding: '2px 6px', background: token.colorFillTertiary, borderRadius: 4, fontSize: '0.9em' },
    '& .ProseMirror pre': { background: token.colorFillQuaternary, padding: token.padding, borderRadius: 6, overflow: 'auto' },
    '& .ProseMirror pre code': { padding: 0, background: 'transparent' },
    '& .ProseMirror blockquote': {
      borderLeft: `3px solid ${token.colorBorder}`,
      paddingLeft: token.padding,
      color: token.colorTextSecondary,
      margin: `${token.marginSM}px 0`,
    },
  },
}))

export function ProseEditor({ value, onChange }: ProseEditorProps) {
  const { styles } = useStyles()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: true,
        breaks: false,
        tightLists: true,
        linkify: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      AxChartBlockExtension,
      AxTableBlockExtension,
      SlashCommandExtension,
    ],
    content: preprocessMarkdown(value),
    onUpdate({ editor }) {
      const md = editor.storage.markdown.getMarkdown() as string
      onChange(md)
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.storage.markdown.getMarkdown() as string
    if (current === value) return
    editor.commands.setContent(preprocessMarkdown(value), false)
  }, [value, editor])

  return (
    <div className={styles.root}>
      <EditorToolbar editor={editor} />
      <EditorBubbleMenu editor={editor} />
      <div className={styles.content}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
