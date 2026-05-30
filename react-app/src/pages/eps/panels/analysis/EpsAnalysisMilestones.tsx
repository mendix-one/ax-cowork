import { Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { calcMilestoneRows } from '../../helpers/analysis.helpers'
import type { MilestoneState } from '../../data/mock-plan'

const STATE_TAG: Record<MilestoneState, { color: string; label: string }> = {
  new: { color: 'cyan', label: 'New' },
  normal: { color: 'blue', label: 'On track' },
  late: { color: 'orange', label: 'Late' },
  cannot: { color: 'red', label: 'Cannot' },
}

// MTO milestone log — one row per (Production Family × standard offset), sorted by date.
export const EpsAnalysisMilestones = observer(() => {
  const rows = calcMilestoneRows()
  return (
    <div className="ax-eps-analysis_section">
      <div className="ax-eps-analysis_section_title">MTO milestone log</div>
      {rows.length === 0 ? (
        <Typography.Text type="secondary">No MTO milestones in scope.</Typography.Text>
      ) : (
        <div className="ax-eps-analysis_milestone_list">
          {rows.map((r) => (
            <div key={`${r.pfId}::${r.label}`} className={`ax-eps-analysis_milestone_row ax-eps-analysis_milestone_row__${r.state}`}>
              <Tag color={STATE_TAG[r.state].color} style={{ margin: 0 }}>{STATE_TAG[r.state].label}</Tag>
              <Typography.Text strong>{r.pfCode}</Typography.Text>
              <Typography.Text>{r.label}</Typography.Text>
              <Typography.Text type="secondary" style={{ marginLeft: 'auto' }}>{r.date}</Typography.Text>
              {r.slipDays > 0 && <Typography.Text type="danger">+{r.slipDays}d</Typography.Text>}
              {r.cause && <Typography.Text type="secondary">· {r.cause}</Typography.Text>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
