import { makeAutoObservable } from 'mobx'
import { MOCK_DIVISIONS } from '../data/mock-plan'
import type { MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'

// ============================================================================================
// Factors Control — the multi-dimensional analysis (MDA) schema editor.
//
// In MDA / OLAP terms the planning cube is sliced by DIMENSIONS. A dimension organizes its members
// (the "factors") through one or more HIERARCHIES; each hierarchy is a chain of LEVELS (root → leaf)
// with a member tree. The leaf members are the finest-grained factors the simulation rolls up through.
//
// The three dimensions deliberately show the three schema SHAPES:
//   1. Organization        — a single hierarchy:  Department › Site › Team › Group › Part
//   2. Engineering Process — multiple hierarchies: Stage / Block / Function / Activity / HW-SW, each its
//                            own tree (dynamic per project)
//   3. Engineering Skills   — a snowflake: one central entity normalized into several branch hierarchies
//                            (Discipline / Domain / Seniority / Tooling), matched to the Headcount Portfolio
//
// Seeded from the live domain data where it exists, but kept independent — editing the schema here is a
// planning act and must not mutate the simulation's source data.
// ============================================================================================

export type FactorDimensionId = 'organization' | 'process' | 'skills'

// 'single' = one hierarchy; 'multi' = several independent hierarchies; 'snowflake' = branches off a hub.
export type FactorShape = 'single' | 'multi' | 'snowflake'

export interface FactorLevel {
  id: string
  name: string
}

// One member of a dimension — a factor. `code` is an optional short tag; `levelId` ties it to its tier.
export interface FactorNode {
  id: string
  name: string
  code?: string
  levelId: string
  children: FactorNode[]
}

// One hierarchy (roll-up path) within a dimension.
export interface FactorHierarchy {
  id: string
  name: string
  levels: FactorLevel[]
  roots: FactorNode[]
}

export interface FactorDimension {
  id: FactorDimensionId
  name: string
  icon: MdiIconName
  description: string
  shape: FactorShape
  // For snowflake dimensions, the central entity the branches normalize (shown at the hub).
  hub?: string
  hierarchies: FactorHierarchy[]
}

// ---- Seed helpers --------------------------------------------------------------------------------

// Build a node; id is derived from level + code so seeds stay unique within their hierarchy.
const mk = (levelId: string, code: string | undefined, name: string, children: FactorNode[] = []): FactorNode => ({
  id: `${levelId}__${code ?? name}`.replace(/\s+/g, '-').toLowerCase(),
  name,
  code,
  levelId,
  children,
})

// --- Organization: one balanced hierarchy, seeded from the live org tree ---
const ORG_LEVELS: FactorLevel[] = [
  { id: 'org-department', name: 'Department' },
  { id: 'org-site', name: 'Site' },
  { id: 'org-team', name: 'Team' },
  { id: 'org-group', name: 'Group' },
  { id: 'org-part', name: 'Part' },
]

function buildOrgHierarchy(): FactorHierarchy {
  const roots: FactorNode[] = MOCK_DIVISIONS.map((division) => ({
    id: division.id,
    code: division.code,
    name: division.name,
    levelId: 'org-department',
    children: division.sites.map((site) => ({
      id: site.id,
      name: site.name,
      levelId: 'org-site',
      children: site.teams.map((team) => ({
        id: team.id,
        name: team.name,
        levelId: 'org-team',
        children: team.groups.map((group) => ({
          id: group.id,
          name: group.name,
          levelId: 'org-group',
          children: group.parts.map((part) => ({ id: part.id, name: part.name, levelId: 'org-part', children: [] })),
        })),
      })),
    })),
  }))
  return { id: 'org-main', name: 'Org Breakdown', levels: ORG_LEVELS, roots }
}

// --- Engineering Process: multiple independent hierarchies (one per process aspect) ---
function buildProcessHierarchies(): FactorHierarchy[] {
  return [
    {
      id: 'proc-stage',
      name: 'Stage',
      levels: [
        { id: 'stage-phase', name: 'Phase' },
        { id: 'stage-step', name: 'Step' },
      ],
      roots: [
        mk('stage-phase', 'PRE', 'Pre-Silicon', [mk('stage-step', 'EVT0', 'EVT0'), mk('stage-step', 'EVT1', 'EVT1')]),
        mk('stage-phase', 'POST', 'Post-Silicon', [mk('stage-step', 'DVT', 'DVT'), mk('stage-step', 'PVT', 'PVT')]),
      ],
    },
    {
      id: 'proc-block',
      name: 'Block',
      levels: [
        { id: 'block-mega', name: 'Mega IP' },
        { id: 'block-ip', name: 'IP Block' },
      ],
      roots: [
        mk('block-mega', 'MEGA', 'Mega IP', [mk('block-ip', 'NPU', 'NPU'), mk('block-ip', 'CPU', 'CPU'), mk('block-ip', 'GPU', 'GPU')]),
        mk('block-mega', 'SYS', 'System IP', [mk('block-ip', 'ICN', 'Interconnect'), mk('block-ip', 'MEM', 'Memory Controller')]),
      ],
    },
    {
      id: 'proc-function',
      name: 'Function',
      levels: [{ id: 'function', name: 'Function' }],
      roots: [
        mk('function', 'RTL', 'RTL / IP Design'),
        mk('function', 'PWR', 'Power'),
        mk('function', 'PNR', 'Place & Route'),
        mk('function', 'DFT', 'Design-for-Test'),
      ],
    },
    {
      id: 'proc-activity',
      name: 'Activity',
      levels: [{ id: 'activity', name: 'Activity' }],
      roots: [
        mk('activity', 'ARCH', 'Architecture'),
        mk('activity', 'DES', 'Design'),
        mk('activity', 'DV', 'Verification'),
        mk('activity', 'IMPL', 'Implementation'),
      ],
    },
    {
      id: 'proc-hwsw',
      name: 'HW / SW',
      levels: [
        { id: 'hwsw-domain', name: 'Domain' },
        { id: 'hwsw-item', name: 'Item' },
      ],
      roots: [
        mk('hwsw-domain', 'HW', 'Hardware', [mk('hwsw-item', 'RTL', 'RTL'), mk('hwsw-item', 'PHY', 'Physical')]),
        mk('hwsw-domain', 'SW', 'Software', [mk('hwsw-item', 'FW', 'Firmware'), mk('hwsw-item', 'DRV', 'Drivers')]),
      ],
    },
  ]
}

// --- Engineering Skills: a snowflake — several branch hierarchies off the "Engineering Skill" hub ---
function buildSkillHierarchies(): FactorHierarchy[] {
  return [
    {
      id: 'skill-discipline',
      name: 'Discipline',
      levels: [
        { id: 'disc', name: 'Discipline' },
        { id: 'skill', name: 'Skill' },
      ],
      roots: [
        mk('disc', undefined, 'Front-end Design', [
          mk('skill', 'ARCH', 'Architecture'),
          mk('skill', 'RTL', 'RTL / IP Design'),
          mk('skill', 'DV', 'Design Verification'),
        ]),
        mk('disc', undefined, 'Physical Design', [
          mk('skill', 'PNR', 'Place & Route'),
          mk('skill', 'POWER', 'Power'),
          mk('skill', 'DFT', 'Design-for-Test'),
          mk('skill', 'SI', 'Signal Integrity'),
        ]),
        mk('disc', undefined, 'Analog / RF', [mk('skill', 'ANALOG', 'Analog'), mk('skill', 'RF', 'RF')]),
        mk('disc', undefined, 'Software', [mk('skill', 'SW', 'Software')]),
        mk('disc', undefined, 'Post-Silicon', [mk('skill', 'POSTSI', 'Post-Silicon'), mk('skill', 'CERT', 'Certification')]),
      ],
    },
    {
      id: 'skill-domain',
      name: 'Domain',
      levels: [{ id: 'domain', name: 'Domain' }],
      roots: [mk('domain', 'SOC', 'SoC'), mk('domain', 'SENSOR', 'Sensor'), mk('domain', 'LSI', 'LSI'), mk('domain', 'RF', 'RF / Connectivity')],
    },
    {
      id: 'skill-seniority',
      name: 'Seniority',
      levels: [{ id: 'grade', name: 'Grade' }],
      roots: [mk('grade', 'JR', 'Junior'), mk('grade', 'MID', 'Mid'), mk('grade', 'SR', 'Senior'), mk('grade', 'PR', 'Principal')],
    },
    {
      id: 'skill-tooling',
      name: 'Tooling',
      levels: [
        { id: 'tool-vendor', name: 'Vendor' },
        { id: 'tool', name: 'Tool' },
      ],
      roots: [
        mk('tool-vendor', 'SNPS', 'Synopsys', [mk('tool', 'VCS', 'VCS'), mk('tool', 'ICC2', 'IC Compiler II')]),
        mk('tool-vendor', 'CDNS', 'Cadence', [mk('tool', 'XCEL', 'Xcelium'), mk('tool', 'INNO', 'Innovus')]),
        mk('tool-vendor', 'SIE', 'Siemens EDA', [mk('tool', 'QUES', 'Questa')]),
      ],
    },
  ]
}

function buildDimensions(): FactorDimension[] {
  return [
    {
      id: 'organization',
      name: 'Organization',
      icon: 'mdiOfficeBuildingOutline',
      description: 'A single hierarchy — Department › Site › Team › Group › Part — that headcount and ownership roll up through.',
      shape: 'single',
      hierarchies: [buildOrgHierarchy()],
    },
    {
      id: 'process',
      name: 'Engineering Process',
      icon: 'mdiSitemapOutline',
      description: 'Multiple hierarchies — Stage, Block, Function, Activity, HW/SW — each an independent breakdown, dynamic per engineering project.',
      shape: 'multi',
      hierarchies: buildProcessHierarchies(),
    },
    {
      id: 'skills',
      name: 'Engineering Skills',
      icon: 'mdiAccountWrenchOutline',
      description:
        'A snowflake — the Engineering Skill hub normalized into branches (Discipline, Domain, Seniority, Tooling), matched to the Headcount Portfolio.',
      shape: 'snowflake',
      hub: 'Engineering Skill',
      hierarchies: buildSkillHierarchies(),
    },
  ]
}

// ---- Tree helpers --------------------------------------------------------------------------------

function findNode(nodes: FactorNode[], id: string): FactorNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const hit = findNode(node.children, id)
    if (hit) return hit
  }
  return null
}

function findContainer(nodes: FactorNode[], id: string): FactorNode[] | null {
  if (nodes.some((n) => n.id === id)) return nodes
  for (const node of nodes) {
    const hit = findContainer(node.children, id)
    if (hit) return hit
  }
  return null
}

function countByLevel(nodes: FactorNode[], levelId: string): number {
  return nodes.reduce((sum, n) => sum + (n.levelId === levelId ? 1 : 0) + countByLevel(n.children, levelId), 0)
}

function countMembers(nodes: FactorNode[]): number {
  return nodes.reduce((sum, n) => sum + 1 + countMembers(n.children), 0)
}

// A hierarchy is balanced when every leaf member sits at the last level.
function isBalanced(h: FactorHierarchy): boolean {
  const lastLevel = h.levels[h.levels.length - 1]?.id
  const check = (nodes: FactorNode[]): boolean => nodes.every((n) => (n.children.length === 0 ? n.levelId === lastLevel : check(n.children)))
  return check(h.roots)
}

// ============================================================================================

export class FactorsStore {
  dimensions: FactorDimension[] = buildDimensions()
  selectedDimensionId: FactorDimensionId = 'organization'
  selectedHierarchyId: string
  selectedNodeId: string | null = null
  dirty = false

  private seq = 0

  constructor() {
    this.selectedHierarchyId = this.dimensions[0].hierarchies[0].id
    makeAutoObservable(this)
    this.selectedNodeId = this.selectedHierarchy.roots[0]?.id ?? null
  }

  // ---- Derived ----------------------------------------------------------------------------------
  get selectedDimension(): FactorDimension {
    return this.dimensions.find((d) => d.id === this.selectedDimensionId) ?? this.dimensions[0]
  }

  get selectedHierarchy(): FactorHierarchy {
    const dim = this.selectedDimension
    return dim.hierarchies.find((h) => h.id === this.selectedHierarchyId) ?? dim.hierarchies[0]
  }

  get selectedNode(): FactorNode | null {
    if (!this.selectedNodeId) return null
    return findNode(this.selectedHierarchy.roots, this.selectedNodeId)
  }

  memberCount(h: FactorHierarchy): number {
    return countMembers(h.roots)
  }

  dimensionMemberCount(dim: FactorDimension): number {
    return dim.hierarchies.reduce((sum, h) => sum + countMembers(h.roots), 0)
  }

  isBalanced(h: FactorHierarchy): boolean {
    return isBalanced(h)
  }

  // Member count at a given level of the active hierarchy — shown on the schema level chips.
  levelCount(levelId: string): number {
    return countByLevel(this.selectedHierarchy.roots, levelId)
  }

  // The level immediately below `levelId`, or null at the leaf.
  childLevel(levelId: string): FactorLevel | null {
    const levels = this.selectedHierarchy.levels
    const idx = levels.findIndex((l) => l.id === levelId)
    return idx >= 0 && idx < levels.length - 1 ? levels[idx + 1] : null
  }

  levelById(levelId: string): FactorLevel | null {
    return this.selectedHierarchy.levels.find((l) => l.id === levelId) ?? null
  }

  // Ancestor ids of `id` (root-first, excluding the node itself) — used to auto-expand the tree.
  pathTo(id: string): string[] {
    const path: string[] = []
    const walk = (nodes: FactorNode[], trail: string[]): boolean => {
      for (const node of nodes) {
        if (node.id === id) {
          path.push(...trail)
          return true
        }
        if (walk(node.children, [...trail, node.id])) return true
      }
      return false
    }
    walk(this.selectedHierarchy.roots, [])
    return path
  }

  // ---- Selection --------------------------------------------------------------------------------
  selectDimension(id: FactorDimensionId) {
    this.selectedDimensionId = id
    this.selectedHierarchyId = this.selectedDimension.hierarchies[0]?.id ?? ''
    this.selectedNodeId = this.selectedHierarchy.roots[0]?.id ?? null
  }

  selectHierarchy(id: string) {
    this.selectedHierarchyId = id
    this.selectedNodeId = this.selectedHierarchy.roots[0]?.id ?? null
  }

  selectNode(id: string | null) {
    this.selectedNodeId = id
  }

  // ---- Hierarchy (roll-up path / branch) edits --------------------------------------------------
  addHierarchy(): string {
    const dim = this.selectedDimension
    this.seq += 1
    const id = `${dim.id}-h-${this.seq}`
    const levelId = `${id}-l1`
    dim.hierarchies.push({
      id,
      name: dim.shape === 'snowflake' ? `Branch ${dim.hierarchies.length + 1}` : `Hierarchy ${dim.hierarchies.length + 1}`,
      levels: [{ id: levelId, name: 'Level 1' }],
      roots: [],
    })
    this.selectedHierarchyId = id
    this.selectedNodeId = null
    this.dirty = true
    return id
  }

  renameHierarchy(id: string, name: string) {
    const h = this.selectedDimension.hierarchies.find((x) => x.id === id)
    if (!h) return
    h.name = name
    this.dirty = true
  }

  removeHierarchy(id: string): boolean {
    const dim = this.selectedDimension
    if (dim.hierarchies.length <= 1) return false
    dim.hierarchies = dim.hierarchies.filter((h) => h.id !== id)
    if (this.selectedHierarchyId === id) {
      this.selectedHierarchyId = dim.hierarchies[0].id
      this.selectedNodeId = this.selectedHierarchy.roots[0]?.id ?? null
    }
    this.dirty = true
    return true
  }

  // ---- Member (factor) edits --------------------------------------------------------------------
  private makeNode(levelId: string): FactorNode {
    const level = this.levelById(levelId)
    this.seq += 1
    return { id: `factor-${levelId}-${this.seq}`, name: `New ${level?.name ?? 'factor'}`, levelId, children: [] }
  }

  renameNode(id: string, name: string) {
    const node = findNode(this.selectedHierarchy.roots, id)
    if (!node) return
    node.name = name
    this.dirty = true
  }

  setNodeCode(id: string, code: string) {
    const node = findNode(this.selectedHierarchy.roots, id)
    if (!node) return
    node.code = code.trim() ? code.trim() : undefined
    this.dirty = true
  }

  addChild(parentId: string): string | null {
    const parent = findNode(this.selectedHierarchy.roots, parentId)
    if (!parent) return null
    const child = this.childLevel(parent.levelId)
    if (!child) return null
    const node = this.makeNode(child.id)
    parent.children.push(node)
    this.selectedNodeId = node.id
    this.dirty = true
    return node.id
  }

  addSibling(id: string): string | null {
    const container = findContainer(this.selectedHierarchy.roots, id)
    const ref = container?.find((n) => n.id === id)
    if (!container || !ref) return null
    const node = this.makeNode(ref.levelId)
    const idx = container.findIndex((n) => n.id === id)
    container.splice(idx + 1, 0, node)
    this.selectedNodeId = node.id
    this.dirty = true
    return node.id
  }

  addRoot(): string | null {
    const rootLevel = this.selectedHierarchy.levels[0]
    if (!rootLevel) return null
    const node = this.makeNode(rootLevel.id)
    this.selectedHierarchy.roots.push(node)
    this.selectedNodeId = node.id
    this.dirty = true
    return node.id
  }

  deleteNode(id: string) {
    const container = findContainer(this.selectedHierarchy.roots, id)
    if (!container) return
    const idx = container.findIndex((n) => n.id === id)
    if (idx < 0) return
    container.splice(idx, 1)
    if (this.selectedNodeId === id) this.selectedNodeId = this.selectedHierarchy.roots[0]?.id ?? null
    this.dirty = true
  }

  // ---- Level (schema tier) edits ----------------------------------------------------------------
  renameLevel(levelId: string, name: string) {
    const level = this.levelById(levelId)
    if (!level) return
    level.name = name
    this.dirty = true
  }

  addLevel() {
    const h = this.selectedHierarchy
    this.seq += 1
    h.levels.push({ id: `${h.id}-level-${this.seq}`, name: `Level ${h.levels.length + 1}` })
    this.dirty = true
  }

  // Remove a level — only allowed when no member uses it, so the hierarchy stays consistent.
  removeLevel(levelId: string): boolean {
    const h = this.selectedHierarchy
    if (h.levels.length <= 1) return false
    if (this.levelCount(levelId) > 0) return false
    h.levels = h.levels.filter((l) => l.id !== levelId)
    this.dirty = true
    return true
  }

  // ---- Reset ------------------------------------------------------------------------------------
  reset() {
    this.dimensions = buildDimensions()
    this.selectedHierarchyId = this.selectedDimension.hierarchies[0].id
    this.selectedNodeId = this.selectedHierarchy.roots[0]?.id ?? null
    this.dirty = false
  }
}
