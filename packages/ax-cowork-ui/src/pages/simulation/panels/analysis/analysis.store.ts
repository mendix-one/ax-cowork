import { makeAutoObservable } from 'mobx'

export type HeatBand = 'idle' | 'safe' | 'warning' | 'overload'

export type HeatmapRow = {
  toolGroup: string
  cells: HeatBand[]
}

export type CommitmentRow = {
  customer: string
  poMilestone: string
  p50: string
  p80: string
  p95: string
  slip: number
}

export type ConstraintIssue = {
  id: string
  severity: 'warning' | 'error' | 'info'
  message: string
  hint: string
}

export type KpiCard = {
  id: string
  label: string
  value: string
  delta?: string
  hint?: string
  tone?: 'positive' | 'negative' | 'neutral'
}

const DAYS = ['29', '30', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18']

const heatmapRow = (label: string, cells: HeatBand[]): HeatmapRow => ({ toolGroup: label, cells })

export class AnalysisStore {
  horizonWeeks = 14
  days: string[] = DAYS

  kpis: KpiCard[] = [
    { id: 'adherence', label: 'Plan adherence', value: '87%', delta: '+2.1%', tone: 'positive' },
    { id: 'risk', label: 'Commit at risk', value: '3', hint: 'Cust B, C', tone: 'negative' },
    { id: 'bottleneck', label: 'Bottleneck', value: 'HARC Etch', hint: '→ WL Fill', tone: 'neutral' },
    { id: 'x-factor', label: 'X-factor', value: '3.2', delta: '▼', tone: 'positive' },
    { id: 'yield', label: 'Yield Δ', value: '−1.4%', hint: '232L QLC', tone: 'negative' },
  ]

  heatmap: HeatmapRow[] = [
    heatmapRow('HARC Etch', [
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'overload',
      'overload',
      'overload',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
    ]),
    heatmapRow('ONON CVD', Array(20).fill('warning')),
    heatmapRow('WL Tungsten', [
      'idle',
      'idle',
      'idle',
      'idle',
      'idle',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'warning',
      'idle',
      'idle',
      'idle',
      'idle',
      'idle',
      'idle',
      'idle',
      'idle',
    ]),
    heatmapRow('ArFi Litho', Array(20).fill('warning')),
    heatmapRow('CMP', Array(20).fill('safe')),
    heatmapRow('Probe', [
      'safe',
      'safe',
      'overload',
      'overload',
      'overload',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
      'safe',
    ]),
  ]

  commitments: CommitmentRow[] = [
    { customer: 'A', poMilestone: 'P-118/M1', p50: '05-25', p80: '05-26', p95: '05-28', slip: 0 },
    { customer: 'B', poMilestone: 'P-119/M1', p50: '05-24', p80: '05-26', p95: '05-29', slip: 2 },
    { customer: 'C', poMilestone: 'P-120/M1', p50: '06-01', p80: '06-04', p95: '06-08', slip: 4 },
  ]

  bottleneckTimeline = [
    { week: 'wk1', group: 'HARC' },
    { week: 'wk2', group: 'HARC' },
    { week: 'wk3', group: 'HARC' },
    { week: 'wk4', group: 'HARC' },
    { week: 'wk5', group: 'HARC' },
    { week: 'wk6', group: 'WL' },
    { week: 'wk7', group: 'WL' },
  ]

  constraints: ConstraintIssue[] = [
    { id: 'c1', severity: 'warning', message: 'HARC overload days 08-10 (Plan A)', hint: 'Reroute 6 lots to ETC-07/09?' },
    { id: 'c2', severity: 'warning', message: 'Recipe R-QLC-CH qual expires 2026-06-12 (Tool ETC-44 chamber C)', hint: 'Schedule re-qual.' },
    { id: 'c3', severity: 'warning', message: 'Probe over-capacity days 01-03', hint: 'Sampling rule mismatch?' },
  ]

  constructor() {
    makeAutoObservable(this)
  }
}
