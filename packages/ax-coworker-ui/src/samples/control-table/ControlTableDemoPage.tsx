import { startTransition, useCallback, useMemo, useState } from 'react'
import { App, Flex } from 'antd'
import type { Key } from 'react'
import { AxControlTable, type ControlTableColumn } from '@ax-cowork/control-table'
import { BodyCell } from './BodyCell.tsx'
import { DemoToolbar } from './DemoToolbar.tsx'
import { FilterPanel, type FilterValues } from './FilterPanel.tsx'
import { buildMockRows, COL_COUNT, NUMERIC_COL_COUNT, type DemoRow } from './mockData.ts'

const FILTER_PANEL_WIDTH = 240
const FILTER_FIELD_KEYS = Array.from({ length: COL_COUNT }, (_, i) => `c${i + 1}`)
const FILTER_OPTIONS = [
  { label: 'Body Cell', value: 'Body Cell' },
  { label: 'Body Cell A', value: 'Body Cell A' },
  { label: 'Body Cell B', value: 'Body Cell B' },
  { label: 'Body Cell C', value: 'Body Cell C' },
]

const COLUMNS: ControlTableColumn<DemoRow>[] = Array.from({ length: COL_COUNT }, (_, i) => {
  const key = `c${i + 1}` as `c${number}`
  const isNumeric = i < NUMERIC_COL_COUNT
  return {
    key,
    title: `Cell Header ${i + 1}`,
    accessor: (row: DemoRow) => row[key] ?? (isNumeric ? 0 : ''),
    sortable: true,
    kind: isNumeric ? 'number' : 'string',
  }
})

const renderBodyCell = (value: string) => <BodyCell value={value} />

export function ControlTableDemoPage() {
  const { message } = App.useApp()
  const [filterOpen, setFilterOpen] = useState(true)
  const [filterValues, setFilterValues] = useState<FilterValues>({})
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({})
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([])

  const [allRows, setAllRows] = useState<DemoRow[]>(() => buildMockRows())

  const filteredRows = useMemo(() => {
    const activeKeys = Object.entries(appliedFilters).filter(([, v]) => v !== undefined && v !== '')
    if (activeKeys.length === 0) return allRows
    return allRows.filter((row) => activeKeys.every(([k, v]) => String(row[k as `c${number}`] ?? '').startsWith(String(v))))
  }, [allRows, appliedFilters])

  const handleFilterChange = useCallback((key: string, value: string | undefined) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setFilterValues({})
    setAppliedFilters({})
  }, [])

  const handleApply = useCallback(() => {
    setAppliedFilters(filterValues)
    message.success('Filters applied')
  }, [filterValues, message])

  const handleSelectAll = useCallback(() => {
    const next = filteredRows.map((r) => r.id)
    startTransition(() => setSelectedKeys(next))
  }, [filteredRows])

  const handleUnselectAll = useCallback(() => {
    startTransition(() => setSelectedKeys([]))
  }, [])

  const handleSelectionChange = useCallback((keys: Key[]) => {
    setSelectedKeys(keys)
  }, [])

  const handleAction = useCallback(
    (label: string) => {
      if (label === 'Action 1') {
        if (selectedKeys.length === 0) return
        const selectedSet = new Set(selectedKeys.map(String))
        const sum = filteredRows.filter((r) => selectedSet.has(String(r.id))).reduce((acc, r) => acc + (typeof r.c1 === 'number' ? r.c1 : 0), 0)
        message.success(`Sum of "Cell Header 1" over ${selectedKeys.length} selected row(s): ${sum}`)
        return
      }
      if (label === 'Action 2') {
        if (selectedKeys.length === 0) return
        const selectedSet = new Set(selectedKeys.map(String))
        setAllRows((prev) =>
          prev.map((r) => {
            if (!selectedSet.has(String(r.id))) return r
            const c1 = typeof r.c1 === 'number' ? r.c1 : 0
            const c2 = typeof r.c2 === 'number' ? r.c2 : 0
            return { ...r, c4: c1 + c2 }
          }),
        )
        message.success(`Set "Cell Header 4" = c1 + c2 on ${selectedKeys.length} row(s)`)
        return
      }
      const count = selectedKeys.length > 0 ? selectedKeys.length : filteredRows.length
      message.info(`${label} on ${count} row(s)`)
    },
    [selectedKeys, filteredRows, message],
  )

  return (
    <Flex vertical style={{ height: '100%', width: '100%', background: '#fff' }}>
      <DemoToolbar
        totalCount={filteredRows.length}
        selectedCount={selectedKeys.length}
        filterOpen={filterOpen}
        onToggleFilter={() => setFilterOpen((v) => !v)}
        onToggleConfig={() => message.info('Config panel placeholder')}
        onSelectAll={handleSelectAll}
        onUnselectAll={handleUnselectAll}
        onAction={handleAction}
      />
      <Flex style={{ flex: 1, minHeight: 0 }}>
        {filterOpen && (
          <FilterPanel
            width={FILTER_PANEL_WIDTH}
            fieldKeys={FILTER_FIELD_KEYS}
            values={filterValues}
            options={FILTER_OPTIONS}
            onChange={handleFilterChange}
            onReset={handleReset}
            onApply={handleApply}
            onClose={() => setFilterOpen(false)}
          />
        )}
        <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
          <AxControlTable<DemoRow>
            data={filteredRows}
            columns={COLUMNS}
            rowKey={(row) => row.id}
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
            renderCell={renderBodyCell}
            showRowNumber
          />
        </div>
      </Flex>
    </Flex>
  )
}
