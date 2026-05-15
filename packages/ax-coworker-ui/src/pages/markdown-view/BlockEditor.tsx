import { useMemo, useState } from 'react'
import { Button, Flex, Splitter, Tag, Typography } from 'antd'
import { AxMarkdown, ChartBlockSchema, TableBlockSchema } from '@ax-cowork/markdown'
import type { BlockKind } from '@ax-cowork/markdown'

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

export interface BlockEditorProps {
  initialBody: string
  kind: BlockKind
  tag: 'ax-chart' | 'ax-table'
  blockId: string
  onSave: (newBody: string) => void
  onCancel: () => void
}

export function BlockEditor({ initialBody, kind, tag, blockId, onSave, onCancel }: BlockEditorProps) {
  const [draft, setDraft] = useState(initialBody)
  const validation = useMemo(() => validate(kind, draft), [kind, draft])
  // Wrap in a fenced block and let AxMarkdown handle invalid JSON / schema fail
  // uniformly — BlockError shows in the preview pane when validation fails.
  const previewSource = useMemo(() => '```' + tag + '\n' + draft + '\n```\n', [tag, draft])

  return (
    <Flex vertical style={{ height: '100%' }}>
      <Flex align="center" gap={8} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
        <Tag color={kind === 'chart' ? 'purple' : 'blue'}>{tag}</Tag>
        <Typography.Text strong>{blockId}</Typography.Text>
      </Flex>

      <Splitter layout="vertical" style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize="55%" min="20%" max="80%">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              padding: 12,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 13,
              lineHeight: 1.6,
              resize: 'none',
              background: '#fafafa',
            }}
          />
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', overflow: 'auto', padding: 12 }}>
            <AxMarkdown source={previewSource} />
          </div>
        </Splitter.Panel>
      </Splitter>

      <div
        style={{
          padding: '6px 12px',
          borderTop: '1px solid #f0f0f0',
          background: validation.ok ? '#f6ffed' : '#fff2f0',
          color: validation.ok ? '#389e0d' : '#a8071a',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12,
        }}
      >
        {validation.ok ? '✓ valid' : `✗ ${validation.error}`}
      </div>

      <Flex justify="end" gap={8} style={{ padding: 12, borderTop: '1px solid #f0f0f0' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" disabled={!validation.ok} onClick={() => onSave(draft)}>
          Save block
        </Button>
      </Flex>
    </Flex>
  )
}
