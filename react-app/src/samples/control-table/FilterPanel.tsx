import { memo, useCallback } from 'react'
import { Button, Flex, Select, Tooltip, Typography } from 'antd'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export type FilterValues = Record<string, string | undefined>

interface FilterPanelProps {
  width: number
  fieldKeys: string[]
  values: FilterValues
  options: { label: string; value: string }[]
  onChange: (key: string, value: string | undefined) => void
  onReset: () => void
  onApply: () => void
  onClose: () => void
}

interface FilterRowProps {
  fieldKey: string
  label: string
  value: string | undefined
  options: { label: string; value: string }[]
  onChange: (key: string, value: string | undefined) => void
}

const FilterRow = memo(function FilterRow({ fieldKey, label, value, options, onChange }: FilterRowProps) {
  const handleChange = useCallback((val: string | undefined) => onChange(fieldKey, val), [fieldKey, onChange])
  return (
    <div>
      <Flex align="center" gap={4} style={{ marginBottom: 2 }}>
        <Typography.Text style={{ fontSize: 12 }}>{label}</Typography.Text>
        <Tooltip title="Filter by Cell Header value">
          <AxMuiIcon icon="mdiInformationOutline" size={12} color="#bfbfbf" />
        </Tooltip>
      </Flex>
      <Select size="small" style={{ width: '100%' }} placeholder="Place Holder Text" allowClear options={options} value={value} onChange={handleChange} />
      <Typography.Text style={{ fontSize: 11, color: '#bfbfbf' }}>The hint text display here</Typography.Text>
    </div>
  )
})

export function FilterPanel({ width, fieldKeys, values, options, onChange, onReset, onApply, onClose }: FilterPanelProps) {
  return (
    <div
      style={{
        width,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <Flex align="center" justify="space-between" style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
        <Flex align="center" gap={6}>
          <AxMuiIcon icon="mdiFilterOutline" size={16} color="#262626" />
          <Typography.Text strong>Filter</Typography.Text>
        </Flex>
        <Button type="text" size="small" icon={<AxMuiIcon icon="mdiClose" size={16} color="#8c8c8c" />} onClick={onClose} />
      </Flex>

      <Flex vertical gap={10} style={{ flex: 1, overflow: 'auto', padding: '8px 12px' }}>
        {fieldKeys.map((key, idx) => (
          <FilterRow key={key} fieldKey={key} label={`Cell Header ${idx + 1}`} value={values[key]} options={options} onChange={onChange} />
        ))}
      </Flex>

      <Flex align="center" justify="center" gap={12} style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0' }}>
        <Button size="small" icon={<AxMuiIcon icon="mdiRestore" size={14} />} onClick={onReset}>
          Reset
        </Button>
        <Button size="small" type="primary" icon={<AxMuiIcon icon="mdiCheck" size={14} />} onClick={onApply}>
          Apply
        </Button>
      </Flex>
    </div>
  )
}
