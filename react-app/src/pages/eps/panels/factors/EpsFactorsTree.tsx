import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Empty, Flex, Popconfirm, Space, Tag, Tooltip, Tree, Typography } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { FactorNode } from '../../stores/factors.store'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// A small per-level color palette so the tree reads its depth at a glance.
const LEVEL_COLORS = ['purple', 'geekblue', 'blue', 'cyan', 'green', 'gold']

export const EpsFactorsTree = observer(() => {
  const factors = useEpsContext().factors
  const hierarchy = factors.selectedHierarchy
  const levelIndex = useMemo(() => new Map(hierarchy.levels.map((l, i) => [l.id, i])), [hierarchy.levels])

  const [expanded, setExpanded] = useState<string[]>([])

  // Reset expansion to the top two tiers whenever the active hierarchy changes.
  useEffect(() => {
    const top = hierarchy.roots.map((r) => r.id)
    const second = hierarchy.roots.flatMap((r) => r.children.map((c) => c.id))
    setExpanded([...top, ...second])
  }, [hierarchy.id, hierarchy.roots])

  // Keep the selected node's ancestors expanded (so adds / drill-downs stay visible).
  useEffect(() => {
    if (!factors.selectedNodeId) return
    const path = factors.pathTo(factors.selectedNodeId)
    setExpanded((prev) => Array.from(new Set([...prev, ...path])))
  }, [factors, factors.selectedNodeId])

  const toDataNode = (node: FactorNode): DataNode => {
    const li = levelIndex.get(node.levelId) ?? 0
    return {
      key: node.id,
      title: (
        <Flex align="center" gap={6} style={{ paddingRight: 4 }}>
          {node.code && (
            <Tag color={LEVEL_COLORS[li % LEVEL_COLORS.length]} style={{ margin: 0, fontSize: 11, lineHeight: '16px' }}>
              {node.code}
            </Tag>
          )}
          <span>{node.name}</span>
          {node.children.length > 0 && (
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              ({node.children.length})
            </Typography.Text>
          )}
        </Flex>
      ),
      children: node.children.map(toDataNode),
    }
  }

  const treeData = hierarchy.roots.map(toDataNode)

  const selected = factors.selectedNode
  const canAddChild = !!selected && !!factors.childLevel(selected.levelId)

  return (
    <Card
      size="small"
      title={`Members · ${hierarchy.name}`}
      styles={{ body: { padding: 8 } }}
      extra={
        <Space size={4}>
          <Tooltip title="Add a top-level member">
            <Button size="small" icon={<AxMuiIcon icon="mdiPlus" size={14} />} onClick={() => factors.addRoot()}>
              Root
            </Button>
          </Tooltip>
          <Tooltip title={canAddChild ? 'Add a child member' : 'Leaf level — no child below'}>
            <Button
              size="small"
              disabled={!canAddChild}
              icon={<AxMuiIcon icon="mdiSubdirectoryArrowRight" size={14} />}
              onClick={() => selected && factors.addChild(selected.id)}
            >
              Child
            </Button>
          </Tooltip>
          <Tooltip title="Add a sibling member">
            <Button
              size="small"
              disabled={!selected}
              icon={<AxMuiIcon icon="mdiPlusBoxMultipleOutline" size={14} />}
              onClick={() => selected && factors.addSibling(selected.id)}
            >
              Sibling
            </Button>
          </Tooltip>
          <Popconfirm
            title="Delete member"
            description="This removes the member and everything under it."
            okText="Delete"
            okButtonProps={{ danger: true }}
            disabled={!selected}
            onConfirm={() => selected && factors.deleteNode(selected.id)}
          >
            <Button size="small" danger disabled={!selected} icon={<AxMuiIcon icon="mdiTrashCanOutline" size={14} />} />
          </Popconfirm>
        </Space>
      }
    >
      {treeData.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No members — add a root to start" />
      ) : (
        <Tree
          blockNode
          showLine={{ showLeafIcon: false }}
          treeData={treeData}
          selectedKeys={factors.selectedNodeId ? [factors.selectedNodeId] : []}
          expandedKeys={expanded}
          onExpand={(keys) => setExpanded(keys as string[])}
          onSelect={(keys) => factors.selectNode((keys[0] as string) ?? null)}
        />
      )}
    </Card>
  )
})
