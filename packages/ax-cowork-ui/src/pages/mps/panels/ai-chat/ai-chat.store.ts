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
    content: 'What if ETC-44 down 6h and we insert hot lot HL-22?',
  },
  {
    id: 'm2',
    role: 'assistant',
    content: 'I found 3 options:',
    scenarios: [
      { id: 's-a', letter: 'A', title: 'Reroute to ETC-07', detail: '12 lots slip 2h. Cust B M1: on time.' },
      { id: 's-b', letter: 'B', title: 'Split to ETC-09', detail: 'Yield risk +0.4% on QLC.' },
      { id: 's-c', letter: 'C', title: 'Hold + pull-fwd 8 wafer-starts', detail: 'M1 slips 18h.' },
    ],
    explainability: ['ETC-07 qualified', 'capacity available', 'no yield impact'],
  },
]

const QUICK_PROMPTS = ['Insert hot lot', 'Tool down', 'Pull commit', 'Yield drop']

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
          content: `(mock) Considering your scenario: "${text}". I found 2 candidates ranked by commit impact.`,
        },
      ]
      this.thinking = false
    }, 600)
  }
}
