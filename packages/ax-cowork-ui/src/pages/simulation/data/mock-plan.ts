// Centralized mock data for the Dynamic Schedule UI concept.
// All values are illustrative only — no backend or services are wired.

export type LotStatus = 'on-track' | 'at-risk' | 'slipped' | 'hot-lot'

export type ScheduleStep = {
  id: string
  label: string
  start: string
  durationDays: number
  status: LotStatus
  toolGroup: string
  note?: string
}

export type ScheduleFamily = {
  id: string
  label: string
  start: string
  durationDays: number
  status: LotStatus
  steps: ScheduleStep[]
}

export type ScheduleMilestone = {
  id: string
  label: string
  date: string
  status: LotStatus
  slipDays?: number
  cause?: string
}

export type ProductionOrder = {
  id: string
  customer: string
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
  lotSize: number
  status: LotStatus
  schedule: ScheduleFamily[]
  milestones: ScheduleMilestone[]
}

export const HORIZON_START = '2026-04-29'
export const HORIZON_DAYS = 14
export const HORIZON_LABELS = [
  '29 Mon',
  '30 Tue',
  '01 Wed',
  '02 Thu',
  '03 Fri',
  '04 Sat',
  '05 Sun',
  '06 Mon',
  '07 Tue',
  '08 Wed',
  '09 Thu',
  '10 Fri',
  '11 Sat',
  '12 Sun',
]

export const MOCK_PRODUCTION_ORDERS: ProductionOrder[] = [
  {
    id: 'PO-2025-118',
    customer: 'Cust A',
    family: 'V9-QLC-A',
    qty: 12000,
    priority: 'P1',
    hotLot: true,
    m1Date: '2026-05-25',
    m1Status: 'on-track',
    spec: 'SP-QLC-V9 v3.4',
    waferStart: '2026-04-29',
    lotSize: 25,
    status: 'on-track',
    schedule: [
      {
        id: 'fam-118-v9-qlc-a',
        label: 'Family V9-QLC-A',
        start: '2026-04-29',
        durationDays: 14,
        status: 'on-track',
        steps: [
          { id: 's1', label: 'FEOL Dep', start: '2026-04-29', durationDays: 3, status: 'on-track', toolGroup: 'ONON CVD' },
          { id: 's2', label: 'HARC Etch', start: '2026-05-02', durationDays: 5, status: 'hot-lot', toolGroup: 'HARC Etch', note: '★ HOT' },
          { id: 's3', label: 'WL Fill', start: '2026-05-07', durationDays: 3, status: 'on-track', toolGroup: 'WL Tungsten' },
          { id: 's4', label: 'BEOL', start: '2026-05-10', durationDays: 3, status: 'on-track', toolGroup: 'Metal CVD' },
        ],
      },
    ],
    milestones: [{ id: 'm1', label: 'M1: 1,000 wafers out', date: '2026-05-12', status: 'on-track' }],
  },
  {
    id: 'PO-2025-119',
    customer: 'Cust B',
    family: 'V9-TLC-B',
    qty: 8000,
    priority: 'P2',
    m1Date: '2026-05-24',
    m1Slip: 2,
    m1Status: 'at-risk',
    spec: 'SP-TLC-V9 v3.2',
    waferStart: '2026-05-02',
    lotSize: 25,
    status: 'at-risk',
    schedule: [
      {
        id: 'fam-119-v9-tlc-b',
        label: 'Family V9-TLC-B',
        start: '2026-05-02',
        durationDays: 10,
        status: 'at-risk',
        steps: [
          { id: 's1', label: 'FEOL Dep', start: '2026-05-02', durationDays: 3, status: 'on-track', toolGroup: 'ONON CVD' },
          { id: 's2', label: 'HARC Etch', start: '2026-05-05', durationDays: 4, status: 'at-risk', toolGroup: 'HARC Etch', note: '⚠ Cap-overload' },
          { id: 's3', label: 'WL Fill', start: '2026-05-09', durationDays: 2, status: 'on-track', toolGroup: 'WL Tungsten' },
          { id: 's4', label: 'BEOL', start: '2026-05-11', durationDays: 2, status: 'on-track', toolGroup: 'Metal CVD' },
        ],
      },
    ],
    milestones: [
      { id: 'm1', label: 'M1: 500 wafers out', date: '2026-05-12', status: 'slipped', slipDays: 2, cause: 'HARC overload' },
      { id: 'm2', label: 'M2: 3,000 wafers out', date: '2026-06-15', status: 'on-track' },
    ],
  },
  {
    id: 'PO-2025-120',
    customer: 'Cust C',
    family: 'V9-QLC-A',
    qty: 15000,
    priority: 'P3',
    m1Date: '2026-06-01',
    m1Slip: 4,
    m1Status: 'slipped',
    spec: 'SP-QLC-V9 v3.4',
    waferStart: '2026-05-04',
    lotSize: 25,
    status: 'slipped',
    schedule: [
      {
        id: 'fam-120-v9-qlc-a',
        label: 'Family V9-QLC-A',
        start: '2026-05-04',
        durationDays: 9,
        status: 'slipped',
        steps: [
          { id: 's1', label: 'FEOL Dep', start: '2026-05-04', durationDays: 3, status: 'on-track', toolGroup: 'ONON CVD' },
          { id: 's2', label: 'HARC Etch', start: '2026-05-07', durationDays: 4, status: 'slipped', toolGroup: 'HARC Etch', note: 'SLIP 1d' },
          { id: 's3', label: 'WL Fill', start: '2026-05-11', durationDays: 2, status: 'at-risk', toolGroup: 'WL Tungsten' },
        ],
      },
    ],
    milestones: [{ id: 'm1', label: 'M1: 1,200 wafers out', date: '2026-05-12', status: 'slipped', slipDays: 4, cause: 'Probe over-cap' }],
  },
  {
    id: 'PO-2025-121',
    customer: 'Cust D',
    family: 'V9-TLC-C',
    qty: 5000,
    priority: 'P3',
    m1Date: '2026-06-12',
    m1Status: 'on-track',
    spec: 'SP-TLC-V9 v2.8',
    waferStart: '2026-05-06',
    lotSize: 25,
    status: 'on-track',
    schedule: [
      {
        id: 'fam-121-v9-tlc-c',
        label: 'Family V9-TLC-C',
        start: '2026-05-06',
        durationDays: 6,
        status: 'on-track',
        steps: [
          { id: 's1', label: 'FEOL Dep', start: '2026-05-06', durationDays: 2, status: 'on-track', toolGroup: 'ONON CVD' },
          { id: 's2', label: 'HARC Etch', start: '2026-05-08', durationDays: 2, status: 'on-track', toolGroup: 'HARC Etch' },
          { id: 's3', label: 'WL Fill', start: '2026-05-10', durationDays: 2, status: 'on-track', toolGroup: 'WL Tungsten' },
        ],
      },
    ],
    milestones: [{ id: 'm1', label: 'M1: 800 wafers out', date: '2026-05-12', status: 'on-track' }],
  },
]

export const WORKLOAD_STRIP: { toolGroup: string; utilization: number }[] = [
  { toolGroup: 'HARC Etch', utilization: 78 },
  { toolGroup: 'WL Fill', utilization: 41 },
  { toolGroup: 'Probe', utilization: 89 },
]
