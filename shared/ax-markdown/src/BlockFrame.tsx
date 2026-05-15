import type { ReactNode } from 'react'
import { Button } from 'antd'

export interface BlockFrameProps {
  children: ReactNode
  onEdit?: () => void
}

// Wraps a rendered block (chart/table) with an Edit affordance when an
// onEdit callback is provided. View pages omit onEdit → no overlay.
export function BlockFrame({ children, onEdit }: BlockFrameProps) {
  return (
    <div style={{ position: 'relative', margin: '12px 0' }}>
      {children}
      {onEdit && (
        <Button size="small" onClick={onEdit} style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          Edit
        </Button>
      )}
    </div>
  )
}
