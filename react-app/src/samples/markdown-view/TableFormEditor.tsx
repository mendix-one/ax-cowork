import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Alert, Button, Checkbox, Flex, Input, Select } from 'antd'
import { TableBlockSchema } from '@ax-cowork/markdown'
import type { TableBlockJson, TableColumnJson } from '@ax-cowork/markdown'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export interface TableFormEditorProps {
  draft: string
  onDraftChange: (next: string) => void
}

// Spreadsheet-style table editor. The form IS the visual representation —
// no separate preview pane needed (user sees the table they're editing).
//
// State flow: draft (JSON string) is source-of-truth. Every edit re-serializes
// the parsed block back to JSON. Parsing failures show an Alert and force
// the user to the JSON tab.
export function TableFormEditor({ draft, onDraftChange }: TableFormEditorProps) {
  const parseResult = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(draft)
      return TableBlockSchema.safeParse(parsed)
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : String(err) } as const
    }
  }, [draft])

  if (!parseResult.success) {
    return (
      <div style={{ padding: 16 }}>
        <Alert type="warning" message="Form unavailable" description="Current JSON doesn't match the table schema. Switch to the JSON tab to fix manually." />
      </div>
    )
  }

  const block = parseResult.data

  const commit = (next: TableBlockJson) => onDraftChange(JSON.stringify(next, null, 2))

  const updateColumn = (idx: number, patch: Partial<TableColumnJson>) => {
    commit({ ...block, columns: block.columns.map((c, i) => (i === idx ? { ...c, ...patch } : c)) })
  }

  const renameKey = (idx: number, newKey: string) => {
    const oldKey = block.columns[idx].key
    if (!newKey || newKey === oldKey) return
    if (block.columns.some((c, i) => i !== idx && c.key === newKey)) return
    const nextCols = block.columns.map((c, i) => (i === idx ? { ...c, key: newKey } : c))
    const nextData = block.data.map((row) => {
      const next = { ...row, [newKey]: row[oldKey] }
      delete next[oldKey]
      return next
    })
    commit({ ...block, columns: nextCols, data: nextData })
  }

  const addColumn = () => {
    let i = block.columns.length + 1
    while (block.columns.some((c) => c.key === `col_${i}`)) i++
    const key = `col_${i}`
    commit({ ...block, columns: [...block.columns, { key, title: 'New column', kind: 'string', sortable: false }] })
  }

  const removeColumn = (idx: number) => {
    if (block.columns.length <= 1) return
    const col = block.columns[idx]
    commit({
      ...block,
      columns: block.columns.filter((_, i) => i !== idx),
      data: block.data.map((row) => {
        const next = { ...row }
        delete next[col.key]
        return next
      }),
    })
  }

  const updateCell = (rowIdx: number, col: TableColumnJson, value: string) => {
    const parsed = col.kind === 'number' ? (value === '' ? 0 : Number(value)) : value
    const data = block.data.map((row, i) => (i === rowIdx ? { ...row, [col.key]: parsed } : row))
    commit({ ...block, data })
  }

  const addRow = () => {
    const row: Record<string, unknown> = {}
    block.columns.forEach((col) => {
      row[col.key] = col.kind === 'number' ? 0 : ''
    })
    commit({ ...block, data: [...block.data, row] })
  }

  const removeRow = (idx: number) => {
    commit({ ...block, data: block.data.filter((_, i) => i !== idx) })
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 12 }}>
      <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 12 }}>
        Block id: <code style={{ background: '#f5f5f5', padding: '1px 4px', borderRadius: 3 }}>{block.id}</code>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 32 }}>#</th>
              {block.columns.map((col, idx) => (
                <th key={col.key} style={thStyle}>
                  <Flex vertical gap={4}>
                    <Input size="small" value={col.title} placeholder="Header" onChange={(e) => updateColumn(idx, { title: e.target.value })} />
                    <Flex gap={4} align="center">
                      <Input
                        size="small"
                        value={col.key}
                        prefix={<span style={{ color: '#8c8c8c' }}>key</span>}
                        onBlur={(e) => renameKey(idx, e.target.value.trim())}
                        onChange={(e) => updateColumn(idx, { key: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <Select
                        size="small"
                        value={col.kind ?? 'string'}
                        onChange={(kind) => updateColumn(idx, { kind })}
                        options={[
                          { label: 'Text', value: 'string' },
                          { label: '#', value: 'number' },
                        ]}
                        style={{ width: 72 }}
                      />
                    </Flex>
                    <Flex gap={4} align="center" justify="space-between">
                      <Checkbox checked={col.sortable ?? false} onChange={(e) => updateColumn(idx, { sortable: e.target.checked })}>
                        <span style={{ fontSize: 11 }}>sortable</span>
                      </Checkbox>
                      <Button
                        size="small"
                        type="text"
                        disabled={block.columns.length <= 1}
                        icon={<AxMuiIcon icon="mdiClose" size={12} color="#8c8c8c" />}
                        onClick={() => removeColumn(idx)}
                      />
                    </Flex>
                  </Flex>
                </th>
              ))}
              <th style={{ ...thStyle, width: 64 }}>
                <Button size="small" icon={<AxMuiIcon icon="mdiPlus" size={12} />} onClick={addColumn}>
                  Col
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {block.data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td style={{ ...tdStyle, textAlign: 'center', color: '#8c8c8c' }}>{rowIdx + 1}</td>
                {block.columns.map((col) => (
                  <td key={col.key} style={tdStyle}>
                    <Input
                      size="small"
                      value={String(row[col.key] ?? '')}
                      onChange={(e) => updateCell(rowIdx, col, e.target.value)}
                      style={col.kind === 'number' ? { textAlign: 'right', fontVariantNumeric: 'tabular-nums' } : undefined}
                      type={col.kind === 'number' ? 'number' : 'text'}
                    />
                  </td>
                ))}
                <td style={tdStyle}>
                  <Button size="small" type="text" icon={<AxMuiIcon icon="mdiClose" size={12} color="#8c8c8c" />} onClick={() => removeRow(rowIdx)} />
                </td>
              </tr>
            ))}
            {block.data.length === 0 && (
              <tr>
                <td colSpan={block.columns.length + 2} style={{ ...tdStyle, textAlign: 'center', color: '#8c8c8c', padding: 16 }}>
                  No rows yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ padding: 12, textAlign: 'center' }}>
        <Button size="small" icon={<AxMuiIcon icon="mdiPlus" size={12} />} onClick={addRow}>
          Add row
        </Button>
      </div>
    </div>
  )
}

const thStyle: CSSProperties = {
  padding: 6,
  borderBottom: '2px solid #f0f0f0',
  borderRight: '1px solid #fafafa',
  textAlign: 'left',
  verticalAlign: 'top',
  background: '#fafafa',
  position: 'sticky',
  top: 0,
}

const tdStyle: CSSProperties = {
  padding: 4,
  borderBottom: '1px solid #f0f0f0',
  borderRight: '1px solid #fafafa',
  verticalAlign: 'middle',
}
