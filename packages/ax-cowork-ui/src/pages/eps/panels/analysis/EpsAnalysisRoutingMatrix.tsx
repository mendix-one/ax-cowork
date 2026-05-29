import { Table, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import {
  MOCK_PROCESS_INDEX,
  MOCK_PROCESS_NODES,
  MOCK_PRODUCTION_FAMILIES,
  type ProductionFamily,
} from '../../data/mock-plan'

// Family × Activity matrix. Each cell shows the SPM contributed by tasks in that PF whose processPath
// ends at the given activity (leaf node). Useful for spotting which activities concentrate demand.
const ACTIVITY_NODES = MOCK_PROCESS_NODES.filter((p) => p.level === 'activity')

const spmForFamilyActivity = (pf: ProductionFamily, activityId: string): number => {
  let s = 0
  for (const t of pf.tasks) {
    if (t.processPath.includes(activityId)) {
      s += t.spm
      for (const sub of t.subTasks) s += sub.spm
    }
  }
  return s
}

export const EpsAnalysisRoutingMatrix = observer(() => {
  const rows = MOCK_PRODUCTION_FAMILIES
  return (
    <div className="ax-eps-analysis_section">
      <div className="ax-eps-analysis_section_title">Family × Activity routing matrix</div>
      <Table
        rowKey="id"
        size="small"
        pagination={false}
        dataSource={rows}
        scroll={{ x: true }}
        columns={[
          { title: 'PF', dataIndex: 'code', width: 140, fixed: 'left' },
          ...ACTIVITY_NODES.map((a) => ({
            title: MOCK_PROCESS_INDEX[a.id]?.code ?? a.code,
            key: a.id,
            align: 'right' as const,
            width: 100,
            render: (_v: unknown, row: ProductionFamily) => {
              const s = spmForFamilyActivity(row, a.id)
              return s > 0 ? <Typography.Text strong>{s}</Typography.Text> : '—'
            },
          })),
        ]}
      />
    </div>
  )
})
