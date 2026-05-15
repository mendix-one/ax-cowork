import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { Button, Flex, Result, Splitter, Tag, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { AxMarkdown, ChartBlockSchema, TableBlockSchema, findBlock, replaceBlock } from '@ax-cowork/markdown'
import type { BlockKind, FoundBlock } from '@ax-cowork/markdown'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { useStore } from '@/acore/store/store.context'
import type { Doc } from '@/acore/store/document.store'

type Validation = { ok: true } | { ok: false; error: string }

function validate(kind: BlockKind, json: string): Validation {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
  const schema = kind === 'chart' ? ChartBlockSchema : TableBlockSchema
  const result = schema.safeParse(parsed)
  if (!result.success) {
    const first = result.error.issues[0]
    const path = first.path.join('.')
    return { ok: false, error: path ? `${path}: ${first.message}` : first.message }
  }
  return { ok: true }
}

export const MarkdownEditBlockPage = observer(() => {
  const { id = '', blockId = '' } = useParams<{ id: string; blockId: string }>()
  const { documents } = useStore()

  const doc = documents.getById(id)
  if (!doc) {
    return <Result status="404" title="Document not found" subTitle={`No document with id "${id}".`} />
  }

  const found = findBlock(doc.source, blockId)
  if (!found) {
    return <Result status="404" title="Block not found" subTitle={`Block "${blockId}" is not in document "${id}".`} />
  }

  // Remount when navigating between blocks so the textarea state resets cleanly.
  return <Editor doc={doc} found={found} key={`${id}/${blockId}`} />
})

interface EditorProps {
  doc: Doc
  found: FoundBlock
}

const Editor = observer(({ doc, found }: EditorProps) => {
  const navigate = useNavigate()
  const { documents } = useStore()
  const [draftJson, setDraftJson] = useState(found.body)

  const validation = useMemo(() => validate(found.kind, draftJson), [found.kind, draftJson])
  // Re-wrap the draft in a fenced block on every keystroke so AxMarkdown handles
  // schema errors uniformly (renders <BlockError> on invalid JSON / shape).
  const previewSource = useMemo(() => '```' + found.tag + '\n' + draftJson + '\n```\n', [found.tag, draftJson])

  const handleBack = () => navigate(`/docs/${doc.id}`)

  const handleSave = () => {
    if (!validation.ok) return
    const originalId = getId(found.body)
    const newSource = replaceBlock(doc.source, originalId, draftJson)
    if (newSource === null) return
    documents.setSource(doc.id, newSource)
    navigate(`/docs/${doc.id}`)
  }

  return (
    <Flex vertical style={{ height: '100%', background: '#fff' }}>
      <Flex align="center" justify="space-between" gap={12} style={{ height: 48, padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Flex align="center" gap={12}>
          <Button type="text" icon={<AxMuiIcon icon="mdiArrowLeft" size={16} />} onClick={handleBack}>
            Back
          </Button>
          <Tag color={found.kind === 'chart' ? 'purple' : 'blue'}>{found.tag}</Tag>
          <Typography.Text strong>{getId(found.body)}</Typography.Text>
        </Flex>
        <Button type="primary" disabled={!validation.ok} onClick={handleSave}>
          Save
        </Button>
      </Flex>

      <Splitter style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize="50%" min="20%" max="80%">
          <textarea
            value={draftJson}
            onChange={(e) => setDraftJson(e.target.value)}
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              padding: 16,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 13,
              lineHeight: 1.6,
              resize: 'none',
              background: '#fafafa',
            }}
          />
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', overflow: 'auto', padding: 16 }}>
            <AxMarkdown source={previewSource} />
          </div>
        </Splitter.Panel>
      </Splitter>

      <div
        style={{
          height: 28,
          padding: '0 16px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          background: validation.ok ? '#f6ffed' : '#fff2f0',
          color: validation.ok ? '#389e0d' : '#a8071a',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12,
        }}
      >
        {validation.ok ? '✓ valid' : `✗ ${validation.error}`}
      </div>
    </Flex>
  )
})

// We need the block's original id (the URL param) to locate the fence at save
// time. The original lives in `found.body`; pull it via a tolerant regex so
// even mid-edit (where draftJson may temporarily be malformed) we still know
// which fence to replace.
function getId(body: string): string {
  const m = /"id"\s*:\s*"([^"]+)"/.exec(body)
  return m?.[1] ?? ''
}
