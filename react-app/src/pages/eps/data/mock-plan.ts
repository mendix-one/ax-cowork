// EPS — Engineering Planning Simulation domain model + seeded mock dataset.
//
// Replaces the original MPS-derived wafer model with the IA defined in Update 2 of
// tasks/engineering-planning-simulation/engineering-planning-simulation.txt:
//
//   • Organization Hierarchy ............. Division → Site → Team → Group → Part → Cell
//   • Business Development ............... BizGroup → BizTeam (Production Line) → ProductionFamilyGroup → ProductionFamily
//   • Engineering Process tree ........... Stage → Block → Function → Activity
//   • Standard Personal Monthly (SPM) .... (Org dim × Process dim × MTO month offset → person-months)
//   • Engineering Tasks / Sub-Tasks ...... Level-3 / Level-4 Gantt rows
//   • MTO milestones ..................... per Production Family at standard offsets in [-60, +36]
//
// All values are illustrative — there is no backend behind this concept UI.

// ============================================================================================
// Horizon (kept compatible with the existing render code).
// The Gantt now spans MTO-anchored quarters; HORIZON_* remain available for any callers that
// still consume them. Today + dates are kept aligned with the seed Production Families below.
// ============================================================================================

export const HORIZON_START = '2026-01-01'
export const HORIZON_END = '2030-12-31'
export const HORIZON_TODAY = '2026-05-04'
export const HORIZON_DAYS = 30

const addDays = (start: string, days: number): string => {
  const d = new Date(start)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const horizonDate = (offset: number): string => addDays(HORIZON_START, offset)
const horizonLabel = (offset: number): string => {
  const d = new Date(horizonDate(offset))
  return `${String(d.getUTCDate()).padStart(2, '0')} ${WEEKDAY[d.getUTCDay()]}`
}

export const HORIZON_DATES: string[] = Array.from({ length: HORIZON_DAYS }, (_, i) => horizonDate(i))
export const HORIZON_LABELS: string[] = Array.from({ length: HORIZON_DAYS }, (_, i) => horizonLabel(i))

export const HORIZON_MONTH_GROUPS: { month: string; days: number }[] = (() => {
  const groups: { month: string; days: number }[] = []
  for (const date of HORIZON_DATES) {
    const d = new Date(date)
    const label = `${MONTH[d.getUTCMonth()]} ${d.getUTCFullYear()}`
    const last = groups[groups.length - 1]
    if (last && last.month === label) last.days += 1
    else groups.push({ month: label, days: 1 })
  }
  return groups
})()

// ============================================================================================
// Schedule + milestone classifications — preserved across the rewrite.
// ============================================================================================

// Drives bar colour: fixed = already running, changes = edited from baseline, new = freshly added.
export type ScheduleClass = 'fixed' | 'changes' | 'new'

// Drives MTO milestone marker colour + tooltip framing.
export type MilestoneState = 'new' | 'normal' | 'late' | 'cannot'

// ============================================================================================
// MTO timeline helpers — months relative to MTO(0).
// Standard checkpoints per spec: MTO-60 → MTO(0) → MTO+36.
// ============================================================================================

export const MTO_OFFSETS_STANDARD = [-60, -48, -36, -24, -12, 0, 12, 24, 36] as const

export const mtoLabel = (offset: number): string => {
  if (offset === 0) return 'MTO(0)'
  return offset > 0 ? `MTO+${offset}` : `MTO${offset}`
}

// Add `months` to a YYYY-MM anchor → YYYY-MM-01 ISO date.
export const mtoDateFromAnchor = (anchorYearMonth: string, monthOffset: number): string => {
  const [y, m] = anchorYearMonth.split('-').map(Number)
  const idx = y * 12 + (m - 1) + monthOffset
  const yy = Math.floor(idx / 12)
  const mm = (idx % 12) + 1
  return `${String(yy).padStart(4, '0')}-${String(mm).padStart(2, '0')}-01`
}

// ============================================================================================
// Organization Hierarchy: Division → Site → Team → Group → Part → Cell
// Only the bottom Cell carries headcount + skill mix; parents roll up via helpers.
// ============================================================================================

export type SkillGroup = 'Architecture' | 'RTL' | 'DV' | 'PNR' | 'Power' | 'Analog' | 'DFT' | 'SI' | 'PostSi' | 'SW' | 'Certification' | 'RF'

export type SkillMix = { skill: SkillGroup; count: number }

export type Cell = {
  id: string
  name: string
  headcount: number // sum of skill counts; kept explicit for fast UI access
  skills: SkillMix[]
}

export type Part = { id: string; name: string; cells: Cell[] }
export type Group = { id: string; name: string; parts: Part[] }
export type Team = { id: string; name: string; groups: Group[] }
export type Site = { id: string; name: string; teams: Team[] }
export type Division = {
  id: string
  code: 'SARC' | 'DSK' | 'LSI'
  name: string
  sites: Site[]
}

// Reference to an org node at any level — used by SPM cells, task owners, etc.
export type OrgRef = {
  divisionId: string
  siteId?: string
  teamId?: string
  groupId?: string
  partId?: string
  cellId?: string
}

// ============================================================================================
// Business Development: BizGroup → BizTeam (Production Line) → PFG → Production Family
// ============================================================================================

export type BizGroup = 'SOC' | 'Sensor' | 'LSI'
export type ProductionFamilyGroup = 'Basic' | 'Leading' | 'Derivatives'

export type BizTeam = {
  id: string
  code: string // e.g. 'M-SOC', 'mDDI'
  name: string
  bizGroup: BizGroup
}

// ============================================================================================
// Engineering Process catalog: Stage → Block → Function → Activity
// Each activity carries a baseline SPM (person-months) used as the planning footprint.
// ============================================================================================

export type ProcessLevel = 'stage' | 'block' | 'function' | 'activity'

export type ProcessNode = {
  id: string
  code: string // short code, e.g. 'SOC', 'NPU', 'RTL'
  name: string
  level: ProcessLevel
  parentId?: string
  note?: string
  spmBaseline?: number // person-months — only set on activity leaves
}

// ============================================================================================
// Engineering Tasks (level-3 Gantt rows) and Sub-Tasks (level-4 Gantt rows).
// Sub-Tasks are the "Extra Engineering Request" buckets — Certification / RF / Other.
// ============================================================================================

export type SubTaskKind = 'Certification' | 'RF' | 'Other'

export type EngineeringSubTask = {
  id: string
  kind: SubTaskKind
  name: string
  start: string
  end: string
  durationDays: number
  scheduleClass: ScheduleClass
  ownerCellIds: string[]
  spm: number // person-months
  note?: string
}

export type EngineeringTask = {
  id: string
  code: string // e.g. 'TSK-RTL-NPU-1'
  name: string // 'NPU RTL Design'
  // Chain of ProcessNode ids: stage → block → function → activity (last is the leaf).
  processPath: string[]
  start: string
  end: string
  durationDays: number
  scheduleClass: ScheduleClass
  ownerCellIds: string[]
  spm: number // person-months
  subTasks: EngineeringSubTask[]
  note?: string
}

// ============================================================================================
// Production Family — the planning unit. Owns an MTO(0) anchor and a list of EngineeringTasks.
// ============================================================================================

export type ProductionFamily = {
  id: string
  code: string // e.g. 'FLG-MODAP-1'
  name: string // 'Flagship Modap 1st'
  bizTeamId: string
  familyGroup: ProductionFamilyGroup
  mtoAnchor: string // YYYY-MM, MTO(0)
  scheduleClass: ScheduleClass // roll-up state for the family
  tasks: EngineeringTask[]
}

// ============================================================================================
// MTO Milestone (per Production Family)
// ============================================================================================

export type MtoMilestone = {
  id: string
  productionFamilyId: string
  offset: number // months from MTO(0)
  label: string // 'MTO-60', 'MTO(0)', 'MTO+12'
  date: string // computed from PF.mtoAnchor + offset
  state: MilestoneState
  cause?: string
  slipDays?: number
}

// ============================================================================================
// Mock seed — Organization Hierarchy
// ============================================================================================

const cell = (id: string, name: string, skills: SkillMix[]): Cell => ({
  id,
  name,
  headcount: skills.reduce((s, x) => s + x.count, 0),
  skills,
})

const part = (id: string, name: string, cells: Cell[]): Part => ({ id, name, cells })
const group = (id: string, name: string, parts: Part[]): Group => ({ id, name, parts })
const team = (id: string, name: string, groups: Group[]): Team => ({ id, name, groups })
const site = (id: string, name: string, teams: Team[]): Site => ({ id, name, teams })

export const MOCK_DIVISIONS: Division[] = [
  {
    id: 'div-sarc',
    code: 'SARC',
    name: 'SARC · Samsung Austin R&D Center',
    sites: [
      site('site-sarc-hq', 'SARC HQ', [
        team('team-soc-ip', 'SOC IP KeBalTTim (S.LSI)', [
          group('group-gpu', 'GPU', [
            part('part-gpu-design-1', 'GPU Design 1', [
              cell('cell-gpu-design-1-rtl', 'RTL Cell', [
                { skill: 'RTL', count: 6 },
                { skill: 'DV', count: 4 },
              ]),
              cell('cell-gpu-design-1-arch', 'Architecture Cell', [
                { skill: 'Architecture', count: 3 },
                { skill: 'Power', count: 2 },
              ]),
            ]),
            part('part-gpu-pnr', 'GPU PnR', [
              cell('cell-gpu-pnr-1', 'PnR Cell 1', [
                { skill: 'PNR', count: 5 },
                { skill: 'SI', count: 2 },
              ]),
            ]),
          ]),
          group('group-sysip', 'System IP', [
            part('part-sysip-interconnect', 'Interconnect IP', [
              cell('cell-sysip-interconnect-rtl', 'Interconnect RTL', [
                { skill: 'RTL', count: 5 },
                { skill: 'DV', count: 3 },
              ]),
            ]),
          ]),
        ]),
      ]),
    ],
  },
  {
    id: 'div-dsk',
    code: 'DSK',
    name: 'DSK · Device Solutions Korea',
    sites: [
      site('site-dsk-hwaseong', 'Hwaseong Campus', [
        team('team-ap-sw', 'AP SW KeBalTTim (S.LSI)', [
          group('group-multimedia', 'Multimedia Solution', [
            part('part-multimedia-av', 'Multimedia AnV', [
              cell('cell-mm-av-sw', 'SW Cell', [
                { skill: 'SW', count: 6 },
                { skill: 'PostSi', count: 2 },
              ]),
            ]),
          ]),
          group('group-modem', 'Modem Solution', [
            part('part-modem-rf', 'Modem RF', [
              cell('cell-modem-rf-1', 'RF Cell', [
                { skill: 'RF', count: 5 },
                { skill: 'Analog', count: 3 },
                { skill: 'Certification', count: 2 },
              ]),
            ]),
          ]),
        ]),
      ]),
      site('site-dsk-giheung', 'Giheung Campus', [
        team('team-display', 'Display LSI KeBalTTim', [
          group('group-pddi', 'pDDI', [
            part('part-pddi-design', 'pDDI Design', [
              cell('cell-pddi-design-1', 'Design Cell', [
                { skill: 'RTL', count: 4 },
                { skill: 'Analog', count: 3 },
                { skill: 'DV', count: 2 },
              ]),
            ]),
          ]),
        ]),
      ]),
    ],
  },
]

// ============================================================================================
// Mock seed — Business Development
// ============================================================================================

export const MOCK_BIZ_GROUPS: BizGroup[] = ['SOC', 'Sensor', 'LSI']

export const MOCK_BIZ_TEAMS: BizTeam[] = [
  { id: 'biz-m-soc', code: 'M-SOC', name: 'Mobile SOC', bizGroup: 'SOC' },
  { id: 'biz-a-soc', code: 'A-SOC', name: 'Auto SOC', bizGroup: 'SOC' },
  { id: 'biz-c-soc', code: 'C-SOC', name: 'Consumer SOC', bizGroup: 'SOC' },
  { id: 'biz-sensor', code: 'Sensor', name: 'Image Sensor', bizGroup: 'Sensor' },
  { id: 'biz-mddi', code: 'mDDI', name: 'Mobile Display IC', bizGroup: 'LSI' },
  { id: 'biz-pddi', code: 'pDDI', name: 'Panel Display IC', bizGroup: 'LSI' },
  { id: 'biz-pmic', code: 'PMIC', name: 'Power Management IC', bizGroup: 'LSI' },
]

export const PRODUCTION_FAMILY_GROUPS: ProductionFamilyGroup[] = ['Basic', 'Leading', 'Derivatives']

// ============================================================================================
// Mock seed — Engineering Process Catalog (Stage → Block → Function → Activity)
// ============================================================================================

const pnode = (id: string, code: string, name: string, level: ProcessLevel, parentId?: string, extras?: Partial<ProcessNode>): ProcessNode => ({
  id,
  code,
  name,
  level,
  parentId,
  ...extras,
})

export const MOCK_PROCESS_NODES: ProcessNode[] = [
  // === SOC stage =============================================================
  pnode('proc-soc', 'SOC', 'SOC', 'stage'),
  pnode('proc-soc-evt0', 'EVT0', 'SOC EVT0', 'stage', 'proc-soc'),

  // Block: Mega IP
  pnode('proc-megaip', 'MEGA_IP', 'Mega IP', 'block', 'proc-soc-evt0'),
  pnode('proc-npu', 'NPU', 'NPU', 'block', 'proc-megaip', { note: 'Neural Processing Unit' }),
  pnode('proc-cpu', 'CPU', 'CPU', 'block', 'proc-megaip'),
  pnode('proc-gpu', 'GPU', 'GPU', 'block', 'proc-megaip'),

  // Functions under NPU
  pnode('proc-npu-rtl', 'RTL', 'RTL / IP Design', 'function', 'proc-npu'),
  pnode('proc-npu-power', 'POWER', 'Power', 'function', 'proc-npu'),
  pnode('proc-npu-pnr', 'PNR', 'Place & Route', 'function', 'proc-npu'),

  // Activities under NPU → RTL
  pnode('proc-npu-rtl-hw', 'HW_DES', 'H/W Design', 'activity', 'proc-npu-rtl', { spmBaseline: 24 }),
  pnode('proc-npu-rtl-arch', 'ARCH', 'Architecture', 'activity', 'proc-npu-rtl', {
    spmBaseline: 12,
    note: 'SOC Architecture',
  }),
  pnode('proc-npu-rtl-dv', 'DV', 'Design Verification', 'activity', 'proc-npu-rtl', { spmBaseline: 30 }),

  // Activities under NPU → Power
  pnode('proc-npu-power-intent', 'PWR_INT', 'Power Intent', 'activity', 'proc-npu-power', { spmBaseline: 8 }),
  pnode('proc-npu-power-analysis', 'PWR_ANL', 'Power Analysis', 'activity', 'proc-npu-power', { spmBaseline: 10 }),

  // Activities under NPU → PnR
  pnode('proc-npu-pnr-floor', 'FLOOR', 'Floorplan', 'activity', 'proc-npu-pnr', { spmBaseline: 9 }),
  pnode('proc-npu-pnr-route', 'ROUTE', 'Routing & Timing', 'activity', 'proc-npu-pnr', { spmBaseline: 14 }),

  // Functions under CPU
  pnode('proc-cpu-rtl', 'CPU_RTL', 'CPU RTL', 'function', 'proc-cpu'),
  pnode('proc-cpu-rtl-design', 'CPU_DES', 'CPU Design', 'activity', 'proc-cpu-rtl', { spmBaseline: 20 }),
  pnode('proc-cpu-rtl-verif', 'CPU_DV', 'CPU Verification', 'activity', 'proc-cpu-rtl', { spmBaseline: 24 }),

  // Functions under GPU
  pnode('proc-gpu-rtl', 'GPU_RTL', 'GPU RTL', 'function', 'proc-gpu'),
  pnode('proc-gpu-rtl-design', 'GPU_DES', 'GPU Design', 'activity', 'proc-gpu-rtl', { spmBaseline: 22 }),
  pnode('proc-gpu-rtl-verif', 'GPU_DV', 'GPU Verification', 'activity', 'proc-gpu-rtl', { spmBaseline: 26 }),

  // Block: System IP (lighter sub-tree)
  pnode('proc-sysip', 'SYSIP', 'System IP', 'block', 'proc-soc-evt0'),
  pnode('proc-sysip-interconnect', 'INTC', 'Interconnect', 'function', 'proc-sysip'),
  pnode('proc-sysip-interconnect-rtl', 'INTC_RTL', 'Interconnect RTL', 'activity', 'proc-sysip-interconnect', {
    spmBaseline: 14,
  }),
  pnode('proc-sysip-interconnect-dv', 'INTC_DV', 'Interconnect DV', 'activity', 'proc-sysip-interconnect', {
    spmBaseline: 12,
  }),

  // === Test stage ============================================================
  pnode('proc-test', 'TEST', 'Test', 'stage'),
  pnode('proc-test-postsi', 'POSTSI', 'Post-Silicon', 'block', 'proc-test'),
  pnode('proc-test-postsi-validation', 'PSV', 'Validation', 'function', 'proc-test-postsi'),
  pnode('proc-test-postsi-validation-fc', 'PSV_FC', 'Functional Check', 'activity', 'proc-test-postsi-validation', {
    spmBaseline: 8,
  }),
  pnode('proc-test-postsi-validation-perf', 'PSV_PF', 'Performance', 'activity', 'proc-test-postsi-validation', {
    spmBaseline: 10,
  }),
]

// Convenience indices.
export const MOCK_PROCESS_INDEX: Record<string, ProcessNode> = Object.fromEntries(MOCK_PROCESS_NODES.map((p) => [p.id, p]))
export const MOCK_PROCESS_CHILDREN: Record<string, ProcessNode[]> = (() => {
  const out: Record<string, ProcessNode[]> = {}
  for (const p of MOCK_PROCESS_NODES) {
    const key = p.parentId ?? '__root__'
    out[key] ??= []
    out[key].push(p)
  }
  return out
})()

// ============================================================================================
// Mock seed — Production Families with Engineering Tasks + Sub-Tasks.
// Each PF lives on its own MTO(0) anchor (months). Tasks are placed roughly MTO-36 to MTO+12
// so the Gantt covers the expected pre-silicon → ramp-up window.
// ============================================================================================

// Helper — produce ISO day string `offsetMonths` months from a PF's MTO(0) anchor.
const dayAt = (anchorYearMonth: string, monthOffset: number, dayOfMonth = 15): string => {
  const baseIso = mtoDateFromAnchor(anchorYearMonth, monthOffset) // YYYY-MM-01
  const [y, m] = baseIso.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1, dayOfMonth))
  return d.toISOString().slice(0, 10)
}

const dayDiff = (start: string, end: string): number => Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / (24 * 60 * 60 * 1000)))

type TaskSpec = {
  id: string
  code: string
  name: string
  processPath: string[]
  startOffset: number // months from MTO(0)
  endOffset: number
  scheduleClass: ScheduleClass
  ownerCellIds: string[]
  spm: number
  subs?: { kind: SubTaskKind; name: string; startOffset: number; endOffset: number; spm: number; scheduleClass?: ScheduleClass; ownerCellIds: string[] }[]
}

const buildTasks = (anchor: string, specs: TaskSpec[]): EngineeringTask[] =>
  specs.map((t) => {
    const start = dayAt(anchor, t.startOffset)
    const end = dayAt(anchor, t.endOffset, 28)
    return {
      id: t.id,
      code: t.code,
      name: t.name,
      processPath: t.processPath,
      start,
      end,
      durationDays: dayDiff(start, end),
      scheduleClass: t.scheduleClass,
      ownerCellIds: t.ownerCellIds,
      spm: t.spm,
      subTasks: (t.subs ?? []).map((s, i) => {
        const sStart = dayAt(anchor, s.startOffset)
        const sEnd = dayAt(anchor, s.endOffset, 28)
        return {
          id: `${t.id}-sub-${i + 1}`,
          kind: s.kind,
          name: s.name,
          start: sStart,
          end: sEnd,
          durationDays: dayDiff(sStart, sEnd),
          scheduleClass: s.scheduleClass ?? t.scheduleClass,
          ownerCellIds: s.ownerCellIds,
          spm: s.spm,
        }
      }),
    }
  })

// Three PFs covering different BizGroups so the planner sees the full IA.
export const MOCK_PRODUCTION_FAMILIES: ProductionFamily[] = [
  {
    id: 'pf-flg-modap-1',
    code: 'FLG-MODAP-1',
    name: 'Flagship Modap 1st',
    bizTeamId: 'biz-m-soc',
    familyGroup: 'Leading',
    mtoAnchor: '2027-06',
    scheduleClass: 'changes',
    tasks: buildTasks('2027-06', [
      {
        id: 'tsk-flg-modap-arch',
        code: 'TSK-ARCH-1',
        name: 'NPU Architecture',
        processPath: ['proc-soc', 'proc-soc-evt0', 'proc-megaip', 'proc-npu', 'proc-npu-rtl', 'proc-npu-rtl-arch'],
        startOffset: -30,
        endOffset: -20,
        scheduleClass: 'fixed',
        ownerCellIds: ['cell-gpu-design-1-arch'],
        spm: 14,
        subs: [
          {
            kind: 'Certification',
            name: 'Arch IP Certification',
            startOffset: -22,
            endOffset: -20,
            spm: 2,
            ownerCellIds: ['cell-modem-rf-1'],
          },
        ],
      },
      {
        id: 'tsk-flg-modap-rtl',
        code: 'TSK-RTL-1',
        name: 'NPU RTL Design',
        processPath: ['proc-soc', 'proc-soc-evt0', 'proc-megaip', 'proc-npu', 'proc-npu-rtl', 'proc-npu-rtl-hw'],
        startOffset: -22,
        endOffset: -10,
        scheduleClass: 'changes',
        ownerCellIds: ['cell-gpu-design-1-rtl'],
        spm: 28,
        subs: [
          {
            kind: 'RF',
            name: 'RF DV Hand-shake',
            startOffset: -18,
            endOffset: -12,
            spm: 4,
            ownerCellIds: ['cell-modem-rf-1'],
          },
          {
            kind: 'Certification',
            name: 'NPU Design Sign-off',
            startOffset: -12,
            endOffset: -10,
            spm: 2,
            ownerCellIds: ['cell-gpu-pnr-1'],
          },
        ],
      },
      {
        id: 'tsk-flg-modap-pnr',
        code: 'TSK-PNR-1',
        name: 'NPU Place & Route',
        processPath: ['proc-soc', 'proc-soc-evt0', 'proc-megaip', 'proc-npu', 'proc-npu-pnr', 'proc-npu-pnr-route'],
        startOffset: -12,
        endOffset: -2,
        scheduleClass: 'new',
        ownerCellIds: ['cell-gpu-pnr-1'],
        spm: 18,
        subs: [
          {
            kind: 'Certification',
            name: 'Routing Timing Closure',
            startOffset: -6,
            endOffset: -2,
            spm: 3,
            ownerCellIds: ['cell-gpu-pnr-1'],
          },
        ],
      },
      {
        id: 'tsk-flg-modap-postsi',
        code: 'TSK-POSTSI-1',
        name: 'Post-Silicon Validation',
        processPath: ['proc-test', 'proc-test-postsi', 'proc-test-postsi-validation', 'proc-test-postsi-validation-perf'],
        startOffset: 0,
        endOffset: 9,
        scheduleClass: 'new',
        ownerCellIds: ['cell-mm-av-sw'],
        spm: 12,
        subs: [
          {
            kind: 'RF',
            name: 'Modem RF Conformance',
            startOffset: 1,
            endOffset: 6,
            spm: 5,
            ownerCellIds: ['cell-modem-rf-1'],
          },
          {
            kind: 'Certification',
            name: 'GCF / PTCRB Certification',
            startOffset: 4,
            endOffset: 9,
            spm: 4,
            ownerCellIds: ['cell-modem-rf-1'],
          },
        ],
      },
    ]),
  },
  {
    id: 'pf-slim-mod-1',
    code: 'SLM-MODAP-1',
    name: 'Slim Modem 1st',
    bizTeamId: 'biz-m-soc',
    familyGroup: 'Derivatives',
    mtoAnchor: '2027-12',
    scheduleClass: 'new',
    tasks: buildTasks('2027-12', [
      {
        id: 'tsk-slm-rtl',
        code: 'TSK-RTL-2',
        name: 'Modem RTL Refresh',
        processPath: ['proc-soc', 'proc-soc-evt0', 'proc-sysip', 'proc-sysip-interconnect', 'proc-sysip-interconnect-rtl'],
        startOffset: -18,
        endOffset: -6,
        scheduleClass: 'new',
        ownerCellIds: ['cell-sysip-interconnect-rtl'],
        spm: 16,
        subs: [
          {
            kind: 'RF',
            name: 'RF Front-end Co-Design',
            startOffset: -14,
            endOffset: -6,
            spm: 4,
            ownerCellIds: ['cell-modem-rf-1'],
          },
        ],
      },
      {
        id: 'tsk-slm-postsi',
        code: 'TSK-POSTSI-2',
        name: 'Post-Silicon Conformance',
        processPath: ['proc-test', 'proc-test-postsi', 'proc-test-postsi-validation', 'proc-test-postsi-validation-fc'],
        startOffset: 0,
        endOffset: 6,
        scheduleClass: 'new',
        ownerCellIds: ['cell-mm-av-sw'],
        spm: 9,
        subs: [
          {
            kind: 'Certification',
            name: 'GCF Certification',
            startOffset: 2,
            endOffset: 6,
            spm: 3,
            ownerCellIds: ['cell-modem-rf-1'],
          },
        ],
      },
    ]),
  },
  {
    id: 'pf-pddi-flag',
    code: 'PDDI-FLG-1',
    name: 'pDDI Flagship Refresh',
    bizTeamId: 'biz-pddi',
    familyGroup: 'Basic',
    mtoAnchor: '2027-03',
    scheduleClass: 'fixed',
    tasks: buildTasks('2027-03', [
      {
        id: 'tsk-pddi-design',
        code: 'TSK-PDDI-DES',
        name: 'pDDI Design',
        processPath: ['proc-soc', 'proc-soc-evt0', 'proc-megaip', 'proc-gpu', 'proc-gpu-rtl', 'proc-gpu-rtl-design'],
        startOffset: -24,
        endOffset: -10,
        scheduleClass: 'fixed',
        ownerCellIds: ['cell-pddi-design-1'],
        spm: 22,
        subs: [
          {
            kind: 'Certification',
            name: 'Display Mode Certification',
            startOffset: -12,
            endOffset: -10,
            spm: 2,
            ownerCellIds: ['cell-pddi-design-1'],
          },
        ],
      },
      {
        id: 'tsk-pddi-verif',
        code: 'TSK-PDDI-DV',
        name: 'pDDI Verification',
        processPath: ['proc-soc', 'proc-soc-evt0', 'proc-megaip', 'proc-gpu', 'proc-gpu-rtl', 'proc-gpu-rtl-verif'],
        startOffset: -18,
        endOffset: -4,
        scheduleClass: 'changes',
        ownerCellIds: ['cell-pddi-design-1'],
        spm: 26,
      },
    ]),
  },
]

// ============================================================================================
// Mock seed — MTO milestones (one set per Production Family at the standard offsets).
// State is mocked per offset so the marker palette is exercised.
// ============================================================================================

const milestoneStateForOffset = (offset: number, pfClass: ScheduleClass): MilestoneState => {
  // Past milestones (offset < 0) on a 'fixed' PF are 'normal'. On 'changes' PFs we mark MTO(0) as 'late'.
  // On 'new' PFs all milestones are 'new'. Future milestones default to 'normal' unless slipping.
  if (pfClass === 'new') return 'new'
  if (offset === 0 && pfClass === 'changes') return 'late'
  if (offset === -12 && pfClass === 'changes') return 'late'
  return 'normal'
}

export const MOCK_MTO_MILESTONES: MtoMilestone[] = MOCK_PRODUCTION_FAMILIES.flatMap((pf) =>
  MTO_OFFSETS_STANDARD.map((offset) => ({
    id: `mto::${pf.id}::${offset}`,
    productionFamilyId: pf.id,
    offset,
    label: mtoLabel(offset),
    date: mtoDateFromAnchor(pf.mtoAnchor, offset),
    state: milestoneStateForOffset(offset, pf.scheduleClass),
    cause: offset === 0 && pf.scheduleClass === 'changes' ? 'PnR timing closure pending' : undefined,
    slipDays: offset === 0 && pf.scheduleClass === 'changes' ? 14 : undefined,
  })),
)

// ============================================================================================
// Derived / convenience selectors over the seed.
// ============================================================================================

// Group families by their PFG label (Basic / Leading / Derivatives) preserving spec order.
export const MOCK_FAMILIES_BY_PFG: { group: ProductionFamilyGroup; families: ProductionFamily[] }[] = (() => {
  const out: { group: ProductionFamilyGroup; families: ProductionFamily[] }[] = []
  for (const g of PRODUCTION_FAMILY_GROUPS) {
    const families = MOCK_PRODUCTION_FAMILIES.filter((f) => f.familyGroup === g)
    if (families.length > 0) out.push({ group: g, families })
  }
  return out
})()

// Flat list of every (Cell, OrgRef) — used to drive headcount portfolio rollups.
export type FlatCellEntry = { cell: Cell; ref: OrgRef; path: string[] }

export const MOCK_FLAT_CELLS: FlatCellEntry[] = (() => {
  const out: FlatCellEntry[] = []
  for (const division of MOCK_DIVISIONS) {
    for (const s of division.sites) {
      for (const t of s.teams) {
        for (const g of t.groups) {
          for (const p of g.parts) {
            for (const c of p.cells) {
              out.push({
                cell: c,
                ref: {
                  divisionId: division.id,
                  siteId: s.id,
                  teamId: t.id,
                  groupId: g.id,
                  partId: p.id,
                  cellId: c.id,
                },
                path: [division.name, s.name, t.name, g.name, p.name, c.name],
              })
            }
          }
        }
      }
    }
  }
  return out
})()

// Total headcount portfolio across every Cell — used as the SAFE / LIMIT reference for the Overall
// Resource capacity chart in the simulation Quick Analysis.
export const TOTAL_HEADCOUNT = MOCK_FLAT_CELLS.reduce((s, e) => s + e.cell.headcount, 0)

// Reference lines for the simulation overall-capacity chart — total monthly capacity = headcount × 1 month.
// We treat the SPM unit as 1 person × 1 month, so the LIMIT equals total headcount per month and SAFE = 80%.
export const HEADCOUNT_CAPACITY_LIMIT = TOTAL_HEADCOUNT
export const HEADCOUNT_CAPACITY_SAFE = Math.round(TOTAL_HEADCOUNT * 0.8)

// ----------------------------------------------------------------------------
// Standard Personal Monthly (SPM) demand — aggregated per month-offset across all activities.
// ----------------------------------------------------------------------------
// `monthlyDemandByStage` is a Map keyed by month-offset (-36 .. +36 around the earliest MTO anchor),
// values are records of stage code → SPM in that month. Used by the simulation Quick Analysis (stacked
// area) and by the analysis panel.

// Compute the inclusive months a task occupies, given its start/end ISO dates and its PF's MTO anchor.
// Returns a list of month offsets relative to MTO(0).
const monthOffsetsCovered = (anchorYearMonth: string, startIso: string, endIso: string): number[] => {
  const [aY, aM] = anchorYearMonth.split('-').map(Number)
  const anchorIdx = aY * 12 + (aM - 1)
  const startD = new Date(startIso)
  const endD = new Date(endIso)
  const startIdx = startD.getUTCFullYear() * 12 + startD.getUTCMonth()
  const endIdx = endD.getUTCFullYear() * 12 + endD.getUTCMonth()
  const months: number[] = []
  for (let i = startIdx; i <= endIdx; i++) months.push(i - anchorIdx)
  return months
}

// Stage code of a task: the first id in its processPath, mapped through MOCK_PROCESS_INDEX.code.
const stageCodeForTask = (t: EngineeringTask): string => {
  const stageId = t.processPath[0]
  return stageId ? (MOCK_PROCESS_INDEX[stageId]?.code ?? stageId) : 'UNKNOWN'
}

export type StageDemandRow = { stage: string; demand: number }

// monthOffset → array of stage demand entries.
export const MOCK_MONTHLY_DEMAND_BY_STAGE: Map<number, StageDemandRow[]> = (() => {
  const out = new Map<number, Map<string, number>>()
  for (const pf of MOCK_PRODUCTION_FAMILIES) {
    for (const t of pf.tasks) {
      const months = monthOffsetsCovered(pf.mtoAnchor, t.start, t.end)
      const perMonth = months.length ? t.spm / months.length : 0
      const stage = stageCodeForTask(t)
      for (const off of months) {
        const row = out.get(off) ?? new Map<string, number>()
        row.set(stage, (row.get(stage) ?? 0) + perMonth)
        out.set(off, row)
      }
      for (const s of t.subTasks) {
        const sMonths = monthOffsetsCovered(pf.mtoAnchor, s.start, s.end)
        const sPer = sMonths.length ? s.spm / sMonths.length : 0
        const sStage = `${stage}·${s.kind}`
        for (const off of sMonths) {
          const row = out.get(off) ?? new Map<string, number>()
          row.set(sStage, (row.get(sStage) ?? 0) + sPer)
          out.set(off, row)
        }
      }
    }
  }
  const out2 = new Map<number, StageDemandRow[]>()
  for (const [off, m] of out) {
    out2.set(
      off,
      Array.from(m.entries())
        .map(([stage, demand]) => ({ stage, demand: Math.round(demand * 10) / 10 }))
        .sort((a, b) => a.stage.localeCompare(b.stage)),
    )
  }
  return out2
})()

// Sorted month offsets present in the demand map — used as the x-axis for the overall chart.
export const MOCK_DEMAND_MONTH_OFFSETS: number[] = Array.from(MOCK_MONTHLY_DEMAND_BY_STAGE.keys()).sort((a, b) => a - b)

// Set of distinct stage codes that appear in the demand series, for chart series enumeration.
export const MOCK_DEMAND_STAGE_CODES: string[] = (() => {
  const set = new Set<string>()
  for (const rows of MOCK_MONTHLY_DEMAND_BY_STAGE.values()) for (const r of rows) set.add(r.stage)
  return Array.from(set).sort()
})()

// ----------------------------------------------------------------------------
// Per-org-node planned demand vs available headcount — for the Quick Analysis "Organization Resources"
// card and the Headcount Portfolio panel. Demand here is *aggregated across the full Gantt window*
// (total person-months allocated to cells under that org node).
// ----------------------------------------------------------------------------

const cellIdsUnder = (node: { teamId?: string; groupId?: string; partId?: string; cellId?: string; siteId?: string; divisionId: string }): Set<string> => {
  const out = new Set<string>()
  for (const e of MOCK_FLAT_CELLS) {
    if (node.cellId && e.ref.cellId !== node.cellId) continue
    if (node.partId && e.ref.partId !== node.partId) continue
    if (node.groupId && e.ref.groupId !== node.groupId) continue
    if (node.teamId && e.ref.teamId !== node.teamId) continue
    if (node.siteId && e.ref.siteId !== node.siteId) continue
    if (e.ref.divisionId !== node.divisionId) continue
    out.add(e.cell.id)
  }
  return out
}

export type OrgDemandRow = { label: string; ref: OrgRef; headcount: number; demand: number }

// One row per Division — the default rollup for the simulation Quick Analysis Org chart.
export const MOCK_ORG_DEMAND_BY_DIVISION: OrgDemandRow[] = MOCK_DIVISIONS.map((d) => {
  const ids = cellIdsUnder({ divisionId: d.id })
  const headcount = MOCK_FLAT_CELLS.filter((e) => ids.has(e.cell.id)).reduce((s, e) => s + e.cell.headcount, 0)
  let demand = 0
  for (const pf of MOCK_PRODUCTION_FAMILIES) {
    for (const t of pf.tasks) {
      if (t.ownerCellIds.some((id) => ids.has(id))) demand += t.spm
      for (const s of t.subTasks) if (s.ownerCellIds.some((id) => ids.has(id))) demand += s.spm
    }
  }
  return { label: d.name, ref: { divisionId: d.id }, headcount, demand: Math.round(demand) }
})

// One row per Team — finer rollup for the Headcount Portfolio detail.
export const MOCK_ORG_DEMAND_BY_TEAM: OrgDemandRow[] = (() => {
  const out: OrgDemandRow[] = []
  for (const d of MOCK_DIVISIONS) {
    for (const s of d.sites) {
      for (const t of s.teams) {
        const ref: OrgRef = { divisionId: d.id, siteId: s.id, teamId: t.id }
        const ids = cellIdsUnder(ref)
        const headcount = MOCK_FLAT_CELLS.filter((e) => ids.has(e.cell.id)).reduce((acc, e) => acc + e.cell.headcount, 0)
        let demand = 0
        for (const pf of MOCK_PRODUCTION_FAMILIES) {
          for (const tk of pf.tasks) {
            if (tk.ownerCellIds.some((id) => ids.has(id))) demand += tk.spm
            for (const st of tk.subTasks) if (st.ownerCellIds.some((id) => ids.has(id))) demand += st.spm
          }
        }
        out.push({ label: `${d.code} · ${t.name}`, ref, headcount, demand: Math.round(demand) })
      }
    }
  }
  return out
})()

// ============================================================================================
// Production family index helper.
// ============================================================================================

export const productionFamilyById = (id: string): ProductionFamily | undefined => MOCK_PRODUCTION_FAMILIES.find((p) => p.id === id)

export const bizTeamById = (id: string): BizTeam | undefined => MOCK_BIZ_TEAMS.find((t) => t.id === id)

export const cellById = (id: string): Cell | undefined => MOCK_FLAT_CELLS.find((e) => e.cell.id === id)?.cell

// Build "Division › Site › Team › Group › Part › Cell" path string for a cell id.
export const orgPathForCell = (cellId: string): string => {
  const e = MOCK_FLAT_CELLS.find((x) => x.cell.id === cellId)
  return e ? e.path.join(' › ') : '—'
}

// "Stage › Block › Function › Activity" path string for a task's processPath.
export const processPathLabel = (processPath: string[]): string =>
  processPath
    .map((id) => MOCK_PROCESS_INDEX[id]?.name ?? id)
    .filter(Boolean)
    .join(' › ')

// MTO milestones belonging to a given Production Family.
export const milestonesForFamily = (pfId: string): MtoMilestone[] => MOCK_MTO_MILESTONES.filter((m) => m.productionFamilyId === pfId)
