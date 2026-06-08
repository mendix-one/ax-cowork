import { useEffect, useState } from 'react'
import { Button, Empty, Flex, Input, Space, Tag, Tooltip, Tree, Typography } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../stores/eps.context'
import type { FactorHierarchy, FactorNode } from '../stores/factors.store'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// ---- tree helpers --------------------------------------------------------------------------------

function collectKeys(nodes: FactorNode[], acc: string[] = []): string[] {
  for (const n of nodes) {
    acc.push(n.id)
    collectKeys(n.children, acc)
  }
  return acc
}

// Root ids + their immediate children — the default-expanded top two tiers.
function topTwoKeys(nodes: FactorNode[]): string[] {
  return [...nodes.map((n) => n.id), ...nodes.flatMap((n) => n.children.map((c) => c.id))]
}

// Prune a member tree to nodes that match `q` (by name/code) or have a matching descendant.
function filterNodes(nodes: FactorNode[], q: string): FactorNode[] {
  const ql = q.toLowerCase()
  return nodes.flatMap((n) => {
    const kids = filterNodes(n.children, q)
    const selfMatch = n.name.toLowerCase().includes(ql) || (n.code?.toLowerCase().includes(ql) ?? false)
    if (selfMatch) return [n]
    if (kids.length) return [{ ...n, children: kids }]
    return []
  })
}

// Truncated label with a tooltip carrying the full text (factor names can be long).
const labelNode = (text: string) => (
  <Tooltip title={text} placement="right" mouseEnterDelay={0.4}>
    <span className="ax-eps-filter_label">{text}</span>
  </Tooltip>
)

function toTreeData(nodes: FactorNode[]): DataNode[] {
  return nodes.map((n) => {
    const text = n.code ? `${n.code} · ${n.name}` : n.name
    return { key: n.id, title: labelNode(text), children: n.children.length ? toTreeData(n.children) : undefined }
  })
}

// ---- one filter group (= one factor hierarchy) ---------------------------------------------------

const FilterGroup = observer(({ title, hierarchy, query }: { title: string; hierarchy: FactorHierarchy; query: string }) => {
  const store = useEpsContext().simFilter
  const q = query.trim()

  const allKeys = collectKeys(hierarchy.roots)
  const checked = store.checkedFor(hierarchy.id, allKeys)
  const roots = q ? filterNodes(hierarchy.roots, q) : hierarchy.roots

  const [expanded, setExpanded] = useState<string[]>(() => topTwoKeys(hierarchy.roots))
  const [autoExpand, setAutoExpand] = useState(true)

  // While searching, expand every surviving branch so matches are visible.
  useEffect(() => {
    if (q) {
      setExpanded(collectKeys(filterNodes(hierarchy.roots, q)))
      setAutoExpand(true)
    }
  }, [q, hierarchy])

  // Hide groups with no matches while searching, so only relevant factors show.
  if (q && roots.length === 0) return null

  const visibleKeys = collectKeys(roots)
  const treeData = toTreeData(roots)

  return (
    <div className="ax-eps-simulation_filter_block">
      <Flex align="center" justify="space-between" gap={6} style={{ padding: '6px 8px 2px' }}>
        <Flex align="center" gap={6} style={{ minWidth: 0 }}>
          <Typography.Text strong style={{ fontSize: 13 }} ellipsis>
            {title}
          </Typography.Text>
          <Tag style={{ margin: 0 }} color={checked.length < allKeys.length ? 'blue' : 'default'}>
            {checked.length}/{allKeys.length}
          </Tag>
        </Flex>
        <Flex align="center" gap={2}>
          {/* While searching, All / None act only on the matched (visible) items in this group. */}
          <Button
            type="text"
            size="small"
            style={{ fontSize: 12, padding: '0 6px' }}
            onClick={() => store.setCheckedSubset(hierarchy.id, visibleKeys, true, allKeys)}
          >
            All
          </Button>
          <Button
            type="text"
            size="small"
            style={{ fontSize: 12, padding: '0 6px' }}
            onClick={() => store.setCheckedSubset(hierarchy.id, visibleKeys, false, allKeys)}
          >
            None
          </Button>
        </Flex>
      </Flex>

      <div className="ax-eps-simulation_filter_group ax-eps-filter_tree">
        <Tree
          checkable
          selectable={false}
          blockNode
          treeData={treeData}
          checkedKeys={checked}
          expandedKeys={expanded}
          autoExpandParent={autoExpand}
          onExpand={(keys) => {
            setExpanded(keys as string[])
            setAutoExpand(false)
          }}
          onCheck={(c) => {
            const keys = Array.isArray(c) ? c : c.checked
            store.setChecked(hierarchy.id, keys.map(String))
          }}
        />
      </div>
    </div>
  )
})

// Shared factor filters panel — the left sidebar on the Simulation, Projects and Analysis screens. A single
// quick-search at the top filters every group at once (Organization + each Engineering Process hierarchy,
// sourced live from Factors Control); the per-group All / None act on the matches so the planner can bulk
// select/unselect. Reset / Apply commit the selection (shared across the three screens via the simFilter store).
export const EpsFactorsFilter = observer(({ onClose }: { onClose: () => void }) => {
  const eps = useEpsContext()
  const factors = eps.factors
  const store = eps.simFilter

  const orgHierarchy = factors.dimensions.find((d) => d.id === 'organization')?.hierarchies[0]
  const processHierarchies = factors.dimensions.find((d) => d.id === 'process')?.hierarchies ?? []
  const groups: { title: string; hierarchy: FactorHierarchy }[] = [
    ...(orgHierarchy ? [{ title: 'Organization', hierarchy: orgHierarchy }] : []),
    ...processHierarchies.map((h) => ({ title: h.name, hierarchy: h })),
  ]

  const q = store.query.trim()
  const noMatches = q.length > 0 && groups.every((g) => filterNodes(g.hierarchy.roots, q).length === 0)

  return (
    <div className="ax-eps-simulation_side">
      <div className="ax-eps-simulation_side_header">
        <span>Factors</span>
        <Button size="small" type="text" className="ax-antd-button-icon-small" icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />} onClick={onClose} />
      </div>

      {/* Quick search across every factor group — find items, then bulk select/unselect them. */}
      <div className="ax-eps-simulation_filter_search">
        <Input
          size="small"
          allowClear
          prefix={<AxMuiIcon icon="mdiMagnify" size={14} />}
          placeholder="Search factors across all groups…"
          value={store.query}
          onChange={(e) => store.setQuery(e.target.value)}
        />
      </div>

      <div className="ax-eps-simulation_side_body">
        {noMatches ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`No factors match “${q}”`} style={{ marginTop: 24 }} />
        ) : (
          groups.map((g) => <FilterGroup key={g.hierarchy.id} title={g.title} hierarchy={g.hierarchy} query={store.query} />)
        )}
      </div>

      <div className="ax-eps-simulation_side_footer">
        <Space size="small">
          <Button size="small" disabled={!store.anyFiltered} onClick={() => store.reset()}>
            Reset
          </Button>
          <Button size="small" type="primary" disabled={!store.hasPendingChanges} onClick={() => store.apply()}>
            Apply
          </Button>
        </Space>
      </div>
    </div>
  )
})
