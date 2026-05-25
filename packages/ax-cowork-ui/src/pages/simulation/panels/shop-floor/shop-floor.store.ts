import { makeAutoObservable } from 'mobx'

export type ToolGroup = {
  id: string
  module: 'FEOL' | 'BEOL' | 'Probe'
  name: string
  utilization: number
}

export type ToolRow = {
  id: string
  chambers: ('up' | 'down' | 'drift')[]
  recipes: string[]
  lastPm: string
  status: 'Running' | 'Down C' | 'SPC alm' | 'PM due'
}

export type QualMatrixRow = {
  recipe: string
  toolQuals: Record<string, boolean>
}

const TOOL_GROUPS: ToolGroup[] = [
  { id: 'onon-cvd', module: 'FEOL', name: 'ONON CVD', utilization: 71 },
  { id: 'arfi-litho', module: 'FEOL', name: 'ArFi Litho', utilization: 64 },
  { id: 'harc-etch', module: 'FEOL', name: 'HARC Etch', utilization: 89 },
  { id: 'cmp', module: 'FEOL', name: 'CMP', utilization: 73 },
  { id: 'clean', module: 'FEOL', name: 'Clean', utilization: 58 },
  { id: 'metal-cvd', module: 'BEOL', name: 'Metal CVD', utilization: 76 },
  { id: 'cu-plate', module: 'BEOL', name: 'Cu Plate', utilization: 62 },
  { id: 'e-test', module: 'Probe', name: 'E-Test', utilization: 85 },
]

const TOOLS: ToolRow[] = [
  { id: 'ETC-41', chambers: ['up', 'up', 'up', 'up'], recipes: ['R-1', 'R-2', 'R-3'], lastPm: '04-28', status: 'Running' },
  { id: 'ETC-42', chambers: ['up', 'up', 'down', 'up'], recipes: ['R-1', 'R-2', 'R-3'], lastPm: '04-22', status: 'Down C' },
  { id: 'ETC-43', chambers: ['up', 'up', 'up', 'up'], recipes: ['R-1', 'R-2', 'R-3', 'R-4'], lastPm: '04-30', status: 'Running' },
  { id: 'ETC-44', chambers: ['up', 'drift', 'up', 'up'], recipes: ['R-1', 'R-2', 'R-4'], lastPm: '05-12', status: 'SPC alm' },
  { id: 'ETC-45', chambers: ['up', 'up', 'up', 'up'], recipes: ['R-2', 'R-3'], lastPm: '05-08', status: 'Running' },
  { id: 'ETC-46', chambers: ['up', 'up', 'up', 'up'], recipes: ['R-1', 'R-3', 'R-4'], lastPm: '05-02', status: 'Running' },
  { id: 'ETC-47', chambers: ['up', 'up', 'up', 'up'], recipes: ['R-2', 'R-3', 'R-4'], lastPm: '04-25', status: 'Running' },
  { id: 'ETC-48', chambers: ['up', 'up', 'up', 'up'], recipes: ['R-1', 'R-2', 'R-3', 'R-4'], lastPm: '05-15', status: 'Running' },
  { id: 'ETC-49', chambers: ['up', 'up', 'up', 'up'], recipes: ['R-1', 'R-2', 'R-3'], lastPm: '05-09', status: 'Running' },
  { id: 'ETC-50', chambers: ['up', 'up', 'down', 'up'], recipes: ['R-1', 'R-2'], lastPm: '04-20', status: 'PM due' },
]

const QUAL_MATRIX: QualMatrixRow[] = [
  {
    recipe: 'R-1 / QLC-CH',
    toolQuals: {
      'ETC-41': true,
      'ETC-42': true,
      'ETC-43': true,
      'ETC-44': true,
      'ETC-45': false,
      'ETC-46': true,
      'ETC-47': false,
      'ETC-48': true,
      'ETC-49': true,
      'ETC-50': false,
    },
  },
  {
    recipe: 'R-2 / TLC-CH',
    toolQuals: {
      'ETC-41': true,
      'ETC-42': true,
      'ETC-43': true,
      'ETC-44': true,
      'ETC-45': true,
      'ETC-46': true,
      'ETC-47': true,
      'ETC-48': true,
      'ETC-49': true,
      'ETC-50': true,
    },
  },
  {
    recipe: 'R-3 / TLC-SL',
    toolQuals: {
      'ETC-41': true,
      'ETC-42': true,
      'ETC-43': true,
      'ETC-44': false,
      'ETC-45': true,
      'ETC-46': true,
      'ETC-47': true,
      'ETC-48': true,
      'ETC-49': true,
      'ETC-50': false,
    },
  },
  {
    recipe: 'R-4 / QLC-SL',
    toolQuals: {
      'ETC-41': false,
      'ETC-42': false,
      'ETC-43': true,
      'ETC-44': false,
      'ETC-45': false,
      'ETC-46': true,
      'ETC-47': true,
      'ETC-48': true,
      'ETC-49': false,
      'ETC-50': false,
    },
  },
]

export class ShopFloorStore {
  groups: ToolGroup[] = TOOL_GROUPS
  selectedGroupId: string = 'harc-etch'
  tools: ToolRow[] = TOOLS
  qualMatrix: QualMatrixRow[] = QUAL_MATRIX

  constructor() {
    makeAutoObservable(this)
  }

  get selectedGroup(): ToolGroup | undefined {
    return this.groups.find((g) => g.id === this.selectedGroupId)
  }

  selectGroup(id: string) {
    this.selectedGroupId = id
  }
}
