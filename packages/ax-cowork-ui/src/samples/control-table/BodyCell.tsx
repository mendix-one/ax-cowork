import { memo } from 'react'

interface BodyCellProps {
  value: string
}

export const BodyCell = memo(function BodyCell({ value }: BodyCellProps) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
      <span style={{ color: '#8c8c8c', fontSize: 14, lineHeight: 1, flexShrink: 0 }}>•</span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
      <span style={{ color: '#bfbfbf', fontSize: 11, flexShrink: 0 }}>↗</span>
    </span>
  )
})
