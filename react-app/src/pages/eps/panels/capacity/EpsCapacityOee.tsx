import { Empty, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { calcHeadcountComposition } from '../../helpers/capacity.helpers'

// Headcount Composition card — for the selected Cell, the skill-group breakdown + shares.
// (For non-cell selections we show an em-dash placeholder.)
export const EpsCapacityOee = observer(() => {
  const store = useEpsContext().capacity
  const entry = store.selectedCellEntry
  if (!entry) {
    return <Empty description="Select a Cell to inspect skill composition" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }
  const comp = calcHeadcountComposition(entry.cell)
  return (
    <div className="ax-eps-capacity_oee">
      <div className="ax-eps-capacity_oee_header">
        <Typography.Text strong>{entry.cell.name}</Typography.Text>
        <Tag color="blue" style={{ margin: 0 }}>
          {comp.totalHeadcount} HC
        </Tag>
      </div>
      <div className="ax-eps-capacity_oee_body">
        {comp.skills.map((s) => (
          <div key={s.skill} className="ax-eps-capacity_oee_row">
            <span className="ax-eps-capacity_oee_row_skill">{s.skill}</span>
            <div className="ax-eps-capacity_oee_row_bar">
              <div className="ax-eps-capacity_oee_row_bar_fill" style={{ width: `${Math.round(s.share * 100)}%` }} />
            </div>
            <span className="ax-eps-capacity_oee_row_count">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
})
