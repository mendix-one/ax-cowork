import { makeAutoObservable } from 'mobx'
import { readJson, writeJson } from '@/acore/storage'

// Production line catalog shared between the HomePage picker and the EPS workspace.
// It lives in acore (not in a page) because boundary rules block cross-page imports — HomePage
// and the EPS page both consume it. A "production line" maps to a Samsung DSR Business Team
// (BizTeam) grouped under a BizGroup (SOC / Sensor / LSI). The EPS workspace is scoped to the
// selected line; the rest of the planning shell filters to it.
export type ProductionLineGroupId = 'SOC' | 'Sensor' | 'LSI'

export type ProductionLine = {
  id: string
  code: string // short label shown on the card, e.g. 'M-SOC', 'mDDI'
  name: string
  group: ProductionLineGroupId
  description?: string
}

export type ProductionLineGroup = {
  id: ProductionLineGroupId
  label: string
  description: string
}

export const PRODUCTION_LINE_GROUPS: ProductionLineGroup[] = [
  { id: 'SOC', label: 'SOC', description: 'System-on-Chip development lines' },
  { id: 'Sensor', label: 'Sensor', description: 'Image sensor development line' },
  { id: 'LSI', label: 'LSI', description: 'Large-Scale Integration / display & power IC lines' },
]

export const PRODUCTION_LINES: ProductionLine[] = [
  { id: 'm-soc', code: 'M-SOC', name: 'Mobile SOC', group: 'SOC', description: 'Mobile application processor roadmap' },
  { id: 'a-soc', code: 'A-SOC', name: 'Auto SOC', group: 'SOC', description: 'Automotive SoC roadmap' },
  { id: 'c-soc', code: 'C-SOC', name: 'Consumer SOC', group: 'SOC', description: 'Consumer / IoT SoC roadmap' },
  { id: 'sensor', code: 'Sensor', name: 'Image Sensor', group: 'Sensor', description: 'ISOCELL image sensor family' },
  { id: 'mddi', code: 'mDDI', name: 'Mobile Display IC', group: 'LSI', description: 'Mobile display driver IC' },
  { id: 'pddi', code: 'pDDI', name: 'Panel Display IC', group: 'LSI', description: 'Large-panel display driver IC' },
  { id: 'tcon', code: 'TCON', name: 'Timing Controller', group: 'LSI', description: 'Display timing controller' },
  { id: 'pmic', code: 'PMIC', name: 'Power Management IC', group: 'LSI', description: 'Power management IC' },
  { id: 'security', code: 'Security', name: 'Security IC', group: 'LSI', description: 'Secure element / security IC' },
  { id: 'rcd', code: 'RCD', name: 'Registered Clock Driver', group: 'LSI', description: 'Memory module clock driver' },
]

const STORAGE_KEY = 'ax.productionLine.selected.v1'

const isString = (v: unknown): v is string => typeof v === 'string'

const findLine = (id: string): ProductionLine | undefined => PRODUCTION_LINES.find((line) => line.id === id)

export class ProductionLineStore {
  groups: ProductionLineGroup[] = PRODUCTION_LINE_GROUPS
  lines: ProductionLine[] = PRODUCTION_LINES
  // Last picked line — persisted so a reload / direct nav to /eps keeps the workspace scoped.
  selectedId: string

  constructor() {
    const persisted = readJson(STORAGE_KEY, isString)
    this.selectedId = persisted && findLine(persisted) ? persisted : PRODUCTION_LINES[0].id
    makeAutoObservable(this)
  }

  get selected(): ProductionLine {
    return findLine(this.selectedId) ?? PRODUCTION_LINES[0]
  }

  linesByGroup(group: ProductionLineGroupId): ProductionLine[] {
    return this.lines.filter((line) => line.group === group)
  }

  setSelected(id: string) {
    if (!findLine(id)) return
    this.selectedId = id
    writeJson(STORAGE_KEY, id)
  }
}
