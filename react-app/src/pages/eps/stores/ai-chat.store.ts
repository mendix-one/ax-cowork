import { makeAutoObservable } from 'mobx'

export type ChatScenario = {
  id: string
  letter: 'A' | 'B' | 'C'
  title: string
  detail: string
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  scenarios?: ChatScenario[]
  explainability?: string[]
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'Can we pull HBM4-Dev tape-out into Q4 2026 without overloading DRAM Design?',
  },
  {
    id: 'm2',
    role: 'assistant',
    content: "I evaluated 3 reallocation candidates against your headcount portfolio. None breach Jisoo Park's 95% utilization ceiling:",
    scenarios: [
      { id: 's-a', letter: 'A', title: 'Move 5 engineers from NAND-V9 → HBM4-Dev', detail: 'HBM4 timeline -3 months. NAND-V9 util 85% → 92% (within band).' },
      {
        id: 's-b',
        letter: 'B',
        title: 'Borrow 3 verification engineers from Pyeongtaek',
        detail: 'HBM4 timeline -6 weeks. Cross-site approval needed (Minho Kim).',
      },
      { id: 's-c', letter: 'C', title: 'Defer DDR5-Gen5 by 1 quarter', detail: 'Frees 7 design heads. DDR5 commit slips Q2 → Q3 2027.' },
    ],
    explainability: [
      'DRAM Design G1/G2 capacity available in Q4',
      'no conflict with PROMIS-synced approved roadmap V6',
      'option A also resolves NAND-V9 over-staffing flagged last week',
    ],
  },
]

const QUICK_PROMPTS = ['What if HBM4 +5 engineers', 'Diff V6 vs V5', 'Show DRAM Design utilization', 'Cross-site over-allocations', 'Promote S1-V2 to draft']

export class AIChatStore {
  messages: ChatMessage[] = [...INITIAL_MESSAGES]
  input = ''
  thinking = false
  quickPrompts = QUICK_PROMPTS

  constructor() {
    makeAutoObservable(this)
  }

  setInput(v: string) {
    this.input = v
  }

  send() {
    const text = this.input.trim()
    if (!text || this.thinking) return
    this.messages = [...this.messages, { id: crypto.randomUUID(), role: 'user', content: text }]
    this.input = ''
    this.thinking = true
    setTimeout(() => {
      this.messages = [
        ...this.messages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `(mock) Considering "${text}". I found 2 candidates ranked by headcount delta and PROMIS-sync impact. Hook the Samsung AI Services BE to replace this stub.`,
        },
      ]
      this.thinking = false
    }, 600)
  }
}
