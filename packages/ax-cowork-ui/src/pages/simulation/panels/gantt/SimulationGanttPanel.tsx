import { Fragment } from 'react'
import { Button, Checkbox, DatePicker, Divider, Flex, Progress, Segmented, Space, Tag, Tooltip, Typography } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
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
    overflow: 'hidden',
  },
  bodyContent: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
  },
  sidebar: {
    width: 220,
    minWidth: 220,
    borderRight: `1px solid ${token.colorBorderSecondary}`,
    background: token.colorFillAlter,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    background: token.colorBgContainer,
    fontWeight: 600,
    fontSize: token.fontSizeSM,
    color: token.colorTextSecondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterGroup: {
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
  },
  filterGroupTitle: {
    fontSize: token.fontSizeSM,
    color: token.colorTextSecondary,
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 6,
    display: 'block',
  },
  analysis: {
    flex: '0 0 auto',
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    background: token.colorBgContainer,
    maxHeight: 220,
    overflow: 'auto',
  },
  analysisHeader: {
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    background: token.colorFillAlter,
    fontWeight: 600,
    fontSize: token.fontSizeSM,
    color: token.colorTextSecondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  analysisGrid: {
    padding: token.paddingSM,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: token.padding,
  },
  analysisCard: {
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusSM,
    padding: token.paddingSM,
    background: token.colorFillAlter,
  },
  analysisTitle: {
    fontSize: token.fontSizeSM,
    color: token.colorTextSecondary,
    fontWeight: 600,
    marginBottom: 6,
  },
  analysisRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: token.paddingXS,
    fontSize: token.fontSizeSM,
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

const utilColor = (u: number) => (u > 85 ? '#f5222d' : u > 70 ? '#faad14' : '#52c41a')

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
        {/* Group 1 — view toggles */}
        <Space size={2}>
          <Tooltip title={gantt.filterSidebarOpen ? 'Hide filter sidebar' : 'Show filter sidebar'}>
            <Button
              size="small"
              type={gantt.filterSidebarOpen ? 'primary' : 'default'}
              icon={<AxMuiIcon icon="mdiFilterMenuOutline" size={14} />}
              onClick={() => gantt.toggleFilterSidebar()}
            />
          </Tooltip>
          <Tooltip title={gantt.quickAnalysisOpen ? 'Hide quick analysis' : 'Show quick analysis'}>
            <Button
              size="small"
              type={gantt.quickAnalysisOpen ? 'primary' : 'default'}
              icon={<AxMuiIcon icon="mdiChartTimelineVariant" size={14} />}
              onClick={() => gantt.toggleQuickAnalysis()}
            />
          </Tooltip>
        </Space>
        <Divider type="vertical" style={{ margin: 0 }} />
        {/* Group 2 — view mode */}
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
        <Divider type="vertical" style={{ margin: 0 }} />
        {/* Group 3 — date range */}
        <DatePicker.RangePicker
          size="small"
          allowClear={false}
          value={[dayjs(gantt.startDate), dayjs(gantt.endDate)]}
          onChange={(values: [Dayjs | null, Dayjs | null] | null) => {
            if (!values || !values[0] || !values[1]) return
            gantt.setStartDate(values[0].format('YYYY-MM-DD'))
            gantt.setEndDate(values[1].format('YYYY-MM-DD'))
          }}
        />
      </Space>
      <Space size={4}>
        <Tooltip title="Undo">
          <Button size="small" disabled={!gantt.canUndo} icon={<AxMuiIcon icon="mdiUndo" size={14} />} onClick={() => gantt.undo()} />
        </Tooltip>
        <Tooltip title="Redo">
          <Button size="small" disabled={!gantt.canRedo} icon={<AxMuiIcon icon="mdiRedo" size={14} />} onClick={() => gantt.redo()} />
        </Tooltip>
        <Tooltip title="Reset">
          <Button size="small" icon={<AxMuiIcon icon="mdiRestore" size={14} />} onClick={() => gantt.reset()} />
        </Tooltip>
        <Tooltip title="Save">
          <Button size="small" type="primary" icon={<AxMuiIcon icon="mdiContentSaveOutline" size={14} />} onClick={() => gantt.save()}>
            Save
          </Button>
        </Tooltip>
      </Space>
    </Flex>
  )
})

const FilterSidebar = observer(() => {
  const { styles } = useStyles()
  const gantt = useSimulationContext().gantt
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span>Filters</span>
        <Button size="small" type="link" onClick={() => gantt.resetFilters()} style={{ padding: 0, height: 'auto' }}>
          Reset
        </Button>
      </div>
      <div className={styles.filterGroup}>
        <span className={styles.filterGroupTitle}>Customers</span>
        <Checkbox.Group value={gantt.customerFilters} onChange={(vals) => gantt.setCustomerFilters(vals as string[])}>
          <Space direction="vertical" size={4}>
            {gantt.allCustomers.map((c) => (
              <Checkbox key={c} value={c}>
                {c}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </div>
      <div className={styles.filterGroup}>
        <span className={styles.filterGroupTitle}>Production Orders</span>
        <Checkbox.Group value={gantt.orderFilters} onChange={(vals) => gantt.setOrderFilters(vals as string[])}>
          <Space direction="vertical" size={4}>
            {gantt.allOrders.map((o) => (
              <Checkbox key={o} value={o}>
                {o}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </div>
      <div className={styles.filterGroup}>
        <span className={styles.filterGroupTitle}>Product Families</span>
        <Checkbox.Group value={gantt.familyFilters} onChange={(vals) => gantt.setFamilyFilters(vals as string[])}>
          <Space direction="vertical" size={4}>
            {gantt.allFamilies.map((f) => (
              <Checkbox key={f} value={f}>
                {f}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </div>
    </div>
  )
})

const QuickAnalysis = observer(() => {
  const { styles } = useStyles()
  const gantt = useSimulationContext().gantt
  const violations: { id: string; msg: string }[] = [
    { id: 'v1', msg: 'HARC Etch overload days 08–10' },
    { id: 'v2', msg: 'Probe over-capacity days 01–03' },
    { id: 'v3', msg: 'PO-119 M1 slip +2d (HARC overload)' },
  ]
  return (
    <div className={styles.analysis}>
      <div className={styles.analysisHeader}>
        <span>Quick Analysis</span>
        <Button size="small" type="text" icon={<AxMuiIcon icon="mdiClose" size={12} />} onClick={() => gantt.toggleQuickAnalysis()} />
      </div>
      <div className={styles.analysisGrid}>
        <div className={styles.analysisCard}>
          <div className={styles.analysisTitle}>Shop floor — overall capacity</div>
          <Flex align="center" justify="space-between" gap="small">
            <Typography.Text style={{ fontSize: 12 }}>Utilization</Typography.Text>
            <Typography.Text strong style={{ fontSize: 12, color: utilColor(74) }}>
              74%
            </Typography.Text>
          </Flex>
          <Progress percent={74} size="small" showInfo={false} strokeColor={utilColor(74)} />
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            On-track range 60–80% · current horizon
          </Typography.Text>
        </div>
        <div className={styles.analysisCard}>
          <div className={styles.analysisTitle}>Tool-group capacities</div>
          {gantt.workloadStrip.map((w) => (
            <div key={w.toolGroup} className={styles.analysisRow}>
              <Typography.Text style={{ fontSize: 12 }}>{w.toolGroup}</Typography.Text>
              <Flex align="center" gap={6}>
                <Progress percent={w.utilization} size="small" style={{ width: 80 }} showInfo={false} strokeColor={utilColor(w.utilization)} />
                <Typography.Text style={{ fontSize: 12, color: utilColor(w.utilization) }} strong>
                  {w.utilization}%
                </Typography.Text>
              </Flex>
            </div>
          ))}
        </div>
        <div className={styles.analysisCard}>
          <div className={styles.analysisTitle}>Violations / high-load</div>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            {violations.map((v) => (
              <Flex key={v.id} align="center" gap={6}>
                <Tag color="red" style={{ margin: 0 }}>
                  ⚠
                </Tag>
                <Typography.Text style={{ fontSize: 12 }}>{v.msg}</Typography.Text>
              </Flex>
            ))}
          </Space>
        </div>
      </div>
    </div>
  )
})

export const SimulationGanttPanel = observer((props: MainPanelControls) => {
  const { styles } = useStyles()
  const simulation = useSimulationContext()
  const gantt = simulation.gantt
  const anchor = '2026-04-29'

  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title={simulation.activeSimulationPlan.name} tools={<GanttToolbar />} {...props}>
      <div className={styles.root}>
        <div className={styles.body}>
          {gantt.filterSidebarOpen && <FilterSidebar />}
          <div className={styles.bodyContent}>
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
                  {gantt.filteredOrders.map((order) => (
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
            {gantt.quickAnalysisOpen && <QuickAnalysis />}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
