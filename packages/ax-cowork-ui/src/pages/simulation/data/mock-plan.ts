// Centralized mock data for the Dynamic Schedule UI concept.
// All values are illustrative only — no backend or services are wired.

export type LotStatus = 'on-track' | 'at-risk' | 'slipped' | 'hot-lot'

export type ScheduleBatch = {
  id: string
  name: string // e.g. "B-1"
  waferCount: number
  start: string
  end: string
  durationDays: number
  status: LotStatus
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
  batches: ScheduleBatch[]
}

export type ScheduleMilestone = {
  id: string
  label: string
  date: string
  shipmentWafers: number // total wafers committed at this milestone
  status: LotStatus
  slipDays?: number
  cause?: string
  familyId?: string
}

export type ProductionOrder = {
  id: string
  customer: string
  customerShort: string
  family: string
  qty: number
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
    priority: 'P1',
    hotLot: true,
    m1Date: '2026-05-12',
    m1Status: 'on-track',
    spec: 'SP-QLC-V9 v3.4',
    waferStart: '2026-04-29',
    end: '2026-05-12',
    lotSize: 25,
    status: 'on-track',
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
        batches: [
          { id: 'b1', name: 'B-1', waferCount: 200, start: '2026-04-29', end: '2026-05-03', durationDays: 5, status: 'on-track' },
          { id: 'b2', name: 'B-2', waferCount: 200, start: '2026-05-02', end: '2026-05-07', durationDays: 6, status: 'hot-lot', note: '★ HOT' },
          { id: 'b3', name: 'B-3', waferCount: 200, start: '2026-05-05', end: '2026-05-10', durationDays: 6, status: 'on-track' },
          { id: 'b4', name: 'B-4', waferCount: 175, start: '2026-05-07', end: '2026-05-12', durationDays: 6, status: 'on-track' },
        ],
      },
    ],
    milestones: [{ id: 'm1', label: 'M1', date: '2026-05-12', shipmentWafers: 1000, status: 'on-track', familyId: 'fam-118-v9-qlc-a' }],
  },
  {
    id: 'PO-2025-119',
    customer: 'Customer B',
    customerShort: 'Cust B',
    family: 'V9-TLC-B',
    qty: 8000,
    priority: 'P2',
    m1Date: '2026-05-12',
    m1Slip: 2,
    m1Status: 'at-risk',
    spec: 'SP-TLC-V9 v3.2',
    waferStart: '2026-05-02',
    end: '2026-05-12',
    lotSize: 25,
    status: 'at-risk',
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
        batches: [
          { id: 'b1', name: 'B-1', waferCount: 175, start: '2026-05-02', end: '2026-05-06', durationDays: 5, status: 'on-track' },
          { id: 'b2', name: 'B-2', waferCount: 175, start: '2026-05-04', end: '2026-05-09', durationDays: 6, status: 'at-risk', note: '⚠ Cap-overload' },
          { id: 'b3', name: 'B-3', waferCount: 150, start: '2026-05-07', end: '2026-05-12', durationDays: 6, status: 'at-risk' },
        ],
      },
    ],
    milestones: [
      { id: 'm1', label: 'M1', date: '2026-05-12', shipmentWafers: 500, status: 'slipped', slipDays: 2, cause: 'HARC overload', familyId: 'fam-119-v9-tlc-b' },
    ],
  },
  {
    id: 'PO-2025-120',
    customer: 'Customer C',
    customerShort: 'Cust C',
    family: 'V9-QLC-A',
    qty: 15000,
    priority: 'P3',
    m1Date: '2026-05-11',
    m1Slip: 4,
    m1Status: 'slipped',
    spec: 'SP-QLC-V9 v3.4',
    waferStart: '2026-05-04',
    end: '2026-05-12',
    lotSize: 25,
    status: 'slipped',
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
        batches: [
          { id: 'b1', name: 'B-1', waferCount: 250, start: '2026-05-04', end: '2026-05-08', durationDays: 5, status: 'on-track' },
          { id: 'b2', name: 'B-2', waferCount: 250, start: '2026-05-06', end: '2026-05-11', durationDays: 6, status: 'slipped', note: 'SLIP 1d' },
          { id: 'b3', name: 'B-3', waferCount: 200, start: '2026-05-08', end: '2026-05-12', durationDays: 5, status: 'at-risk' },
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
        slipDays: 4,
        cause: 'Probe over-cap',
        familyId: 'fam-120-v9-qlc-a',
      },
    ],
  },
  {
    id: 'PO-2025-121',
    customer: 'Customer D',
    customerShort: 'Cust D',
    family: 'V9-TLC-C',
    qty: 5000,
    priority: 'P3',
    m1Date: '2026-05-12',
    m1Status: 'on-track',
    spec: 'SP-TLC-V9 v2.8',
    waferStart: '2026-05-06',
    end: '2026-05-12',
    lotSize: 25,
    status: 'on-track',
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
        batches: [
          { id: 'b1', name: 'B-1', waferCount: 125, start: '2026-05-06', end: '2026-05-09', durationDays: 4, status: 'on-track' },
          { id: 'b2', name: 'B-2', waferCount: 125, start: '2026-05-08', end: '2026-05-12', durationDays: 5, status: 'on-track' },
        ],
      },
    ],
    milestones: [{ id: 'm1', label: 'M1', date: '2026-05-12', shipmentWafers: 800, status: 'on-track', familyId: 'fam-121-v9-tlc-c' }],
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
