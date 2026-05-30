import { Empty, Segmented, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { allConstraints, constraintsForCell } from '../../helpers/capacity.helpers'
import { AxMuiIcon, type MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'

const SEV_COLOR: Record<'critical' | 'warning' | 'info', string> = {
  critical: 'red',
  warning: 'orange',
  info: 'blue',
}
const SEV_ICON: Record<'critical' | 'warning' | 'info', MdiIconName> = {
  critical: 'mdiAlertOctagonOutline',
  warning: 'mdiAlertOutline',
  info: 'mdiInformationOutline',
}

export const EpsCapacityConstraints = observer(() => {
  const store = useEpsContext().capacity
  const entry = store.selectedCellEntry
  const rows = store.constraintsScope === 'all' ? allConstraints() : entry ? constraintsForCell(entry.cell.id) : []

  return (
    <div className="ax-eps-capacity_constraints">
      <div className="ax-eps-capacity_constraints_header">
        <Typography.Text strong>Resource constraints</Typography.Text>
        <Segmented
          size="small"
          value={store.constraintsScope}
          onChange={(v) => store.setConstraintsScope(v as 'node' | 'all')}
          options={[
            { label: 'Selected', value: 'node' },
            { label: 'All org', value: 'all' },
          ]}
        />
      </div>
      <div className="ax-eps-capacity_constraints_body">
        {rows.length === 0 ? (
          <Empty description="No active resource constraints" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          rows.map((c) => (
            <div key={c.id} className={`ax-eps-capacity_constraint ax-eps-capacity_constraint__${c.severity}`}>
              <AxMuiIcon icon={SEV_ICON[c.severity]} size={14} />
              <Tag color={SEV_COLOR[c.severity]} style={{ margin: 0 }}>
                {c.severity.toUpperCase()}
              </Tag>
              <span className="ax-eps-capacity_constraint_cell">{c.cellName}</span>
              <span className="ax-eps-capacity_constraint_skill">{c.skill}</span>
              <span className="ax-eps-capacity_constraint_title">{c.title}</span>
              <span className="ax-eps-capacity_constraint_detail">{c.detail}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
})
