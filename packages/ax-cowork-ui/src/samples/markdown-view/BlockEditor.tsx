import { useMemo, useState } from 'react'
import { Button, Flex, Tabs, Tag, Typography } from 'antd'
import { ChartBlockSchema, TableBlockSchema } from '@ax-cowork/markdown'
import type { BlockKind } from '@ax-cowork/markdown'
import { JsonBlockEditor } from './JsonBlockEditor'
import { TableFormEditor } from './TableFormEditor'
import { ChartFormEditor } from './ChartFormEditor'

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
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form')

  const validation = useMemo(() => validate(kind, draft), [kind, draft])

  return (
    <Flex vertical style={{ height: '100%' }}>
      <Flex align="center" gap={8} style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
        <Tag color={kind === 'chart' ? 'purple' : 'blue'}>{tag}</Tag>
        <Typography.Text strong>{blockId}</Typography.Text>
      </Flex>

      <Tabs
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as 'form' | 'json')}
        style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
        tabBarStyle={{ padding: '0 12px', marginBottom: 0 }}
        items={[
          {
            key: 'form',
            label: 'Form',
            children:
              kind === 'table' ? <TableFormEditor draft={draft} onDraftChange={setDraft} /> : <ChartFormEditor draft={draft} onDraftChange={setDraft} />,
          },
          {
            key: 'json',
            label: 'JSON',
            children: <JsonBlockEditor draft={draft} onDraftChange={setDraft} tag={tag} />,
          },
        ]}
        // AntD Tabs doesn't pass through styles to tabpane wrapper by default —
        // use destroyInactiveTabPane so each tab's internal state resets when
        // user toggles, but content fills available height through the flex
        // chain.
        destroyInactiveTabPane={false}
      />

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
