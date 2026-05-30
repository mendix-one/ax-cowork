import { Table, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { calcFamilyProcessRows } from '../../helpers/analysis.helpers'
import { MOCK_PROCESS_INDEX } from '../../data/mock-plan'

// Production Family × Engineering Stage matrix. Each row is a PF; columns are stages with the SPM demand
// contributed by tasks routed through that stage.
export const EpsAnalysisFamilyTech = observer(() => {
  const rows = calcFamilyProcessRows()
  // Build column set — union of all stages across families.
  const stages = Array.from(new Set(rows.flatMap((r) => r.stages.map((s) => s.stage)))).sort()

  return (
    <div className="ax-eps-analysis_section">
      <div className="ax-eps-analysis_section_title">Family × Process Stage matrix</div>
      <Table
        rowKey="pfId"
        size="small"
        pagination={false}
        dataSource={rows}
        columns={[
          { title: 'PF', dataIndex: 'pfCode', width: 140 },
          { title: 'Name', dataIndex: 'pfName' },
          ...stages.map((s) => ({
            title: MOCK_PROCESS_INDEX[s]?.code ?? s,
            key: s,
            align: 'right' as const,
            width: 110,
            render: (_v: unknown, row: typeof rows[number]) => {
              const found = row.stages.find((x) => x.stage === s)
              return found ? <Typography.Text strong>{found.spm}</Typography.Text> : '—'
            },
          })),
          { title: 'Total SPM', dataIndex: 'totalSpm', align: 'right' as const, width: 120, render: (v: number) => <Typography.Text strong>{v}</Typography.Text> },
        ]}
      />
    </div>
  )
})
