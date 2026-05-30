import { Tag, Tooltip } from 'antd'
import type { ProductionOrder, ScheduleClass } from '../../data/mock-plan'
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
  'at-risk': 'warning',
  slipped: 'error',
}

// Display label per status. Lowercase risk-bearing values from the mock data are uppercased so the chips read
// consistently across the table (RUNNING / AT-RISK / SLIPPED) — matches the summary KPI wording.
const STATUS_LABEL: Record<PoStatus, string> = {
  READY: 'READY',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  'ON HOLD': 'ON HOLD',
  'at-risk': 'AT-RISK',
  slipped: 'SLIPPED',
}

export const StatusChip = ({ status }: { status: PoStatus | undefined }) => {
  if (!status) return null
  return (
    <Tag color={STATUS_COLOR[status]} style={{ marginInlineEnd: 0, fontWeight: 600 }}>
      {STATUS_LABEL[status]}
    </Tag>
  )
}

// Schedule-lineage state chip — colors mirror axSchedule (Indigo/Blue/Teal) so the chip in this column
// decodes against the toolbar legend, simulation bars, analysis charts. 'exclude' is a PO-table-only state
// for items the planner has unchecked in the adjustment sidebar — shown as a muted Blue-Grey ghost so it
// reads as "still in the dataset, not in the current schedule".
type ScheduleState = ScheduleClass | 'exclude'
const STATE_STYLE: Record<ScheduleState, { label: string; bg: string; color: string }> = {
  fixed: { label: 'Fixed', bg: '#3f51b5', color: '#ffffff' }, // axSchedule.fixed.bar
  changes: { label: 'Changes', bg: '#1565c0', color: '#ffffff' }, // axSchedule.changes.bar
  new: { label: 'New', bg: '#00897b', color: '#ffffff' }, // axSchedule.new.bar
  exclude: { label: 'Exclude', bg: '#cfd8dc', color: '#37474f' }, // axSchedule.ghost.bar — neutral
}

export const StateChip = ({ state }: { state: ScheduleState | undefined }) => {
  if (!state) return null
  const style = STATE_STYLE[state]
  return <Tag style={{ marginInlineEnd: 0, background: style.bg, color: style.color, border: 'none', fontWeight: 500 }}>{style.label}</Tag>
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
