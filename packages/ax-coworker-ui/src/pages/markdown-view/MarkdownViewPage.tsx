import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Drawer, Flex, Result, Segmented, Tag } from 'antd'
import { createStyles } from 'antd-style'
import { AxMarkdown, findBlock, replaceBlock } from '@ax-cowork/markdown'
import type { FoundBlock } from '@ax-cowork/markdown'
import { useStore } from '@/acore/store/store.context'
import { ProseEditor } from './ProseEditor.tsx'
import { SourceEditor } from './SourceEditor.tsx'
import { BlockEditor } from './BlockEditor.tsx'
import { BlockEditContext, type BlockEditContextValue } from './blockEditContext'

const AUTOSAVE_MS = 1000

const useStyles = createStyles(({ token }) => ({
  prose: {
    color: token.colorText,
    fontSize: token.fontSize,
    lineHeight: 1.6,
    '& h1, & h2, & h3': { marginTop: token.marginLG, marginBottom: token.marginSM, fontWeight: 600 },
    '& h1': { fontSize: token.fontSizeHeading2 },
    '& h2': { fontSize: token.fontSizeHeading3 },
    '& h3': { fontSize: token.fontSizeHeading4 },
    '& p': { margin: `${token.marginSM}px 0` },
    '& ul, & ol': { paddingLeft: token.paddingLG, margin: `${token.marginSM}px 0` },
    '& code': { padding: '2px 6px', background: token.colorFillTertiary, borderRadius: 4, fontSize: '0.9em' },
    '& pre': { background: token.colorFillQuaternary, padding: token.padding, borderRadius: 6, overflow: 'auto' },
    '& pre code': { padding: 0, background: 'transparent' },
    '& table': { borderCollapse: 'collapse', margin: `${token.marginSM}px 0`, width: '100%' },
    '& th, & td': { border: `1px solid ${token.colorBorderSecondary}`, padding: '6px 10px', textAlign: 'left' },
    '& th': { background: token.colorFillQuaternary },
  },
}))

type Mode = 'view' | 'edit' | 'raw'

export const MarkdownViewPage = observer(() => {
  const { id = '' } = useParams<{ id: string }>()
  const { documents } = useStore()
  const doc = documents.getById(id)

  if (!doc) {
    return <Result status="404" title="Document not found" subTitle={`No document with id "${id}".`} />
  }

  return <Body docId={doc.id} key={doc.id} />
})

interface BodyProps {
  docId: string
}

// Split into a separate component so we can rely on `key={docId}` to force a
// fresh mount (and fresh draft state) when navigating between docs.
const Body = observer(({ docId }: BodyProps) => {
  const { documents } = useStore()
  const { styles } = useStyles()
  const doc = documents.getById(docId)!

  const [mode, setMode] = useState<Mode>('view')
  const [draft, setDraft] = useState(doc.source)
  const [editingBlock, setEditingBlock] = useState<FoundBlock | null>(null)
  const isDirty = draft !== doc.source

  // Auto-save: 1s after the last edit, persist to the store. The store handles
  // localStorage. Switching docs or unmounting flushes via the ref below.
  useEffect(() => {
    if (!isDirty) return
    const t = setTimeout(() => documents.setSource(docId, draft), AUTOSAVE_MS)
    return () => clearTimeout(t)
  }, [draft, isDirty, docId, documents])

  // Flush on unmount so navigating away within 1s of the last keystroke
  // doesn't drop changes.
  const draftRef = useRef(draft)
  draftRef.current = draft
  useEffect(() => {
    return () => {
      const docNow = documents.getById(docId)
      if (docNow && draftRef.current !== docNow.source) {
        documents.setSource(docId, draftRef.current)
      }
    }
  }, [docId, documents])

  const handleEditBlock = useCallback(
    (blockId: string) => {
      const found = findBlock(draft, blockId)
      if (found) setEditingBlock(found)
    },
    [draft],
  )

  // TipTap NodeView calls openEditor(blockId) → same drawer flow as preview's
  // Edit overlay.
  const blockEditCtx = useMemo<BlockEditContextValue>(() => ({ openEditor: handleEditBlock }), [handleEditBlock])

  const handleBlockSave = (newBody: string) => {
    if (!editingBlock) return
    const originalId = extractId(editingBlock.body)
    const next = replaceBlock(draft, originalId, newBody)
    if (next !== null) setDraft(next)
    setEditingBlock(null)
  }

  const editingBlockId = useMemo(() => (editingBlock ? extractId(editingBlock.body) : ''), [editingBlock])

  return (
    <BlockEditContext.Provider value={blockEditCtx}>
      <Flex vertical style={{ height: '100%', background: '#fff' }}>
        <Flex align="center" justify="space-between" style={{ height: 44, padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
          <Segmented<Mode>
            size="small"
            options={[
              { label: 'View', value: 'view' },
              { label: 'Edit', value: 'edit' },
              { label: 'Raw', value: 'raw' },
            ]}
            value={mode}
            onChange={setMode}
          />
          <Tag color={isDirty ? 'gold' : 'green'}>{isDirty ? 'Saving…' : 'Saved'}</Tag>
        </Flex>

        <div style={{ flex: 1, minHeight: 0 }}>
          {mode === 'edit' && <ProseEditor value={draft} onChange={setDraft} />}
          {mode === 'raw' && <SourceEditor value={draft} onChange={setDraft} />}
          {mode === 'view' && (
            <div style={{ height: '100%', overflow: 'auto' }}>
              <div className={styles.prose} style={{ maxWidth: 880, margin: '0 auto', padding: 24 }}>
                <AxMarkdown source={draft} onEditBlock={handleEditBlock} />
              </div>
            </div>
          )}
        </div>

        <Drawer
          open={editingBlock !== null}
          onClose={() => setEditingBlock(null)}
          width={720}
          title={editingBlock ? `Edit ${editingBlock.tag}` : ''}
          styles={{ body: { padding: 0 } }}
        >
          {editingBlock && (
            <BlockEditor
              key={editingBlock.start}
              initialBody={editingBlock.body}
              kind={editingBlock.kind}
              tag={editingBlock.tag}
              blockId={editingBlockId}
              onSave={handleBlockSave}
              onCancel={() => setEditingBlock(null)}
            />
          )}
        </Drawer>
      </Flex>
    </BlockEditContext.Provider>
  )
})

// Tolerant id extraction — works even if surrounding JSON is mid-edit.
function extractId(body: string): string {
  const m = /"id"\s*:\s*"([^"]+)"/.exec(body)
  return m?.[1] ?? ''
}
