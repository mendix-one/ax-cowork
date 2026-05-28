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

const SOURCES: DataSource[] = [
  { id: 'sap', name: 'SAP S/4 PP/APO', type: 'ERP', lastSync: '2026-05-25 06:01', status: 'healthy', latency: '1.4s' },
  { id: 'mes', name: 'Camstar MES', type: 'MES', lastSync: '2026-05-25 06:01', status: 'healthy', latency: '2.0s' },
  { id: 'smartfact', name: 'Applied SmartFact.', type: 'Dispatching/RTD', lastSync: '2026-05-25 06:00', status: 'healthy', latency: '0.8s' },
  { id: 'e3', name: 'E3 APC / SPC', type: 'Process control', lastSync: '2026-05-25 06:01', status: 'healthy', latency: '1.2s' },
  { id: 'kla', name: 'KLA Yield Mgmt', type: 'Probe yield', lastSync: '2026-05-25 05:45', status: 'delayed', latency: '16 min ▲' },
  { id: 'pm', name: 'PM Calendar (XLSX)', type: 'Equip eng', lastSync: '2026-05-22 09:00', status: 'stale', latency: '3 days' },
  { id: 'demand', name: 'Demand Plan', type: 'Internal', lastSync: '2026-05-25 04:00', status: 'healthy', latency: '2 hr' },
  { id: 'portal', name: 'Customer Portal', type: 'CRM', lastSync: '—', status: 'not-configured', latency: '—' },
]

export class DataIntegrationStore {
  sources: DataSource[] = SOURCES
  selectedId = 'sap'

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
