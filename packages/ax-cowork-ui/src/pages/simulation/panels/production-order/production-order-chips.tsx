import { Tag, Tooltip } from 'antd'
import type { ProductionOrder } from '../../data/mock-plan'
import type { PoStatus } from '../../data/mock-plan'
import type { ScheduleMilestone } from '../../data/mock-plan'

const PRIORITY_COLOR: Record<NonNullable<ProductionOrder['priority']>, string> = {
  P1: 'red',
  P2: 'orange',
  P3: 'blue',
  'P-NPI': 'cyan',
}

export const PriorityChip = ({ priority }: { priority: ProductionOrder['priority'] | undefined }) => {
  if (!priority) return null
  return (
    <Tag color={PRIORITY_COLOR[priority]} style={{ marginInlineEnd: 0 }}>
      {priority}
    </Tag>
  )
}

const STATUS_COLOR: Record<PoStatus, string> = {
  READY: 'default',
  RUNNING: 'processing',
  COMPLETED: 'success',
  CANCELLED: 'error',
  'ON HOLD': 'warning',
}

export const StatusChip = ({ status }: { status: PoStatus | undefined }) => {
  if (!status) return null
  return (
    <Tag color={STATUS_COLOR[status]} style={{ marginInlineEnd: 0 }}>
      {status}
    </Tag>
  )
}

const MILESTONE_STATE_COLOR: Record<ScheduleMilestone['state'], string> = {
  new: 'cyan',
  normal: 'blue',
  late: 'orange',
  cannot: 'red',
}

export const MilestoneChips = ({ milestones, poId }: { milestones: ScheduleMilestone[]; poId: string }) => {
  if (milestones.length === 0) return null
  return (
    <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
      {milestones.map((m) => {
        const lines = [
          `${m.label} · ${m.date}`,
          ...(m.commitments ?? []).map((c) => `${c.po} — ${c.pf} — ${c.wafers.toLocaleString()} wafers`),
          m.slipDays ? `Slip +${m.slipDays}d${m.cause ? ` · ${m.cause}` : ''}` : '',
        ].filter(Boolean)
        return (
          <Tooltip key={`${poId}::${m.id}`} title={<div style={{ whiteSpace: 'pre-line' }}>{lines.join('\n')}</div>}>
            <Tag color={MILESTONE_STATE_COLOR[m.state]} style={{ marginInlineEnd: 0 }}>
              ◆ {m.label}
            </Tag>
          </Tooltip>
        )
      })}
    </span>
  )
}
