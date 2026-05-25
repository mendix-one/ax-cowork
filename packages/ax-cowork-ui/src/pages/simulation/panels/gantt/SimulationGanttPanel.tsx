import { Fragment } from 'react'
import { Button, Flex, Segmented, Select, Space, Tag, Tooltip, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { HORIZON_LABELS, type LotStatus, type ProductionOrder, type ScheduleFamily, type ScheduleStep, type ScheduleMilestone } from '../../data/mock-plan'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const STATUS_COLOR: Record<LotStatus, string> = {
  'on-track': '#1677ff',
  'at-risk': '#faad14',
  slipped: '#f5222d',
  'hot-lot': '#722ed1',
}

const DAY_WIDTH = 64

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: token.colorBgContainer,
  },
  body: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
  },
  table: {
    width: 'max-content',
    minWidth: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    fontSize: token.fontSize,
  },
  headerRow: {
    background: token.colorFillAlter,
  },
  headerCell: {
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    fontWeight: 600,
    color: token.colorTextSecondary,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    fontSize: token.fontSizeSM,
    background: token.colorFillAlter,
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
  headerLeft: {
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    fontWeight: 600,
    color: token.colorTextSecondary,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    background: token.colorFillAlter,
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 3,
    fontSize: token.fontSizeSM,
    textAlign: 'left',
  },
  taskCell: {
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderBottom: `1px solid ${token.colorSplit}`,
    background: token.colorBgContainer,
    position: 'sticky',
    left: 0,
    zIndex: 1,
    whiteSpace: 'nowrap',
  },
  numCell: {
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderBottom: `1px solid ${token.colorSplit}`,
    textAlign: 'center',
    fontSize: 12,
    background: token.colorBgContainer,
    whiteSpace: 'nowrap',
  },
  dayCell: {
    borderBottom: `1px solid ${token.colorSplit}`,
    borderRight: `1px dashed ${token.colorSplit}`,
    minWidth: DAY_WIDTH,
    width: DAY_WIDTH,
    position: 'relative',
    height: 36,
    padding: 0,
  },
  bar: {
    position: 'absolute',
    top: 8,
    height: 18,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    paddingInline: 6,
    color: token.colorWhite,
    fontSize: token.fontSizeSM,
    fontWeight: 500,
    cursor: 'pointer',
    boxShadow: token.boxShadowTertiary,
    overflow: 'hidden',
  },
  poRow: {
    background: `${token.colorFillTertiary} !important`,
    fontWeight: 600,
  },
  familyRow: {
    background: `${token.colorFillQuaternary} !important`,
  },
  workloadStrip: {
    flex: '0 0 auto',
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    background: token.colorFillAlter,
    display: 'flex',
    gap: token.padding,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  workloadItem: {
    display: 'flex',
    alignItems: 'center',
    gap: token.paddingXXS,
  },
  workloadBar: {
    width: 80,
    height: 8,
    borderRadius: 2,
    background: token.colorFillSecondary,
    overflow: 'hidden',
  },
  milestone: {
    position: 'absolute',
    top: 8,
    width: 14,
    height: 14,
    transform: 'rotate(45deg)',
    background: token.colorPrimary,
    boxShadow: token.boxShadowTertiary,
  },
  toggleIcon: {
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
  },
}))

const dayOffset = (start: string, anchor: string): number => {
  const a = new Date(anchor).getTime()
  const b = new Date(start).getTime()
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

const Bar = observer(
  ({ start, duration, status, label, anchor, note }: { start: string; duration: number; status: LotStatus; label?: string; anchor: string; note?: string }) => {
    const { styles } = useStyles()
    const offset = dayOffset(start, anchor)
    return (
      <Tooltip title={`${label ?? ''} · ${start} +${duration}d${note ? ' · ' + note : ''}`}>
        <div
          className={styles.bar}
          style={{
            left: offset * DAY_WIDTH + 4,
            width: Math.max(0, duration * DAY_WIDTH - 8),
            background: STATUS_COLOR[status],
          }}
        >
          {label && (
            <Typography.Text style={{ color: 'inherit', fontSize: 11 }} ellipsis>
              {label}
            </Typography.Text>
          )}
          {note && (
            <Typography.Text style={{ color: 'inherit', fontSize: 11, marginInlineStart: 6, opacity: 0.85 }} ellipsis>
              {note}
            </Typography.Text>
          )}
        </div>
      </Tooltip>
    )
  },
)

const OrderRow = observer(({ order }: { order: ProductionOrder }) => {
  const { styles, cx } = useStyles()
  const gantt = useSimulationContext().gantt
  const expanded = gantt.isExpanded(order.id)
  return (
    <tr>
      <td className={cx(styles.taskCell, styles.poRow)} style={{ paddingInlineStart: 6 }}>
        <Space size={6} align="center">
          <span className={styles.toggleIcon} onClick={() => gantt.toggleExpanded(order.id)}>
            <AxMuiIcon icon={expanded ? 'mdiChevronDown' : 'mdiChevronRight'} size={14} />
          </span>
          <Typography.Text strong>{order.id}</Typography.Text>
          <Typography.Text type="secondary">({order.customer})</Typography.Text>
          {order.hotLot && <Tag color="purple">★ HOT</Tag>}
          <Tag color={order.status === 'slipped' ? 'red' : order.status === 'at-risk' ? 'orange' : 'blue'}>{order.priority}</Tag>
        </Space>
      </td>
      <td className={cx(styles.numCell, styles.poRow)}>{order.waferStart}</td>
      <td className={cx(styles.numCell, styles.poRow)}>—</td>
      {HORIZON_LABELS.map((_, idx) => (
        <td key={idx} className={cx(styles.dayCell, styles.poRow)} />
      ))}
    </tr>
  )
})

const FamilyRow = observer(({ family, anchor }: { family: ScheduleFamily; anchor: string }) => {
  const { styles, cx } = useStyles()
  return (
    <tr>
      <td className={cx(styles.taskCell, styles.familyRow)} style={{ paddingInlineStart: 24 }}>
        <Typography.Text>{family.label}</Typography.Text>
      </td>
      <td className={cx(styles.numCell, styles.familyRow)}>{family.start}</td>
      <td className={cx(styles.numCell, styles.familyRow)}>{family.durationDays}</td>
      {HORIZON_LABELS.map((_, idx) => (
        <td key={idx} className={cx(styles.dayCell, styles.familyRow)}>
          {idx === 0 && <Bar start={family.start} duration={family.durationDays} status={family.status} anchor={anchor} label={family.label} />}
        </td>
      ))}
    </tr>
  )
})

const StepRow = observer(({ step, anchor }: { step: ScheduleStep; anchor: string }) => {
  const { styles } = useStyles()
  return (
    <tr>
      <td className={styles.taskCell} style={{ paddingInlineStart: 44 }}>
        <Typography.Text style={{ fontSize: 12 }}>{step.label}</Typography.Text>
      </td>
      <td className={styles.numCell}>{step.start}</td>
      <td className={styles.numCell}>{step.durationDays}</td>
      {HORIZON_LABELS.map((_, idx) => (
        <td key={idx} className={styles.dayCell}>
          {idx === 0 && <Bar start={step.start} duration={step.durationDays} status={step.status} label={step.label} note={step.note} anchor={anchor} />}
        </td>
      ))}
    </tr>
  )
})

const MilestoneRow = observer(({ m, anchor }: { m: ScheduleMilestone; anchor: string }) => {
  const { styles } = useStyles()
  return (
    <tr>
      <td className={styles.taskCell} style={{ paddingInlineStart: 44 }}>
        <Typography.Text style={{ fontSize: 12 }}>◆ {m.label}</Typography.Text>
      </td>
      <td className={styles.numCell}>{m.date}</td>
      <td className={styles.numCell}>{m.slipDays ? <Tag color="red">+{m.slipDays}d</Tag> : <Tag color="green">on time</Tag>}</td>
      {HORIZON_LABELS.map((_, idx) => (
        <td key={idx} className={styles.dayCell}>
          {idx === 0 && (
            <Tooltip title={`${m.label} · ${m.date}${m.cause ? ' · ' + m.cause : ''}`}>
              <div className={styles.milestone} style={{ left: dayOffset(m.date, anchor) * DAY_WIDTH + 4 }} />
            </Tooltip>
          )}
        </td>
      ))}
    </tr>
  )
})

const GanttToolbar = observer(() => {
  const gantt = useSimulationContext().gantt
  return (
    <Flex align="center" justify="space-between" gap="small" style={{ width: '100%' }}>
      <Space size={8}>
        <Select size="small" value="apr-2026" style={{ width: 140 }} options={[{ value: 'apr-2026', label: 'Apr 2026' }]} />
        <Segmented
          size="small"
          value={gantt.horizon}
          onChange={(v) => gantt.setHorizon(v as 'day' | 'week' | 'month')}
          options={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
          ]}
        />
        <Select
          size="small"
          value={gantt.filter}
          onChange={(v) => gantt.setFilter(v)}
          style={{ width: 120 }}
          options={[
            { value: 'all', label: 'All' },
            { value: 'at-risk', label: 'At-risk' },
            { value: 'hot-lot', label: 'Hot lots' },
          ]}
        />
      </Space>
      <Space size={6}>
        <Button size="small" icon={<AxMuiIcon icon="mdiFilterOutline" size={14} />}>
          Filter
        </Button>
        <Button size="small" type="primary" icon={<AxMuiIcon icon="mdiPlus" size={14} />}>
          Add override
        </Button>
      </Space>
    </Flex>
  )
})

const utilColor = (u: number) => (u > 85 ? '#f5222d' : u > 70 ? '#faad14' : '#52c41a')

export const SimulationGanttPanel = observer((props: MainPanelControls) => {
  const { styles } = useStyles()
  const simulation = useSimulationContext()
  const gantt = simulation.gantt
  const anchor = '2026-04-29'

  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title={`Gantt — ${simulation.activeSimulationPlan.name}`} tools={<GanttToolbar />} {...props}>
      <div className={styles.root}>
        <div className={styles.body}>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={styles.headerLeft} style={{ minWidth: 240 }}>
                    Task / Lot
                  </th>
                  <th className={styles.headerCell} style={{ width: 96, minWidth: 96 }}>
                    Start
                  </th>
                  <th className={styles.headerCell} style={{ width: 64, minWidth: 64 }}>
                    Days
                  </th>
                  {gantt.horizonLabels.map((label) => (
                    <th key={label} className={styles.headerCell} style={{ minWidth: DAY_WIDTH }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gantt.orders.map((order) => (
                  <Fragment key={order.id}>
                    <OrderRow order={order} />
                    {gantt.isExpanded(order.id) && (
                      <>
                        {order.schedule.map((family) => (
                          <Fragment key={family.id}>
                            <FamilyRow family={family} anchor={anchor} />
                            {family.steps.map((step) => (
                              <StepRow key={step.id} step={step} anchor={anchor} />
                            ))}
                          </Fragment>
                        ))}
                        {order.milestones.map((m) => (
                          <MilestoneRow key={m.id} m={m} anchor={anchor} />
                        ))}
                      </>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.workloadStrip}>
            <Typography.Text strong style={{ fontSize: 12 }}>
              Workload (top 3)
            </Typography.Text>
            {gantt.workloadStrip.map((w) => (
              <div key={w.toolGroup} className={styles.workloadItem}>
                <Typography.Text style={{ fontSize: 12 }}>{w.toolGroup}</Typography.Text>
                <div className={styles.workloadBar}>
                  <div style={{ width: `${w.utilization}%`, height: '100%', background: utilColor(w.utilization) }} />
                </div>
                <Typography.Text style={{ fontSize: 12, color: utilColor(w.utilization) }} strong>
                  {w.utilization}%
                </Typography.Text>
                {w.utilization > 85 && <Tag color="red">⚠</Tag>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
