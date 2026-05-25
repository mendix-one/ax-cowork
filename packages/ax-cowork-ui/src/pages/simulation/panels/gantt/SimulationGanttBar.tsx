import { Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import type { LotStatus } from '../../data/mock-plan'
import { DAY_WIDTH, STATUS_COLOR, dayOffset } from './gantt-styles'

export type GanttBarProps = {
  variant: 'po' | 'family' | 'batch'
  start: string
  durationDays: number
  status: LotStatus
  label?: string
  anchor: string
  note?: string
  tooltip?: string
}

export const SimulationGanttBar = observer(({ variant, start, durationDays, status, label, anchor, note, tooltip }: GanttBarProps) => {
  const offset = Math.max(0, dayOffset(start, anchor))
  const variantClass = `is-${variant}`
  return (
    <Tooltip title={tooltip ?? `${label ?? ''} · ${start} +${durationDays}d${note ? ' · ' + note : ''}`}>
      <div
        className={`ax-gantt_bar ${variantClass}`}
        style={{
          left: offset * DAY_WIDTH + 2,
          width: Math.max(4, durationDays * DAY_WIDTH - 4),
          background: STATUS_COLOR[status],
        }}
      >
        {variant !== 'po' && label && (
          <Typography.Text style={{ color: 'inherit', fontSize: 11 }} ellipsis>
            {label}
          </Typography.Text>
        )}
        {note && (
          <Typography.Text style={{ color: 'inherit', fontSize: 11, marginInlineStart: 6, opacity: 0.9 }} ellipsis>
            {note}
          </Typography.Text>
        )}
      </div>
    </Tooltip>
  )
})
