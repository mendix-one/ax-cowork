import { Space, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { MOCK_ORG_DEMAND_BY_TEAM, type OrgDemandRow } from '../../data/mock-plan'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

type Row = { kind: 'violation' | 'highload'; org: OrgDemandRow; ratio: number }

const SAFE_THRESHOLD = 0.8

const classify = (o: OrgDemandRow): Row | null => {
  if (o.headcount === 0) return null
  const ratio = o.demand / o.headcount
  if (o.demand > o.headcount) return { kind: 'violation', org: o, ratio }
  if (ratio >= SAFE_THRESHOLD) return { kind: 'highload', org: o, ratio }
  return null
}

// Col #3 — flag organization nodes (teams) in two states:
//   • Violation (danger / red): planned SPM demand > available headcount.
//   • High-load (warning / orange): demand ≥ 80% of available headcount.
export const EpsSimulationQuickAnalysisViolations = observer(() => {
  const rows: Row[] = MOCK_ORG_DEMAND_BY_TEAM.map(classify).filter((r): r is Row => r !== null)
  rows.sort((a, b) => b.ratio - a.ratio)

  return (
    <div className="ax-eps-simulation_analysis_card ax-eps-simulation_analysis_card__list">
      <div className="ax-eps-simulation_analysis_card_header">
        <div className="ax-eps-simulation_analysis_card_header_title">Violations / High-Load (org nodes)</div>
        <div className="ax-eps-simulation_analysis_card_header_option">
          <button className="ax-eps-simulation_analysis_card_header_option_button" type="button" title={'Large view'}>
            <AxMuiIcon icon={'mdiArrowExpandAll'} size="1.15rem" className="ax-eps-simulation_analysis_header_option_button_icon" />
          </button>
        </div>
      </div>
      <div className="ax-eps-simulation_analysis_card_list_box">
        {rows.length === 0 ? (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            All organization nodes within safe range.
          </Typography.Text>
        ) : (
          <Space orientation="vertical" size={6} style={{ width: '100%' }}>
            {rows.map(({ kind, org, ratio }) => (
              <div key={org.label} className={`ax-eps-simulation_analysis_row ${kind}`}>
                <Space size={6}>
                  <Tag color={kind === 'violation' ? 'red' : 'orange'} style={{ margin: 0 }}>
                    {kind === 'violation' ? '⚠ Violation' : '⚠ Highload'}
                  </Tag>
                  <Typography.Text style={{ fontSize: 12 }}>{org.label}</Typography.Text>
                </Space>
                <Typography.Text style={{ fontSize: 12, color: kind === 'violation' ? '#f5222d' : '#faad14' }} strong>
                  {Math.round(ratio * 100)}%
                </Typography.Text>
              </div>
            ))}
          </Space>
        )}
      </div>
    </div>
  )
})
