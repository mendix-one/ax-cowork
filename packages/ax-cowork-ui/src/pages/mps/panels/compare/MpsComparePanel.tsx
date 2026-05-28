import { Button, Select, Space, Tag, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import { AxDisplayPanel, type SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Diff helper — formats a delta with a sign + tone color. `betterWhen` says whether higher or lower is good.
const fmtDelta = (a: number, b: number, betterWhen: 'higher' | 'lower' = 'higher'): { text: string; tone: 'positive' | 'negative' | 'neutral' } => {
  const delta = b - a
  if (delta === 0) return { text: '±0', tone: 'neutral' }
  const sign = delta > 0 ? '+' : ''
  const tone = (delta > 0 && betterWhen === 'higher') || (delta < 0 && betterWhen === 'lower') ? 'positive' : 'negative'
  return { text: `${sign}${delta.toLocaleString()}`, tone }
}

const TONE_COLOR: Record<'positive' | 'negative' | 'neutral', string> = {
  positive: 'green',
  negative: 'red',
  neutral: 'default',
}

export const MpsComparePanel = observer((props: SubPanelControls) => {
  const sim = useMpsContext()
  const compare = sim.compare
  const planOptions = sim.mpsPlans.map((p) => ({ value: p.id, label: p.name }))
  const left = compare.leftSnapshot
  const right = compare.rightSnapshot

  // Diff cards: committed (lower=better when cost is constraint, but planner usually wants higher),
  // out (higher better), at-risk count (lower better), end date (lower better).
  const dCommitted = fmtDelta(left.committed, right.committed, 'higher')
  const dOut = fmtDelta(left.out, right.out, 'higher')
  const dAtRisk = fmtDelta(left.atRiskPoCount, right.atRiskPoCount, 'lower')
  // End-date delta in days, computed from ISO strings.
  const endDeltaDays = Math.round((new Date(right.endDate).getTime() - new Date(left.endDate).getTime()) / (24 * 60 * 60 * 1000))
  const dEndTone: 'positive' | 'negative' | 'neutral' = endDeltaDays === 0 ? 'neutral' : endDeltaDays < 0 ? 'positive' : 'negative'

  return (
    <AxDisplayPanel type="sub" icon="mdiCompareHorizontal" title="Compare plans" {...props}>
      <div className="ax-compare_root">
        {/* Plan selectors */}
        <div className="ax-compare_selectors">
          <div className="ax-compare_selector">
            <Typography.Text type="secondary" className="text-sm">
              Plan A · baseline
            </Typography.Text>
            <Select size="small" value={compare.leftPlanId} onChange={(v) => compare.setLeftPlan(v)} options={planOptions} style={{ width: '100%' }} />
          </div>
          <AxMuiIcon icon="mdiSwapHorizontalVariant" size={18} className="ax-compare_selector_arrow" />
          <div className="ax-compare_selector">
            <Typography.Text type="secondary" className="text-sm">
              Plan B · candidate
            </Typography.Text>
            <Select size="small" value={compare.rightPlanId} onChange={(v) => compare.setRightPlan(v)} options={planOptions} style={{ width: '100%' }} />
          </div>
        </div>

        {/* Diff KPI strip */}
        <div className="ax-compare_kpis">
          <div className="ax-compare_kpi">
            <div className="ax-compare_kpi_label">Committed</div>
            <div className="ax-compare_kpi_value">{right.committed.toLocaleString()}</div>
            <Tooltip title={`Plan A: ${left.committed.toLocaleString()}`}>
              <Tag color={TONE_COLOR[dCommitted.tone]} style={{ margin: 0 }}>
                {dCommitted.text}
              </Tag>
            </Tooltip>
          </div>
          <div className="ax-compare_kpi">
            <div className="ax-compare_kpi_label">Wafers out</div>
            <div className="ax-compare_kpi_value">{right.out.toLocaleString()}</div>
            <Tooltip title={`Plan A: ${left.out.toLocaleString()}`}>
              <Tag color={TONE_COLOR[dOut.tone]} style={{ margin: 0 }}>
                {dOut.text}
              </Tag>
            </Tooltip>
          </div>
          <div className="ax-compare_kpi">
            <div className="ax-compare_kpi_label">At-risk POs</div>
            <div className="ax-compare_kpi_value">{right.atRiskPoCount}</div>
            <Tooltip title={`Plan A: ${left.atRiskPoCount}`}>
              <Tag color={TONE_COLOR[dAtRisk.tone]} style={{ margin: 0 }}>
                {dAtRisk.text}
              </Tag>
            </Tooltip>
          </div>
          <div className="ax-compare_kpi">
            <div className="ax-compare_kpi_label">Plan end</div>
            <div className="ax-compare_kpi_value">{right.endDate.slice(5)}</div>
            <Tooltip title={`Plan A: ${left.endDate.slice(5)}`}>
              <Tag color={TONE_COLOR[dEndTone]} style={{ margin: 0 }}>
                {endDeltaDays === 0 ? '±0d' : `${endDeltaDays > 0 ? '+' : ''}${endDeltaDays}d`}
              </Tag>
            </Tooltip>
          </div>
          <div className="ax-compare_kpi">
            <div className="ax-compare_kpi_label">Bottleneck</div>
            <div className="ax-compare_kpi_value ax-compare_kpi_value__small">{right.bottleneckGroup}</div>
            <Tag color={right.bottleneckGroup === left.bottleneckGroup ? 'default' : 'blue'} style={{ margin: 0 }}>
              {right.bottleneckGroup === left.bottleneckGroup ? 'unchanged' : `was ${left.bottleneckGroup}`}
            </Tag>
          </div>
        </div>

        {/* Diff list */}
        <div className="ax-analysis_section">
          <div className="ax-analysis_section_header">
            <div className="ax-analysis_section_header_title">
              <AxMuiIcon icon="mdiFormatListBulleted" size={18} />
              <span>Changes Plan A → Plan B ({compare.diffs.length})</span>
            </div>
          </div>
          <div className="ax-analysis_section_body">
            <table className="ax-analysis_table">
              <thead>
                <tr>
                  <th>Change</th>
                  <th style={{ width: 140 }}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {compare.diffs.map((d) => (
                  <tr key={d.id}>
                    <td>{d.text}</td>
                    <td>
                      <Tag color={d.weight < 0 ? 'green' : d.weight > 0 ? 'red' : 'default'} style={{ margin: 0 }}>
                        {d.reason}
                      </Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer actions */}
        <Space style={{ padding: '0 12px 12px' }}>
          <Button size="small">Discard Plan B</Button>
          <Button size="small">Edit Plan B</Button>
          <Button type="primary" size="small" onClick={() => sim.setActiveMpsPlan(compare.rightPlanId)}>
            Promote Plan B to active
          </Button>
        </Space>
      </div>
    </AxDisplayPanel>
  )
})
