import { makeAutoObservable } from 'mobx'

export type SourceStatus = 'healthy' | 'delayed' | 'stale' | 'down' | 'not-configured'

export type DataSource = {
  id: string
  name: string
  type: string
  lastSync: string
  status: SourceStatus
  latency: string
}

// IRIS exchanges data with five Samsung enterprise systems. N-PLM is the source of truth
// for product requirements + organisation; SMDM + GHRP own headcount and skill groups;
// PROMIS is the downstream consumer of approved roadmaps; Teamcenter feeds PLM/spec data;
// Samsung AI Services backs the co-pilot. Status mirrors the SyncQueue health.
const SOURCES: DataSource[] = [
  { id: 'nplm', name: 'N-PLM', type: 'Product requirements · master data', lastSync: '2026-05-25 06:01', status: 'healthy', latency: '1.4s' },
  { id: 'smdm', name: 'SMDM', type: 'Org hierarchy · skill groups', lastSync: '2026-05-25 06:01', status: 'healthy', latency: '2.0s' },
  { id: 'ghrp', name: 'GHRP', type: 'Headcount snapshot · hiring plan', lastSync: '2026-05-25 06:00', status: 'healthy', latency: '0.8s' },
  { id: 'promis', name: 'PROMIS', type: 'Profit / cost · approved roadmap sink', lastSync: '2026-05-25 06:01', status: 'healthy', latency: 'Δ-sync 30 min' },
  { id: 'teamcenter', name: 'Teamcenter (PLM)', type: 'Engineering spec · prior-gen specs', lastSync: '2026-05-25 05:45', status: 'delayed', latency: '16 min ▲' },
  { id: 'pmplanner', name: 'PM Planner (legacy)', type: 'Mendix 9 — being decommissioned', lastSync: '2026-05-22 09:00', status: 'stale', latency: '3 days' },
  { id: 'aiservices', name: 'Samsung AI Services', type: 'Demand forecast · AI co-pilot', lastSync: '2026-05-25 04:00', status: 'healthy', latency: '2 hr' },
  { id: 'workday', name: 'Workday (cross-site HR)', type: 'Austin / Xi\'an HR — read only', lastSync: '—', status: 'not-configured', latency: '—' },
]

export class IntegrationStore {
  sources: DataSource[] = SOURCES
  selectedId = 'nplm'

  constructor() {
    makeAutoObservable(this)
  }

  get selected(): DataSource | undefined {
    return this.sources.find((s) => s.id === this.selectedId)
  }

  select(id: string) {
    this.selectedId = id
  }
}
