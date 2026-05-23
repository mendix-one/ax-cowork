import { Button, Divider, Dropdown, Flex } from 'antd'
import type { Editor } from '@tiptap/react'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { newChartBody, newTableBody } from './blockTemplates'

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  const isActive = (name: string, attrs?: Record<string, unknown>) => editor.isActive(name, attrs)

  const setHeading = (level: 1 | 2 | 3) => editor.chain().focus().toggleHeading({ level }).run()
  const setParagraph = () => editor.chain().focus().setParagraph().run()
  const toggleBold = () => editor.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.chain().focus().toggleItalic().run()
  const toggleStrike = () => editor.chain().focus().toggleStrike().run()
  const toggleCode = () => editor.chain().focus().toggleCode().run()
  const toggleBullet = () => editor.chain().focus().toggleBulletList().run()
  const toggleOrdered = () => editor.chain().focus().toggleOrderedList().run()
  const toggleQuote = () => editor.chain().focus().toggleBlockquote().run()

  const insertChart = () => {
    editor
      .chain()
      .focus()
      .insertContent({ type: 'axChartBlock', attrs: { body: newChartBody() } })
      .run()
  }
  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertContent({ type: 'axTableBlock', attrs: { body: newTableBody() } })
      .run()
  }

  const styleLabel = isActive('heading', { level: 1 })
    ? 'Heading 1'
    : isActive('heading', { level: 2 })
      ? 'Heading 2'
      : isActive('heading', { level: 3 })
        ? 'Heading 3'
        : 'Paragraph'

  return (
    <Flex align="center" gap={2} style={{ padding: '4px 8px', borderBottom: '1px solid #f0f0f0', background: '#fafafa', flexWrap: 'wrap' }}>
      <Dropdown
        menu={{
          items: [
            { key: 'p', label: 'Paragraph', onClick: setParagraph },
            { key: 'h1', label: 'Heading 1', onClick: () => setHeading(1) },
            { key: 'h2', label: 'Heading 2', onClick: () => setHeading(2) },
            { key: 'h3', label: 'Heading 3', onClick: () => setHeading(3) },
          ],
        }}
        trigger={['click']}
      >
        <Button size="small" style={{ minWidth: 110 }}>
          {styleLabel} ▾
        </Button>
      </Dropdown>

      <Divider type="vertical" style={{ margin: '0 4px' }} />

      <Button type={isActive('bold') ? 'primary' : 'text'} size="small" onClick={toggleBold} icon={<AxMuiIcon icon="mdiFormatBold" size={14} />} />
      <Button type={isActive('italic') ? 'primary' : 'text'} size="small" onClick={toggleItalic} icon={<AxMuiIcon icon="mdiFormatItalic" size={14} />} />
      <Button
        type={isActive('strike') ? 'primary' : 'text'}
        size="small"
        onClick={toggleStrike}
        icon={<AxMuiIcon icon="mdiFormatStrikethroughVariant" size={14} />}
      />
      <Button type={isActive('code') ? 'primary' : 'text'} size="small" onClick={toggleCode} icon={<AxMuiIcon icon="mdiCodeTags" size={14} />} />

      <Divider type="vertical" style={{ margin: '0 4px' }} />

      <Button
        type={isActive('bulletList') ? 'primary' : 'text'}
        size="small"
        onClick={toggleBullet}
        icon={<AxMuiIcon icon="mdiFormatListBulleted" size={14} />}
      />
      <Button
        type={isActive('orderedList') ? 'primary' : 'text'}
        size="small"
        onClick={toggleOrdered}
        icon={<AxMuiIcon icon="mdiFormatListNumbered" size={14} />}
      />
      <Button type={isActive('blockquote') ? 'primary' : 'text'} size="small" onClick={toggleQuote} icon={<AxMuiIcon icon="mdiFormatQuoteOpen" size={14} />} />

      <Divider type="vertical" style={{ margin: '0 4px' }} />

      <Dropdown
        menu={{
          items: [
            { key: 'chart', label: 'Chart', icon: <AxMuiIcon icon="mdiChartBar" size={14} />, onClick: insertChart },
            { key: 'table', label: 'Table', icon: <AxMuiIcon icon="mdiTable" size={14} />, onClick: insertTable },
          ],
        }}
        trigger={['click']}
      >
        <Button size="small" type="primary" ghost icon={<AxMuiIcon icon="mdiPlus" size={14} />}>
          Insert
        </Button>
      </Dropdown>
    </Flex>
  )
}
