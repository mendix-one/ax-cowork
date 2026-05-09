import { observer } from 'mobx-react-lite'
import { Avatar, Input } from 'antd'
import { AxMuiIcon } from '../../../shared/mui-icon/AxMuiIcon.tsx'

type Role = 'user' | 'ai'
type Message = { id: number; author: string; role: Role; time: string; text: string }

const messages: Message[] = [
  { id: 1, author: 'Logan Ng', role: 'user', time: '14:32', text: 'Generate a Gantt chart for the technology rollout plan, grouped by team.' },
  {
    id: 2,
    author: 'AMAI',
    role: 'ai',
    time: '14:32',
    text: 'Drafted a 12-week rollout grouped by Frontend, Backend, and Infra teams. Want me to add buffer time for QA cycles?',
  },
  { id: 3, author: 'Logan Ng', role: 'user', time: '14:34', text: 'Yes — 1 week QA buffer between phases.' },
  { id: 4, author: 'AMAI', role: 'ai', time: '14:34', text: 'Updated. The new total is 15 weeks. Critical path runs through the database migration.' },
  { id: 5, author: 'Sarah Kim', role: 'user', time: '14:38', text: 'Can we parallelize the search engine work with the cache rollout?' },
  {
    id: 6,
    author: 'AMAI',
    role: 'ai',
    time: '14:39',
    text: 'Yes — both have independent owners and no shared dependencies. Saves ~2 weeks on the critical path.',
  },
]

const bgByRole: Record<Role, string> = {
  ai: '#3f51b5',
  user: '#009688',
}

export const GenerativeAIView = observer(() => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-2 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-2">
            <Avatar size={24} style={{ backgroundColor: bgByRole[m.role], flexShrink: 0 }}>
              {m.author[0]}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-neutral-800">{m.author}</span>
                <span className="text-xs text-neutral-500">{m.time}</span>
              </div>
              <div className="text-neutral-700 break-words">{m.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-300 p-2">
        <Input size="small" placeholder="Ask AMAI…" suffix={<AxMuiIcon icon="mdiSend" size={16} className="text-neutral-500" />} />
      </div>
    </div>
  )
})
