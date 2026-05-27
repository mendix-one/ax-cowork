// Centralized mock data for the Dynamic Schedule UI concept.
// All values are illustrative only — no backend or services are wired.

export type LotStatus = 'on-track' | 'at-risk' | 'slipped' | 'hot-lot'

// Production order lifecycle status — shown in the PO table chip column.
// Risk-bearing states ('at-risk', 'slipped') are surfaced via dedicated chip styles so the table matches the
// "2 at-risk PO · review priorities" claim in the Production Order summary KPI.
export type PoStatus = 'READY' | 'RUNNING' | 'COMPLETED' | 'CANCELLED' | 'ON HOLD' | 'at-risk' | 'slipped'

// Update 3 — schedule classification. Drives bar colour on the gantt.
//   • fixed   — old schedule, applied and running now
//   • changes — old schedule but modified in this session
//   • new     — newly added in this session
export type ScheduleClass = 'fixed' | 'changes' | 'new'

// Milestone state — drives marker colour & tooltip framing.
//   • new    — freshly added
//   • normal — on track
//   • late   — at risk of slipping
//   • cannot — cannot be completed
export type MilestoneState = 'new' | 'normal' | 'late' | 'cannot'

export type ScheduleBatch = {
  id: string
  name: string // e.g. "B-1"
  waferCount: number
  start: string
  end: string
  durationDays: number
  status: LotStatus
  scheduleClass: ScheduleClass
  toolGroup?: string
  note?: string
}

export type ScheduleFamily = {
  id: string
  label: string // family code / SKU, e.g. "V9-QLC-A"
  tech: string // technology code, e.g. "T-V9-232L"
  priority: 'P1' | 'P2' | 'P3' | 'P-NPI'
  hotLot?: boolean
  start: string
  end: string
  durationDays: number
  status: LotStatus
  scheduleClass: ScheduleClass
  batches: ScheduleBatch[]
}

export type ScheduleMilestone = {
  id: string
  label: string
  date: string
  shipmentWafers: number // total wafers committed at this milestone
  status: LotStatus
  state: MilestoneState
  slipDays?: number
  cause?: string
  familyId?: string
  // Per-PO/PF shipment commitment list shown in the marker tooltip.
  commitments?: { po: string; pf: string; wafers: number }[]
}

export type ProductionOrder = {
  id: string
  customer: string
  customerShort: string
  family: string
  qty: number
  // Wafers already produced against the commitment (qty). Drives the progress % column.
  outWafers: number
  priority: 'P1' | 'P2' | 'P3' | 'P-NPI'
  hotLot?: boolean
  npi?: boolean
  m1Date: string
  m1Slip?: number
  m1Status: LotStatus
  spec: string
  waferStart: string
  end: string
  lotSize: number
  status: LotStatus
  poStatus: PoStatus
  scheduleClass: ScheduleClass
  schedule: ScheduleFamily[]
  milestones: ScheduleMilestone[]
}

export const HORIZON_START = '2026-04-29'
export const HORIZON_DAYS = 14
export const HORIZON_TODAY = '2026-05-04'

const addDays = (start: string, days: number): string => {
  const d = new Date(start)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const horizonDate = (offset: number): string => addDays(HORIZON_START, offset)
const horizonLabel = (offset: number): string => {
  const d = new Date(horizonDate(offset))
  return `${String(d.getUTCDate()).padStart(2, '0')} ${WEEKDAY[d.getUTCDay()]}`
}

export const HORIZON_DATES: string[] = Array.from({ length: HORIZON_DAYS }, (_, i) => horizonDate(i))
export const HORIZON_LABELS: string[] = Array.from({ length: HORIZON_DAYS }, (_, i) => horizonLabel(i))

// Month groups for the 2-row timeline header
export const HORIZON_MONTH_GROUPS: { month: string; days: number }[] = (() => {
  const groups: { month: string; days: number }[] = []
  const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  for (const date of HORIZON_DATES) {
    const d = new Date(date)
    const label = `${monthName[d.getUTCMonth()]} ${d.getUTCFullYear()}`
    const last = groups[groups.length - 1]
    if (last && last.month === label) last.days += 1
    else groups.push({ month: label, days: 1 })
  }
  return groups
})()

export const MOCK_PRODUCTION_ORDERS: ProductionOrder[] = [
  {
    id: 'PO-2025-118',
    customer: 'Customer A',
    customerShort: 'Cust A',
    family: 'V9-QLC-A',
    qty: 12000,
    outWafers: 7800,
    priority: 'P1',
    hotLot: true,
    m1Date: '2026-05-12',
    m1Status: 'on-track',
    spec: 'SP-QLC-V9 v3.4',
    waferStart: '2026-04-29',
    end: '2026-05-12',
    lotSize: 25,
    status: 'on-track',
    poStatus: 'RUNNING',
    scheduleClass: 'fixed',
    schedule: [
      {
        id: 'fam-118-v9-qlc-a',
        label: 'V9-QLC-A',
        tech: 'T-V9-232L',
        priority: 'P1',
        hotLot: true,
        start: '2026-04-29',
        end: '2026-05-12',
        durationDays: 14,
        status: 'on-track',
        scheduleClass: 'fixed',
        batches: [
          { id: 'b1', name: 'B-1', waferCount: 200, start: '2026-04-29', end: '2026-05-03', durationDays: 5, status: 'on-track', scheduleClass: 'fixed' },
          { id: 'b2', name: 'B-2', waferCount: 200, start: '2026-05-02', end: '2026-05-07', durationDays: 6, status: 'on-track', scheduleClass: 'fixed' },
          { id: 'b3', name: 'B-3', waferCount: 200, start: '2026-05-05', end: '2026-05-10', durationDays: 6, status: 'on-track', scheduleClass: 'fixed' },
          { id: 'b4', name: 'B-4', waferCount: 175, start: '2026-05-07', end: '2026-05-12', durationDays: 6, status: 'on-track', scheduleClass: 'fixed' },
        ],
      },
    ],
    milestones: [
      {
        id: 'm1',
        label: 'M1',
        date: '2026-05-12',
        shipmentWafers: 1000,
        status: 'on-track',
        state: 'normal',
        familyId: 'fam-118-v9-qlc-a',
        commitments: [{ po: 'PO-2025-118', pf: 'V9-QLC-A', wafers: 1000 }],
      },
    ],
  },
  {
    id: 'PO-2025-119',
    customer: 'Customer B',
    customerShort: 'Cust B',
    family: 'V9-TLC-B',
    qty: 8000,
    outWafers: 3600,
    priority: 'P2',
    m1Date: '2026-05-12',
    m1Slip: 2,
    m1Status: 'at-risk',
    spec: 'SP-TLC-V9 v3.2',
    waferStart: '2026-05-02',
    end: '2026-05-12',
    lotSize: 25,
    status: 'at-risk',
    poStatus: 'RUNNING',
    scheduleClass: 'changes',
    schedule: [
      {
        id: 'fam-119-v9-tlc-b',
        label: 'V9-TLC-B',
        tech: 'T-V9-176L',
        priority: 'P2',
        start: '2026-05-02',
        end: '2026-05-12',
        durationDays: 10,
        status: 'at-risk',
        scheduleClass: 'changes',
        batches: [
          { id: 'b1', name: 'B-1', waferCount: 175, start: '2026-05-02', end: '2026-05-06', durationDays: 5, status: 'on-track', scheduleClass: 'fixed' },
          { id: 'b2', name: 'B-2', waferCount: 175, start: '2026-05-04', end: '2026-05-09', durationDays: 6, status: 'at-risk', scheduleClass: 'changes' },
          { id: 'b3', name: 'B-3', waferCount: 150, start: '2026-05-07', end: '2026-05-12', durationDays: 6, status: 'at-risk', scheduleClass: 'changes' },
        ],
      },
    ],
    milestones: [
      {
        id: 'm1',
        label: 'M1',
        date: '2026-05-12',
        shipmentWafers: 500,
        status: 'slipped',
        state: 'late',
        slipDays: 2,
        cause: 'HARC overload',
        familyId: 'fam-119-v9-tlc-b',
        commitments: [{ po: 'PO-2025-119', pf: 'V9-TLC-B', wafers: 500 }],
      },
    ],
  },
  {
    id: 'PO-2025-120',
    customer: 'Customer C',
    customerShort: 'Cust C',
    family: 'V9-QLC-A',
    qty: 15000,
    outWafers: 4200,
    priority: 'P3',
    m1Date: '2026-05-11',
    m1Slip: 4,
    m1Status: 'slipped',
    spec: 'SP-QLC-V9 v3.4',
    waferStart: '2026-05-04',
    end: '2026-05-12',
    lotSize: 25,
    status: 'slipped',
    poStatus: 'ON HOLD',
    scheduleClass: 'changes',
    schedule: [
      {
        id: 'fam-120-v9-qlc-a',
        label: 'V9-QLC-A',
        tech: 'T-V9-232L',
        priority: 'P3',
        start: '2026-05-04',
        end: '2026-05-12',
        durationDays: 9,
        status: 'slipped',
        scheduleClass: 'changes',
        batches: [
          { id: 'b1', name: 'B-1', waferCount: 250, start: '2026-05-04', end: '2026-05-08', durationDays: 5, status: 'on-track', scheduleClass: 'fixed' },
          { id: 'b2', name: 'B-2', waferCount: 250, start: '2026-05-06', end: '2026-05-11', durationDays: 6, status: 'slipped', scheduleClass: 'changes' },
          { id: 'b3', name: 'B-3', waferCount: 200, start: '2026-05-08', end: '2026-05-12', durationDays: 5, status: 'at-risk', scheduleClass: 'changes' },
        ],
      },
    ],
    milestones: [
      {
        id: 'm1',
        label: 'M1',
        date: '2026-05-11',
        shipmentWafers: 1200,
        status: 'slipped',
        state: 'cannot',
        slipDays: 4,
        cause: 'Probe over-cap',
        familyId: 'fam-120-v9-qlc-a',
        commitments: [{ po: 'PO-2025-120', pf: 'V9-QLC-A', wafers: 1200 }],
      },
    ],
  },
  {
    id: 'PO-2025-121',
    customer: 'Customer D',
    customerShort: 'Cust D',
    family: 'V9-TLC-C',
    qty: 5000,
    outWafers: 0,
    priority: 'P3',
    m1Date: '2026-05-12',
    m1Status: 'on-track',
    spec: 'SP-TLC-V9 v2.8',
    waferStart: '2026-05-06',
    end: '2026-05-12',
    lotSize: 25,
    status: 'on-track',
    poStatus: 'READY',
    scheduleClass: 'new',
    schedule: [
      {
        id: 'fam-121-v9-tlc-c',
        label: 'V9-TLC-C',
        tech: 'T-V9-128L',
        priority: 'P3',
        start: '2026-05-06',
        end: '2026-05-12',
        durationDays: 7,
        status: 'on-track',
        scheduleClass: 'new',
        batches: [
          { id: 'b1', name: 'B-1', waferCount: 125, start: '2026-05-06', end: '2026-05-09', durationDays: 4, status: 'on-track', scheduleClass: 'new' },
          { id: 'b2', name: 'B-2', waferCount: 125, start: '2026-05-08', end: '2026-05-12', durationDays: 5, status: 'on-track', scheduleClass: 'new' },
        ],
      },
    ],
    milestones: [
      {
        id: 'm1',
        label: 'M1',
        date: '2026-05-12',
        shipmentWafers: 800,
        status: 'on-track',
        state: 'new',
        familyId: 'fam-121-v9-tlc-c',
        commitments: [{ po: 'PO-2025-121', pf: 'V9-TLC-C', wafers: 800 }],
      },
    ],
  },
]

export const WORKLOAD_STRIP: { toolGroup: string; utilization: number }[] = [
  { toolGroup: 'HARC Etch', utilization: 78 },
  { toolGroup: 'WL Fill', utilization: 41 },
  { toolGroup: 'Probe', utilization: 89 },
]

// --- Quick Analysis mock data ---------------------------------------------------------------------------------------
// Tool groups listed in processing order (FEOL → BEOL → Probe → Asm).
// `total` = daily movement capacity (wafer-passes/day equivalent). `used` = current consumed capacity.

export type ToolGroupCapacity = {
  name: string
  total: number
  used: number
}

export const TOOL_GROUP_CAPACITIES: ToolGroupCapacity[] = [
  { name: 'FEOL Dep', total: 1000, used: 720 },
  { name: 'ONON CVD', total: 950, used: 780 },
  { name: 'HARC Etch', total: 800, used: 870 }, // ❗ overloaded
  { name: 'WL Fill', total: 600, used: 410 },
  { name: 'CMP', total: 700, used: 560 },
  { name: 'BEOL', total: 900, used: 700 },
  { name: 'Probe', total: 750, used: 670 }, // ⚠ highload (>80%)
  { name: 'Asm', total: 500, used: 320 },
]

// Shop-floor aggregate ceilings — sum across tool groups.
export const SHOP_FLOOR_CAPACITY_LIMIT = TOOL_GROUP_CAPACITIES.reduce((s, g) => s + g.total, 0) // ≈ 6200
export const SHOP_FLOOR_CAPACITY_SAFE = Math.round(SHOP_FLOOR_CAPACITY_LIMIT * 0.8) // 80% threshold

// Daily per-tool-group usage matrix for the stacked area chart.
// Generated deterministically over HORIZON_DATES so the chart aligns with the gantt timeline.
const wave = (i: number, base: number, amp: number, period: number) => Math.round(base + amp * Math.sin((i / period) * Math.PI * 2))

export const DAILY_TOOL_GROUP_USAGE: { date: string; usage: Record<string, number> }[] = HORIZON_DATES.map((date, i) => {
  const usage: Record<string, number> = {}
  for (const tg of TOOL_GROUP_CAPACITIES) {
    // Wave around `used` with ±15% amplitude, slight offset per group so curves are distinguishable.
    const offset = TOOL_GROUP_CAPACITIES.indexOf(tg)
    usage[tg.name] = Math.max(0, wave(i + offset, tg.used, tg.used * 0.15, 7))
  }
  return { date, usage }
})

// --- Production Process routing -------------------------------------------------------------------------------------
// Per tech code, the ordered manufacturing process steps. Tool groups are referenced by `name` so they line up
// with TOOL_GROUP_CAPACITIES — the Production Process view derives utilization & bottleneck from that source.
//
// Cycle time is per-batch hours (not per-wafer); yield is the expected pass-through ratio for the step.

export type ProcessStepStage = 'FEOL' | 'MOL' | 'BEOL' | 'Test' | 'Assembly'

export type ProcessStep = {
  id: string
  order: number
  name: string // step short label, e.g. "ONON Stack"
  stage: ProcessStepStage
  toolGroup: string // must match a TOOL_GROUP_CAPACITIES.name
  recipe: string // e.g. "R-QLC-V9-232"
  qualRequired: boolean // step demands a recipe qualification on the tool
  cycleHours: number // batch cycle time (one wafer slot, full 25-wafer batch)
  expectedYield: number // 0..1 — wafers out / wafers in for this step
  note?: string
}

export type TechRouting = {
  tech: string // matches ScheduleFamily.tech, e.g. "T-V9-232L"
  family: string // representative family code, e.g. "V9-QLC-A"
  description: string
  layers: number // memory stack height, e.g. 232
  bitDensity: 'TLC' | 'QLC' // bits-per-cell (TLC=3, QLC=4)
  steps: ProcessStep[]
}

// 232L QLC — densest stack, longest HARC etch; HARC is the structural bottleneck for this tech.
const STEPS_232L: ProcessStep[] = [
  { id: 's1', order: 1, name: 'FEOL Deposit', stage: 'FEOL', toolGroup: 'FEOL Dep', recipe: 'R-FEOL-V9', qualRequired: false, cycleHours: 18, expectedYield: 0.998 },
  { id: 's2', order: 2, name: 'ONON Stack', stage: 'FEOL', toolGroup: 'ONON CVD', recipe: 'R-CVD-232L', qualRequired: true, cycleHours: 36, expectedYield: 0.996, note: '232 oxide/nitride pairs' },
  { id: 's3', order: 3, name: 'HARC Etch', stage: 'FEOL', toolGroup: 'HARC Etch', recipe: 'R-HARC-232L', qualRequired: true, cycleHours: 30, expectedYield: 0.985, note: 'Bottleneck — deep channel etch' },
  { id: 's4', order: 4, name: 'WL Tungsten Fill', stage: 'MOL', toolGroup: 'WL Fill', recipe: 'R-WL-CVD', qualRequired: false, cycleHours: 24, expectedYield: 0.994 },
  { id: 's5', order: 5, name: 'CMP', stage: 'MOL', toolGroup: 'CMP', recipe: 'R-CMP-232', qualRequired: false, cycleHours: 12, expectedYield: 0.997 },
  { id: 's6', order: 6, name: 'BEOL Metal', stage: 'BEOL', toolGroup: 'BEOL', recipe: 'R-BEOL-V9', qualRequired: false, cycleHours: 20, expectedYield: 0.995 },
  { id: 's7', order: 7, name: 'Wafer Probe', stage: 'Test', toolGroup: 'Probe', recipe: 'R-PRB-QLC-V9', qualRequired: true, cycleHours: 8, expectedYield: 0.93, note: 'QLC sort, 1024-Vt levels' },
  { id: 's8', order: 8, name: 'Assembly', stage: 'Assembly', toolGroup: 'Asm', recipe: 'R-ASM-eMMC', qualRequired: false, cycleHours: 16, expectedYield: 0.99 },
]

// 176L TLC — mid-density; cycle times shorter, yield higher.
const STEPS_176L: ProcessStep[] = [
  { id: 's1', order: 1, name: 'FEOL Deposit', stage: 'FEOL', toolGroup: 'FEOL Dep', recipe: 'R-FEOL-V9', qualRequired: false, cycleHours: 18, expectedYield: 0.998 },
  { id: 's2', order: 2, name: 'ONON Stack', stage: 'FEOL', toolGroup: 'ONON CVD', recipe: 'R-CVD-176L', qualRequired: true, cycleHours: 28, expectedYield: 0.997, note: '176 oxide/nitride pairs' },
  { id: 's3', order: 3, name: 'HARC Etch', stage: 'FEOL', toolGroup: 'HARC Etch', recipe: 'R-HARC-176L', qualRequired: true, cycleHours: 22, expectedYield: 0.99 },
  { id: 's4', order: 4, name: 'WL Tungsten Fill', stage: 'MOL', toolGroup: 'WL Fill', recipe: 'R-WL-CVD', qualRequired: false, cycleHours: 20, expectedYield: 0.996 },
  { id: 's5', order: 5, name: 'CMP', stage: 'MOL', toolGroup: 'CMP', recipe: 'R-CMP-176', qualRequired: false, cycleHours: 10, expectedYield: 0.997 },
  { id: 's6', order: 6, name: 'BEOL Metal', stage: 'BEOL', toolGroup: 'BEOL', recipe: 'R-BEOL-V9', qualRequired: false, cycleHours: 20, expectedYield: 0.996 },
  { id: 's7', order: 7, name: 'Wafer Probe', stage: 'Test', toolGroup: 'Probe', recipe: 'R-PRB-TLC-V9', qualRequired: true, cycleHours: 6, expectedYield: 0.96 },
  { id: 's8', order: 8, name: 'Assembly', stage: 'Assembly', toolGroup: 'Asm', recipe: 'R-ASM-eMMC', qualRequired: false, cycleHours: 16, expectedYield: 0.99 },
]

// 128L TLC — legacy node, fastest cycle, best yield.
const STEPS_128L: ProcessStep[] = [
  { id: 's1', order: 1, name: 'FEOL Deposit', stage: 'FEOL', toolGroup: 'FEOL Dep', recipe: 'R-FEOL-V8', qualRequired: false, cycleHours: 14, expectedYield: 0.999 },
  { id: 's2', order: 2, name: 'ONON Stack', stage: 'FEOL', toolGroup: 'ONON CVD', recipe: 'R-CVD-128L', qualRequired: false, cycleHours: 22, expectedYield: 0.998 },
  { id: 's3', order: 3, name: 'HARC Etch', stage: 'FEOL', toolGroup: 'HARC Etch', recipe: 'R-HARC-128L', qualRequired: false, cycleHours: 18, expectedYield: 0.993 },
  { id: 's4', order: 4, name: 'WL Tungsten Fill', stage: 'MOL', toolGroup: 'WL Fill', recipe: 'R-WL-CVD', qualRequired: false, cycleHours: 18, expectedYield: 0.997 },
  { id: 's5', order: 5, name: 'CMP', stage: 'MOL', toolGroup: 'CMP', recipe: 'R-CMP-128', qualRequired: false, cycleHours: 10, expectedYield: 0.998 },
  { id: 's6', order: 6, name: 'BEOL Metal', stage: 'BEOL', toolGroup: 'BEOL', recipe: 'R-BEOL-V8', qualRequired: false, cycleHours: 18, expectedYield: 0.996 },
  { id: 's7', order: 7, name: 'Wafer Probe', stage: 'Test', toolGroup: 'Probe', recipe: 'R-PRB-TLC-V8', qualRequired: false, cycleHours: 6, expectedYield: 0.97 },
  { id: 's8', order: 8, name: 'Assembly', stage: 'Assembly', toolGroup: 'Asm', recipe: 'R-ASM-eMMC', qualRequired: false, cycleHours: 14, expectedYield: 0.99 },
]

export const TECH_ROUTINGS: TechRouting[] = [
  { tech: 'T-V9-232L', family: 'V9-QLC-A', description: '232-layer QLC NAND, V9 generation', layers: 232, bitDensity: 'QLC', steps: STEPS_232L },
  { tech: 'T-V9-176L', family: 'V9-TLC-B', description: '176-layer TLC NAND, V9 generation', layers: 176, bitDensity: 'TLC', steps: STEPS_176L },
  { tech: 'T-V9-128L', family: 'V9-TLC-C', description: '128-layer TLC NAND, V8 platform', layers: 128, bitDensity: 'TLC', steps: STEPS_128L },
]

// --- Tooling constraints --------------------------------------------------------------------------------------------
// Events that impact the plan window: PM maintenance, qualification expirations, ramp-ups of new tools, downtime.
// The Shop Floor view surfaces these so the planner can see *why* a tool group is constrained.

export type ConstraintKind = 'pm' | 'qual-expiry' | 'downtime' | 'ramp-up' | 'recipe-lock'
export type ConstraintSeverity = 'info' | 'warning' | 'critical'

export type ToolingConstraint = {
  id: string
  kind: ConstraintKind
  severity: ConstraintSeverity
  toolGroup: string // matches TOOL_GROUP_CAPACITIES.name
  toolId?: string // optional specific tool, e.g. "ETC-44"
  start: string // YYYY-MM-DD
  end: string // YYYY-MM-DD
  title: string
  detail: string
  // Estimated impact on the group's daily throughput while active, 0..1 (0.2 = 20% capacity loss).
  impactRatio: number
}

export const TOOLING_CONSTRAINTS: ToolingConstraint[] = [
  {
    id: 'c1',
    kind: 'pm',
    severity: 'warning',
    toolGroup: 'HARC Etch',
    toolId: 'ETC-44',
    start: '2026-05-06',
    end: '2026-05-07',
    title: 'PM window — ETC-44 (2 days)',
    detail: 'Scheduled preventive maintenance. Chamber C drift trending up, full PM expected.',
    impactRatio: 0.12,
  },
  {
    id: 'c2',
    kind: 'qual-expiry',
    severity: 'critical',
    toolGroup: 'HARC Etch',
    toolId: 'ETC-44',
    start: '2026-06-12',
    end: '2026-06-12',
    title: 'Qual expiring — R-HARC-232L on ETC-44 chamber C',
    detail: 'Re-qualification monolot required by 2026-06-12 or chamber drops off the qual matrix.',
    impactRatio: 0,
  },
  {
    id: 'c3',
    kind: 'downtime',
    severity: 'critical',
    toolGroup: 'Probe',
    toolId: 'PRB-07',
    start: '2026-05-01',
    end: '2026-05-03',
    title: 'Down — PRB-07 (3 days)',
    detail: 'Probe card replacement after parametric drift. Estimated -18% Probe group throughput.',
    impactRatio: 0.18,
  },
  {
    id: 'c4',
    kind: 'ramp-up',
    severity: 'info',
    toolGroup: 'WL Fill',
    toolId: 'WL-09',
    start: '2026-05-08',
    end: '2026-05-14',
    title: 'Ramp-up — WL-09 (new tool)',
    detail: 'First production tool of refreshed WL Fill platform. Throttled to 50% for first week, then linear ramp.',
    impactRatio: -0.08,
  },
  {
    id: 'c5',
    kind: 'recipe-lock',
    severity: 'warning',
    toolGroup: 'ONON CVD',
    start: '2026-05-04',
    end: '2026-05-10',
    title: 'Recipe lock — R-CVD-232L',
    detail: 'Process engineering froze the recipe pending SPC review; no changes allowed in the window.',
    impactRatio: 0,
  },
  {
    id: 'c6',
    kind: 'pm',
    severity: 'info',
    toolGroup: 'CMP',
    toolId: 'CMP-12',
    start: '2026-05-11',
    end: '2026-05-11',
    title: 'PM window — CMP-12 (1 day)',
    detail: 'Pad change and slurry line flush.',
    impactRatio: 0.05,
  },
]
