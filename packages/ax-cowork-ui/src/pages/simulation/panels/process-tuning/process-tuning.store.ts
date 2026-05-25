import { makeAutoObservable } from 'mobx'

export type TuneSuggestion = {
  id: string
  toolGroup: string
  recipe: string
  delta: number
  direction: 'faster' | 'slower'
  confidence: number
  specMinutes: number
  actualMinutes: number
  sampleCount: number
  impact: string[]
  raisedAt: string
}

const PENDING: TuneSuggestion[] = [
  {
    id: 'SG-014',
    toolGroup: 'HARC Etch',
    recipe: 'R-QLC-CH',
    delta: -8.2,
    direction: 'faster',
    confidence: 96,
    specMinutes: 34,
    actualMinutes: 31.2,
    sampleCount: 412,
    impact: ['412 lots affected, avg cycle time −1.3 hr per pass', 'Frees ~520 wafer-passes/wk on HARC capacity', 'Improves Cust B M1 commit by ~12 hr (P50)'],
    raisedAt: '2026-05-23 09:14',
  },
  {
    id: 'SG-015',
    toolGroup: 'ONON CVD',
    recipe: 'R-N1',
    delta: 5.1,
    direction: 'slower',
    confidence: 81,
    specMinutes: 22,
    actualMinutes: 23.1,
    sampleCount: 280,
    impact: ['Pull back 3 lots/wk capacity'],
    raisedAt: '2026-05-22 18:02',
  },
  {
    id: 'SG-016',
    toolGroup: 'CMP',
    recipe: 'R-CMP-3',
    delta: -3.4,
    direction: 'faster',
    confidence: 74,
    specMinutes: 18,
    actualMinutes: 17.4,
    sampleCount: 190,
    impact: ['Minor capacity gain'],
    raisedAt: '2026-05-22 11:30',
  },
  {
    id: 'SG-017',
    toolGroup: 'Probe',
    recipe: 'T-1',
    delta: 2.8,
    direction: 'slower',
    confidence: 68,
    specMinutes: 12,
    actualMinutes: 12.3,
    sampleCount: 320,
    impact: ['No commit impact'],
    raisedAt: '2026-05-21 16:45',
  },
  {
    id: 'SG-018',
    toolGroup: 'Litho',
    recipe: 'L-2',
    delta: -4.6,
    direction: 'faster',
    confidence: 89,
    specMinutes: 28,
    actualMinutes: 26.7,
    sampleCount: 410,
    impact: ['+3 lots/wk on Litho'],
    raisedAt: '2026-05-21 09:10',
  },
  {
    id: 'SG-019',
    toolGroup: 'Anneal',
    recipe: 'A-2',
    delta: -6.1,
    direction: 'faster',
    confidence: 92,
    specMinutes: 40,
    actualMinutes: 37.6,
    sampleCount: 220,
    impact: ['+6 lots/wk on Anneal'],
    raisedAt: '2026-05-20 22:18',
  },
  {
    id: 'SG-020',
    toolGroup: 'Clean',
    recipe: 'Wet-3',
    delta: 3.9,
    direction: 'slower',
    confidence: 71,
    specMinutes: 9,
    actualMinutes: 9.4,
    sampleCount: 150,
    impact: ['Adjust dispatch'],
    raisedAt: '2026-05-20 12:50',
  },
]

export class ProcessTuningStore {
  pending: TuneSuggestion[] = PENDING
  selectedId: string = PENDING[0].id
  tab: 'pending' | 'accepted' | 'sent' = 'pending'

  constructor() {
    makeAutoObservable(this)
  }

  get selected(): TuneSuggestion | undefined {
    return this.pending.find((s) => s.id === this.selectedId)
  }

  select(id: string) {
    this.selectedId = id
  }

  setTab(tab: 'pending' | 'accepted' | 'sent') {
    this.tab = tab
  }
}
