import { AxControlTable, type ControlTableColumn } from '@ax-cowork/control-table'
import type { TableBlockJson } from '../schemas'

export interface TableBlockProps {
  block: TableBlockJson
  height?: number
}

type IndexedRow = Record<string, unknown> & { __idx: number }

function toCellValue(v: unknown): string | number {
  if (typeof v === 'string' || typeof v === 'number') return v
  if (v == null) return ''
  return String(v)
}

export function TableBlock({ block, height = 360 }: TableBlockProps) {
  const indexed: IndexedRow[] = block.data.map((row, idx) => ({ ...row, __idx: idx }))

  const columns: ControlTableColumn<IndexedRow>[] = block.columns.map((col) => ({
    key: col.key,
    title: col.title,
    kind: col.kind ?? 'string',
    sortable: col.sortable ?? false,
    accessor: (row) => toCellValue(row[col.key]),
  }))

  return (
    <div style={{ height, border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
      <AxControlTable<IndexedRow> data={indexed} columns={columns} rowKey={(row) => row.__idx} showColumnToggle={false} showColumnFilter={false} />
    </div>
  )
}
