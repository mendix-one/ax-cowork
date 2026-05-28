import { Space, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { TOOL_GROUP_CAPACITIES, type ToolGroupCapacity } from '../../data/mock-plan'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

type Row = { kind: 'violation' | 'highload'; group: ToolGroupCapacity; ratio: number }

const SAFE_THRESHOLD = 0.8

const classify = (g: ToolGroupCapacity): Row | null => {
  const ratio = g.used / g.total
  if (g.used > g.total) return { kind: 'violation', group: g, ratio }
  if (ratio >= SAFE_THRESHOLD) return { kind: 'highload', group: g, ratio }
  return null
}

// Col #3 — flag tool groups in two states:
//   • Violation (danger / red): used > total
//   • High-load (warning / orange): used ≥ 80% of total
export const MpsSimulationQuickAnalysisViolations = observer(() => {
  const rows: Row[] = TOOL_GROUP_CAPACITIES.map(classify).filter((r): r is Row => r !== null)
  rows.sort((a, b) => b.ratio - a.ratio)

  return (
    <div className="ax-simulation_analysis_card ax-simulation_analysis_card__list">
      <div className="ax-simulation_analysis_card_header">
        <div className="ax-simulation_analysis_card_header_title">Violations / High-Load</div>
        <div className="ax-simulation_analysis_card_header_option">
          <button className="ax-simulation_analysis_card_header_option_button" type="button" title={'Large view'}>
            <AxMuiIcon icon={'mdiArrowExpandAll'} size="1.15rem" className="ax-simulation_analysis_header_option_button_icon" />
          </button>
        </div>
      </div>
      <div className="ax-simulation_analysis_card_list_box">
        {rows.length === 0 ? (
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            All tool groups within safe range.
          </Typography.Text>
        ) : (
          <Space vertical size={6} style={{ width: '100%' }}>
            {rows.map(({ kind, group, ratio }) => (
              <div key={group.name} className={`ax-simulation_analysis_row ${kind}`}>
                <Space size={6}>
                  <Tag color={kind === 'violation' ? 'red' : 'orange'} style={{ margin: 0 }}>
                    {kind === 'violation' ? '⚠ Violation' : '⚠ Highload'}
                  </Tag>
                  <Typography.Text style={{ fontSize: 12 }}>{group.name}</Typography.Text>
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
