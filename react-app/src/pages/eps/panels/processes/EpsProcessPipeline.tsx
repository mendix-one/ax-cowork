import { Empty, Table, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { MOCK_PROCESS_INDEX, type ProcessNode } from '../../data/mock-plan'
import { ancestorPath, childrenOf, descendantsOf, familiesUsingNode, subtreeBaselineSpm } from '../../helpers/process.helpers'

const LEVEL_COLOR: Record<ProcessNode['level'], string> = {
  stage: 'purple',
  block: 'geekblue',
  function: 'blue',
  activity: 'cyan',
}

export const EpsProcessPipeline = observer(() => {
  const sim = useEpsContext()
  const node = MOCK_PROCESS_INDEX[sim.process.selectedNodeId]

  if (!node) return <Empty description="Select a process node" image={Empty.PRESENTED_IMAGE_SIMPLE} />

  const path = ancestorPath(node.id)
  const children = childrenOf(node.id)
  const activities = descendantsOf(node.id).filter((n) => n.level === 'activity')
  if (node.level === 'activity') activities.unshift(node)
  const usage = familiesUsingNode(node.id)

  return (
    <div className="ax-eps-process_pipeline">
      <div className="ax-eps-process_pipeline_header">
        {path.map((p, i) => (
          <span key={p.id} className="ax-eps-process_pipeline_crumb">
            <Tag color={LEVEL_COLOR[p.level]} style={{ margin: 0 }}>
              {p.level}
            </Tag>
            <span>{p.name}</span>
            {i < path.length - 1 && <span className="ax-eps-process_pipeline_crumb_sep">›</span>}
          </span>
        ))}
        <Tag color="default" style={{ margin: 0, marginLeft: 'auto' }}>
          {subtreeBaselineSpm(node.id)} P/M baseline
        </Tag>
      </div>

      {children.length > 0 && (
        <div className="ax-eps-process_pipeline_stages">
          {children.map((c) => (
            <button key={c.id} type="button" className="ax-eps-process_pipeline_step" onClick={() => sim.process.selectNode(c.id)}>
              <div className="ax-eps-process_pipeline_step_top">
                <span className="ax-eps-process_pipeline_step_name">{c.name}</span>
                <Tag color={LEVEL_COLOR[c.level]} style={{ margin: 0 }}>
                  {c.level}
                </Tag>
              </div>
              <Typography.Text type="secondary" className="text-sm">
                {subtreeBaselineSpm(c.id)} P/M
              </Typography.Text>
            </button>
          ))}
        </div>
      )}

      <div className="ax-eps-process_pipeline_section">
        <div className="ax-eps-process_pipeline_section_title">Activities in subtree ({activities.length})</div>
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          dataSource={activities}
          columns={[
            { title: 'Code', dataIndex: 'code', width: 120 },
            { title: 'Name', dataIndex: 'name' },
            {
              title: 'Path',
              key: 'path',
              render: (_v, row) => ancestorPath(row.id).map((p) => p.name).join(' › '),
            },
            {
              title: 'SPM baseline',
              dataIndex: 'spmBaseline',
              width: 130,
              align: 'right',
              render: (v) => (v ? `${v} P/M` : '—'),
            },
            { title: 'Note', dataIndex: 'note', render: (v) => v ?? '' },
          ]}
        />
      </div>

      <div className="ax-eps-process_pipeline_section">
        <div className="ax-eps-process_pipeline_section_title">Used by Production Families ({usage.length})</div>
        {usage.length === 0 ? (
          <Typography.Text type="secondary" className="text-sm">
            No production families currently route through this node.
          </Typography.Text>
        ) : (
          <div className="ax-eps-process_pipeline_usage">
            {usage.map((pf) => (
              <Tag key={pf.id} color="blue" style={{ margin: 0 }}>
                {pf.code} · {pf.name}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})
