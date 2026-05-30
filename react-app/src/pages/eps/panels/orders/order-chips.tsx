import { Tag, Tooltip } from 'antd'
import type { MtoMilestone, ScheduleClass, SubTaskKind } from '../../data/mock-plan'

// Schedule-lineage state chip — colors mirror axSchedule (Indigo/Blue/Teal). 'exclude' is a soft
// Blue-Grey ghost for items the planner has unchecked in the Adjustment sidebar.
type ScheduleState = ScheduleClass | 'exclude'
const STATE_STYLE: Record<ScheduleState, { label: string; bg: string; color: string }> = {
  fixed: { label: 'Fixed', bg: '#3f51b5', color: '#ffffff' },
  changes: { label: 'Changes', bg: '#1565c0', color: '#ffffff' },
  new: { label: 'New', bg: '#00897b', color: '#ffffff' },
  exclude: { label: 'Exclude', bg: '#cfd8dc', color: '#37474f' },
}

export const StateChip = ({ state }: { state: ScheduleState | undefined }) => {
  if (!state) return null
  const style = STATE_STYLE[state]
  return <Tag style={{ marginInlineEnd: 0, background: style.bg, color: style.color, border: 'none', fontWeight: 500 }}>{style.label}</Tag>
}

// Sub-Task kind chip — Certification / RF / Other.
const SUBTASK_COLOR: Record<SubTaskKind, string> = {
  Certification: 'purple',
  RF: 'cyan',
  Other: 'default',
}
export const SubTaskKindChip = ({ kind }: { kind: SubTaskKind | undefined }) => {
  if (!kind) return null
  return (
    <Tag color={SUBTASK_COLOR[kind]} style={{ marginInlineEnd: 0 }}>
      {kind}
    </Tag>
  )
}

const MILESTONE_STATE_COLOR: Record<MtoMilestone['state'], string> = {
  new: 'cyan',
  normal: 'blue',
  late: 'orange',
  cannot: 'red',
}

// MTO milestone chips for a Production Family — shown in the info panel detail.
export const MilestoneChips = ({ milestones, pfId }: { milestones: MtoMilestone[]; pfId: string }) => {
  if (milestones.length === 0) return null
  return (
    <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
      {milestones.map((m) => {
        const lines = [`${m.label} · ${m.date}`, m.cause ? `Cause · ${m.cause}` : '', m.slipDays ? `Slip +${m.slipDays}d` : ''].filter(Boolean)
        return (
          <Tooltip key={`${pfId}::${m.id}`} title={<div style={{ whiteSpace: 'pre-line' }}>{lines.join('\n')}</div>}>
            <Tag color={MILESTONE_STATE_COLOR[m.state]} style={{ marginInlineEnd: 0 }}>
              ◆ {m.label}
            </Tag>
          </Tooltip>
        )
      })}
    </span>
  )
}
