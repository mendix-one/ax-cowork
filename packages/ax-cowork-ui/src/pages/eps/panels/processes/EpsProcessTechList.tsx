import { Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { MOCK_PROCESS_NODES, type ProcessNode } from '../../data/mock-plan'
import { subtreeBaselineSpm } from '../../helpers/process.helpers'

// Engineering Process catalog tree — Stage → Block → Function → Activity. Selecting a node drives
// the right-side pipeline + detail. Sticky `level` chips read at a glance.

const LEVEL_COLOR: Record<ProcessNode['level'], string> = {
  stage: 'purple',
  block: 'geekblue',
  function: 'blue',
  activity: 'cyan',
}

const childrenOf = (parentId?: string) => MOCK_PROCESS_NODES.filter((p) => p.parentId === parentId)

export const EpsProcessTechList = observer(() => {
  const sim = useEpsContext()
  const process = sim.process
  const roots = childrenOf(undefined)

  const renderNode = (node: ProcessNode, depth: number): React.ReactNode => {
    const isActive = node.id === process.selectedNodeId
    const baseline = subtreeBaselineSpm(node.id)
    return (
      <div key={node.id} className="ax-eps-process_tech_card_wrap" style={{ paddingLeft: depth * 12 }}>
        <button type="button" className={`ax-eps-process_tech_card ${isActive ? 'is-active' : ''}`} onClick={() => process.selectNode(node.id)}>
          <div className="ax-eps-process_tech_card_top">
            <div className="ax-eps-process_tech_card_title">{node.name}</div>
            <Tag color={LEVEL_COLOR[node.level]} style={{ margin: 0 }}>
              {node.level}
            </Tag>
          </div>
          <Typography.Text type="secondary" className="text-sm">
            {node.code} · {baseline} P/M baseline
          </Typography.Text>
        </button>
        {childrenOf(node.id).map((c) => renderNode(c, depth + 1))}
      </div>
    )
  }

  return (
    <div className="ax-eps-process_tech_list">
      <div className="ax-eps-process_tech_list_header">
        <span>Process catalog</span>
      </div>
      <div className="ax-eps-process_tech_list_body">{roots.map((n) => renderNode(n, 0))}</div>
    </div>
  )
})
