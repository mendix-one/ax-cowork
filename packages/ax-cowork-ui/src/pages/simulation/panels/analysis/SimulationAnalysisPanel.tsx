import { Card, Col, Flex, Row, Space, Statistic, Tag, Tooltip, Typography } from 'antd'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { HeatBand } from './analysis.store'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const HEAT_COLORS: Record<HeatBand, string> = {
  idle: '#e6f4ff',
  safe: '#b7eb8f',
  warning: '#ffd591',
  overload: '#ff7875',
}

const HEAT_LABELS: Record<HeatBand, string> = {
  idle: '<40%',
  safe: '40–70%',
  warning: '70–85%',
  overload: '>85%',
}

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    overflow: 'auto',
    padding: token.padding,
    background: token.colorBgContainer,
  },
  card: {
    marginBottom: token.padding,
  },
  heatmapTable: {
    borderCollapse: 'separate',
    borderSpacing: 0,
    width: '100%',
    fontSize: token.fontSizeSM,
  },
  heatmapCell: {
    width: 20,
    height: 20,
    borderRadius: 3,
    margin: 1,
    display: 'inline-block',
  },
  heatGroup: {
    padding: '4px 8px',
    color: token.colorTextSecondary,
    whiteSpace: 'nowrap',
    fontWeight: 500,
  },
  bottleneckCell: {
    padding: '6px 8px',
    background: token.colorFillTertiary,
    borderRadius: token.borderRadiusSM,
    textAlign: 'center',
    fontWeight: 600,
    color: token.colorTextSecondary,
  },
  legend: {
    display: 'flex',
    gap: token.padding,
    marginTop: token.paddingXS,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 2,
    display: 'inline-block',
    marginRight: 4,
    verticalAlign: 'middle',
  },
}))

const toneToValueColor = (tone: 'positive' | 'negative' | 'neutral' | undefined) =>
  tone === 'positive' ? '#52c41a' : tone === 'negative' ? '#f5222d' : '#1677ff'

const Kpi = observer(() => {
  const { kpis } = useSimulationContext().analysis
  return (
    <Row gutter={[12, 12]}>
      {kpis.map((k) => (
        <Col key={k.id} xs={24} sm={12} md={8} lg={5} xl={5}>
          <Card size="small" hoverable>
            <Statistic
              title={
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {k.label}
                </Typography.Text>
              }
              value={k.value}
              valueStyle={{ color: toneToValueColor(k.tone), fontSize: 22 }}
              suffix={k.delta && <Typography.Text style={{ fontSize: 12, color: toneToValueColor(k.tone) }}>{k.delta}</Typography.Text>}
            />
            {k.hint && (
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                {k.hint}
              </Typography.Text>
            )}
          </Card>
        </Col>
      ))}
    </Row>
  )
})

const Heatmap = observer(() => {
  const { styles } = useStyles()
  const { heatmap, days } = useSimulationContext().analysis
  return (
    <Card
      className={styles.card}
      size="small"
      title={
        <Space>
          <AxMuiIcon icon="mdiViewGridOutline" size={16} />
          <span>Workload heatmap — Tool Group × Day</span>
        </Space>
      }
    >
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.heatmapTable}>
          <thead>
            <tr>
              <th className={styles.heatGroup} style={{ textAlign: 'left' }}>
                Tool Group
              </th>
              {days.map((d) => (
                <th key={d} className={styles.heatGroup} style={{ textAlign: 'center', width: 22 }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmap.map((row) => (
              <tr key={row.toolGroup}>
                <td className={styles.heatGroup}>{row.toolGroup}</td>
                {row.cells.map((cell, idx) => (
                  <td key={idx} style={{ textAlign: 'center' }}>
                    <Tooltip title={`${row.toolGroup} · ${days[idx]} · ${HEAT_LABELS[cell]}`}>
                      <span className={styles.heatmapCell} style={{ background: HEAT_COLORS[cell] }} />
                    </Tooltip>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.legend}>
        {(['idle', 'safe', 'warning', 'overload'] as HeatBand[]).map((b) => (
          <Typography.Text key={b} type="secondary" style={{ fontSize: 12 }}>
            <span className={styles.swatch} style={{ background: HEAT_COLORS[b] }} />
            {b} {HEAT_LABELS[b]}
          </Typography.Text>
        ))}
      </div>
    </Card>
  )
})

const Commitments = observer(() => {
  const { commitments } = useSimulationContext().analysis
  return (
    <Card
      size="small"
      title={
        <Space>
          <AxMuiIcon icon="mdiCalendarCheckOutline" size={16} />
          <span>Commitment-risk panel</span>
        </Space>
      }
    >
      <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: 'rgba(0,0,0,0.45)' }}>
            <th style={{ textAlign: 'left', padding: 4 }}>Cust</th>
            <th style={{ textAlign: 'left', padding: 4 }}>PO/M</th>
            <th style={{ textAlign: 'left', padding: 4 }}>P50</th>
            <th style={{ textAlign: 'left', padding: 4 }}>P80</th>
            <th style={{ textAlign: 'left', padding: 4 }}>P95</th>
            <th style={{ textAlign: 'left', padding: 4 }}>Slip</th>
          </tr>
        </thead>
        <tbody>
          {commitments.map((row) => (
            <tr key={row.poMilestone} style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <td style={{ padding: 4 }}>{row.customer}</td>
              <td style={{ padding: 4 }}>{row.poMilestone}</td>
              <td style={{ padding: 4 }}>{row.p50}</td>
              <td style={{ padding: 4 }}>{row.p80}</td>
              <td style={{ padding: 4 }}>{row.p95}</td>
              <td style={{ padding: 4 }}>{row.slip > 0 ? <Tag color={row.slip > 2 ? 'red' : 'orange'}>+{row.slip}d</Tag> : <Tag color="green">ok</Tag>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
})

const BottleneckTimeline = observer(() => {
  const { styles } = useStyles()
  const { bottleneckTimeline } = useSimulationContext().analysis
  return (
    <Card
      size="small"
      title={
        <Space>
          <AxMuiIcon icon="mdiTimelineClockOutline" size={16} />
          <span>Bottleneck-shift timeline</span>
        </Space>
      }
    >
      <Flex gap={6} wrap>
        {bottleneckTimeline.map((b) => (
          <div key={b.week} className={styles.bottleneckCell}>
            <div style={{ fontSize: 11 }}>{b.week}</div>
            <div>{b.group}</div>
          </div>
        ))}
      </Flex>
      <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0, fontSize: 12 }}>
        HARC dominates through wk 5, shifts to WL Fill in wk 6.
      </Typography.Paragraph>
    </Card>
  )
})

const Constraints = observer(() => {
  const { constraints } = useSimulationContext().analysis
  return (
    <Card
      size="small"
      title={
        <Space>
          <AxMuiIcon icon="mdiAlertOctagonOutline" size={16} />
          <span>Constraint validation ({constraints.length})</span>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {constraints.map((c) => (
          <Flex key={c.id} justify="space-between" align="center" gap="small" wrap>
            <Space size={6}>
              <AxMuiIcon icon="mdiAlertCircleOutline" size={14} color="#faad14" />
              <Typography.Text>{c.message}</Typography.Text>
            </Space>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              → {c.hint}
            </Typography.Text>
          </Flex>
        ))}
      </Space>
    </Card>
  )
})

export const SimulationAnalysisPanel = observer((props: MainPanelControls) => {
  const { styles } = useStyles()
  return (
    <AxDisplayPanel type="main" icon="mdiChartBar" title="Analysis View" {...props}>
      <div className={styles.root}>
        <Kpi />
        <div style={{ height: 12 }} />
        <Heatmap />
        <Row gutter={[12, 12]}>
          <Col xs={24} lg={12}>
            <Commitments />
          </Col>
          <Col xs={24} lg={12}>
            <BottleneckTimeline />
          </Col>
        </Row>
        <div style={{ height: 12 }} />
        <Constraints />
      </div>
    </AxDisplayPanel>
  )
})
