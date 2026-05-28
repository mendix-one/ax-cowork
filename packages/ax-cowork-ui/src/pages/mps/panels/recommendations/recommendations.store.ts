import { makeAutoObservable } from 'mobx'

export type Recommendation = {
  id: string
  priority: 'HIGH' | 'MED' | 'LOW'
  stars: 1 | 2 | 3 | 4
  title: string
  description: string
  impact: string
  action: 'preview' | 'open' | 'skip'
}

const RECS: Recommendation[] = [
  {
    id: 'r1',
    priority: 'HIGH',
    stars: 4,
    title: 'Hot-lot HL-22',
    description: 'Cust A requested. Insert before 06-01.',
    impact: '+1 lot ripple · 4 commits ok',
    action: 'preview',
  },
  {
    id: 'r2',
    priority: 'HIGH',
    stars: 4,
    title: 'Probe over-cap',
    description: 'Days 01-03 Probe E-Test 89% (warn). Suggestion: shift Cust C 5 lots −1d.',
    impact: '−1 commit at risk',
    action: 'preview',
  },
  {
    id: 'r3',
    priority: 'MED',
    stars: 3,
    title: 'Tune SG-014 HARC R-QLC-CH',
    description: '−8.2% time · +12h on Cust B M1 commit',
    impact: '+520 wafer-passes/wk',
    action: 'open',
  },
  {
    id: 'r4',
    priority: 'LOW',
    stars: 2,
    title: 'Qual expiry — ETC-44 ch C',
    description: 'R-QLC-CH expires 06-12. Schedule re-qual?',
    impact: 'Risk of unqualified route',
    action: 'open',
  },
  {
    id: 'r5',
    priority: 'LOW',
    stars: 1,
    title: 'Idle capacity — WL Tungsten',
    description: 'Days 1-5. Pull-fwd candidates?',
    impact: '+ headroom',
    action: 'preview',
  },
]

export class RecommendationsStore {
  recommendations: Recommendation[] = RECS
  skippedCount = 12

  constructor() {
    makeAutoObservable(this)
  }
}
