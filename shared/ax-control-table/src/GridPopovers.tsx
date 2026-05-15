import { memo, useState } from 'react'
import { Button, Checkbox, Flex, Input, Popover, Tooltip } from 'antd'
import { FilterFilled, FilterOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons'
import type { Column, Table } from '@tanstack/react-table'

const FILTER_OPTIONS = ['Body Cell', 'Body Cell A', 'Body Cell B', 'Body Cell C']

interface ColumnFilterPopoverProps<T> {
  column: Column<T, unknown>
}

export function ColumnFilterPopover<T>({ column }: ColumnFilterPopoverProps<T>) {
  const [open, setOpen] = useState(false)
  const current = (column.getFilterValue() as string[] | undefined) ?? []
  const [draft, setDraft] = useState<string[]>(current)
  const isFiltered = column.getIsFiltered()

  const apply = () => {
    column.setFilterValue(draft.length === 0 ? undefined : draft)
    setOpen(false)
  }
  const reset = () => {
    setDraft([])
    column.setFilterValue(undefined)
    setOpen(false)
  }
  const handleOpenChange = (v: boolean) => {
    if (v) setDraft(((column.getFilterValue() as string[] | undefined) ?? []).slice())
    setOpen(v)
  }

  // stopPropagation: clicks inside an AntD portal still bubble through React's
  // synthetic event tree to the header cell (which has onClick = toggleSort).
  // Without this, ticking a checkbox would also flip the column's sort order.
  const content = (
    <div onClick={(e) => e.stopPropagation()} style={{ minWidth: 160, padding: 4 }}>
      <Checkbox.Group
        value={draft}
        onChange={(vals) => setDraft(vals as string[])}
        options={FILTER_OPTIONS.map((o) => ({ label: o, value: o }))}
        style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
      />
      <Flex justify="space-between" gap={8} style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #f0f0f0' }}>
        <Button size="small" onClick={reset}>
          Reset
        </Button>
        <Button size="small" type="primary" onClick={apply}>
          OK
        </Button>
      </Flex>
    </div>
  )

  return (
    <Popover content={content} open={open} onOpenChange={handleOpenChange} trigger="click" placement="bottomRight" destroyOnHidden>
      <span onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex', cursor: 'pointer', padding: 2, borderRadius: 2 }}>
        <Tooltip title="Filter">
          <span style={{ display: 'inline-flex', fontSize: 12, color: isFiltered ? '#3F51B5' : '#bfbfbf' }}>
            {isFiltered ? <FilterFilled /> : <FilterOutlined />}
          </span>
        </Tooltip>
      </span>
    </Popover>
  )
}

interface ColumnTogglePopoverProps<T> {
  table: Table<T>
}

function ColumnToggleInner<T>({ table }: ColumnTogglePopoverProps<T>) {
  const [search, setSearch] = useState('')
  const cols = table.getAllLeafColumns()
  const visibleCount = cols.filter((c) => c.getIsVisible()).length
  const filtered = cols.filter((c) => {
    if (!search) return true
    const label = String(c.columnDef.header ?? c.id)
    return label.toLowerCase().includes(search.toLowerCase())
  })

  const setAll = (visible: boolean) => {
    cols.forEach((c) => c.toggleVisibility(visible))
  }

  return (
    <div style={{ width: 240, padding: 4 }}>
      <Input
        size="small"
        placeholder="Search columns"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
        allowClear
        style={{ marginBottom: 6 }}
      />
      <Flex justify="space-between" gap={8} style={{ marginBottom: 6, fontSize: 12, color: '#8c8c8c' }}>
        <span>
          {visibleCount} / {cols.length} visible
        </span>
        <Flex gap={6}>
          <a onClick={() => setAll(true)}>All</a>
          <a onClick={() => setAll(false)}>None</a>
        </Flex>
      </Flex>
      <div style={{ maxHeight: 320, overflow: 'auto' }}>
        <Flex vertical gap={4}>
          {filtered.map((c) => (
            <Checkbox key={c.id} checked={c.getIsVisible()} onChange={(e) => c.toggleVisibility(e.target.checked)}>
              {String(c.columnDef.header ?? c.id)}
            </Checkbox>
          ))}
        </Flex>
      </div>
    </div>
  )
}

export const ColumnTogglePopover = memo(function ColumnTogglePopover<T>({ table }: ColumnTogglePopoverProps<T>) {
  return (
    <Popover content={<ColumnToggleInner table={table} />} trigger="click" placement="bottomRight" destroyOnHidden>
      <Button size="small" type="text" icon={<SettingOutlined />} title="Toggle columns" />
    </Popover>
  )
}) as <T>(props: ColumnTogglePopoverProps<T>) => React.JSX.Element
