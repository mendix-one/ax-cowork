import { useState } from 'react'
import { Button, Checkbox, Popover, Input, Space } from 'antd'
import { SettingOutlined, SearchOutlined } from '@ant-design/icons'
import type { ControlTableColumn } from './types'
import type { Key } from 'react'

interface ColumnToggleProps<T> {
  columns: ControlTableColumn<T>[]
  onColumnsChange: (columns: ControlTableColumn<T>[]) => void
  searchPlaceholder?: string
}

export function ColumnToggle<T>({ columns, onColumnsChange, searchPlaceholder }: ColumnToggleProps<T>) {
  const [search, setSearch] = useState('')

  const toggleableColumns = columns.filter((col) => col.toggleable !== false)
  const filtered = toggleableColumns.filter((col) => {
    if (!search) return true
    const label = typeof col.title === 'string' ? col.title : String(col.key)
    return label.toLowerCase().includes(search.toLowerCase())
  })

  const handleToggle = (key: Key, checked: boolean) => {
    const next = columns.map((col) => (col.key === key ? { ...col, visible: checked } : col))
    onColumnsChange(next)
  }

  const content = (
    <div style={{ minWidth: 180, maxHeight: 300, overflow: 'auto' }}>
      {toggleableColumns.length > 6 && (
        <Input
          prefix={<SearchOutlined />}
          placeholder={searchPlaceholder ?? 'Search columns'}
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ marginBottom: 8 }}
        />
      )}
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        {filtered.map((col) => (
          <Checkbox key={String(col.key)} checked={col.visible !== false} onChange={(e) => handleToggle(col.key, e.target.checked)}>
            {typeof col.title === 'string' ? col.title : String(col.key)}
          </Checkbox>
        ))}
      </Space>
    </div>
  )

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Button type="text" icon={<SettingOutlined />} size="small" />
    </Popover>
  )
}
