import { BubbleMenu } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import { Button, Flex } from 'antd'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Floating toolbar that appears when the user selects text. Provides inline
// formatting (bold/italic/strike/code) without forcing them to find the
// top toolbar — Notion-style.
export function EditorBubbleMenu({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  const isActive = (name: string) => editor.isActive(name)

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100, placement: 'top' }}>
      <Flex
        gap={2}
        style={{
          background: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          border: '1px solid #f0f0f0',
          borderRadius: 6,
          padding: 4,
        }}
      >
        <Button
          type={isActive('bold') ? 'primary' : 'text'}
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<AxMuiIcon icon="mdiFormatBold" size={14} />}
        />
        <Button
          type={isActive('italic') ? 'primary' : 'text'}
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<AxMuiIcon icon="mdiFormatItalic" size={14} />}
        />
        <Button
          type={isActive('strike') ? 'primary' : 'text'}
          size="small"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<AxMuiIcon icon="mdiFormatStrikethroughVariant" size={14} />}
        />
        <Button
          type={isActive('code') ? 'primary' : 'text'}
          size="small"
          onClick={() => editor.chain().focus().toggleCode().run()}
          icon={<AxMuiIcon icon="mdiCodeTags" size={14} />}
        />
      </Flex>
    </BubbleMenu>
  )
}
