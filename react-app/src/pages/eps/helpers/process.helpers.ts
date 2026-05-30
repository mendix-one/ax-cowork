import {
  MOCK_PROCESS_CHILDREN,
  MOCK_PROCESS_INDEX,
  MOCK_PROCESS_NODES,
  MOCK_PRODUCTION_FAMILIES,
  type ProcessNode,
  type ProductionFamily,
} from '../data/mock-plan'

// === Children at a given level under a node ====================================================
export const childrenOf = (parentId?: string): ProcessNode[] => {
  if (!parentId) return MOCK_PROCESS_NODES.filter((p) => !p.parentId)
  return MOCK_PROCESS_CHILDREN[parentId] ?? []
}

// === Descendants — flatten the subtree rooted at `nodeId`. =====================================
export const descendantsOf = (nodeId: string): ProcessNode[] => {
  const out: ProcessNode[] = []
  const stack = [nodeId]
  while (stack.length > 0) {
    const id = stack.pop()!
    const kids = MOCK_PROCESS_CHILDREN[id] ?? []
    for (const k of kids) {
      out.push(k)
      stack.push(k.id)
    }
  }
  return out
}

// === Subtree SPM baseline aggregate ============================================================
export const subtreeBaselineSpm = (nodeId: string): number => {
  const node = MOCK_PROCESS_INDEX[nodeId]
  if (!node) return 0
  if (node.level === 'activity') return node.spmBaseline ?? 0
  return descendantsOf(nodeId)
    .filter((n) => n.level === 'activity')
    .reduce((s, n) => s + (n.spmBaseline ?? 0), 0)
}

// === Production Families that route through a given process node ==============================
// Includes any PF whose Task `processPath` contains the node id (or any descendant of it).
export const familiesUsingNode = (nodeId: string): ProductionFamily[] => {
  const all = new Set<string>([nodeId, ...descendantsOf(nodeId).map((n) => n.id)])
  return MOCK_PRODUCTION_FAMILIES.filter((pf) => pf.tasks.some((t) => t.processPath.some((p) => all.has(p))))
}

// === Ancestor path label ======================================================================
export const ancestorPath = (nodeId: string): ProcessNode[] => {
  const path: ProcessNode[] = []
  let cur: ProcessNode | undefined = MOCK_PROCESS_INDEX[nodeId]
  while (cur) {
    path.unshift(cur)
    cur = cur.parentId ? MOCK_PROCESS_INDEX[cur.parentId] : undefined
  }
  return path
}
