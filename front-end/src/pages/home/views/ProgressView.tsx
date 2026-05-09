import { observer } from 'mobx-react-lite'
import { Progress, Tag } from 'antd'
import { AxMuiIcon } from '../../../shared/mui-icon/AxMuiIcon.tsx'

type Status = 'done' | 'in-progress' | 'blocked' | 'todo'
type Milestone = {
  id: number
  title: string
  owner: string
  status: Status
  percent: number
  due: string
}

const milestones: Milestone[] = [
  { id: 1, title: 'Define technology stack', owner: 'Logan Ng', status: 'done', percent: 100, due: 'May 5' },
  { id: 2, title: 'Set up CI/CD pipeline', owner: 'Sarah Kim', status: 'in-progress', percent: 65, due: 'May 12' },
  { id: 3, title: 'Database schema design', owner: 'Marcus Liu', status: 'in-progress', percent: 40, due: 'May 18' },
  { id: 4, title: 'API contract review', owner: 'Priya Patel', status: 'blocked', percent: 20, due: 'May 20' },
  { id: 5, title: 'Frontend scaffolding', owner: 'Sarah Kim', status: 'todo', percent: 0, due: 'May 25' },
  { id: 6, title: 'Auth integration', owner: 'Logan Ng', status: 'todo', percent: 0, due: 'Jun 1' },
]

const statusTag: Record<Status, { color: string; label: string }> = {
  done: { color: 'success', label: 'Done' },
  'in-progress': { color: 'processing', label: 'In Progress' },
  blocked: { color: 'error', label: 'Blocked' },
  todo: { color: 'default', label: 'To Do' },
}

export const ProgressView = observer(() => {
  return (
    <div className="w-full h-full overflow-auto p-2 space-y-2">
      {milestones.map((m) => (
        <div key={m.id} className="border border-gray-300 rounded-md p-2 bg-white">
          <div className="flex items-center justify-between mb-1 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <AxMuiIcon icon="mdiFlagCheckered" size={16} className="text-neutral-700" />
              <span className="font-semibold text-neutral-800 truncate">{m.title}</span>
            </div>
            <Tag color={statusTag[m.status].color} className="flex-shrink-0">
              {statusTag[m.status].label}
            </Tag>
          </div>
          <Progress percent={m.percent} size="small" showInfo={false} />
          <div className="flex items-center justify-between text-xs text-neutral-500 mt-1">
            <span>Owner: {m.owner}</span>
            <span>Due: {m.due}</span>
          </div>
        </div>
      ))}
    </div>
  )
})
