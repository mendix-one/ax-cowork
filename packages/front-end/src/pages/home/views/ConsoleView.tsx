import { observer } from 'mobx-react-lite'

type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR'
type LogLine = { time: string; level: LogLevel; text: string }

const lines: LogLine[] = [
  { time: '14:32:01', level: 'INFO', text: 'Server started on port 3000' },
  { time: '14:32:02', level: 'INFO', text: 'Connected to PostgreSQL database (pool size: 20)' },
  { time: '14:32:03', level: 'DEBUG', text: 'Loaded 142 routes' },
  { time: '14:32:05', level: 'INFO', text: 'GET  /api/projects        200  12ms' },
  { time: '14:32:06', level: 'INFO', text: 'GET  /api/projects/42     200   8ms' },
  { time: '14:32:08', level: 'WARN', text: 'Slow query detected: SELECT * FROM tasks WHERE owner_id = $1 (340ms)' },
  { time: '14:32:11', level: 'INFO', text: 'POST /api/tasks           201  45ms' },
  { time: '14:32:14', level: 'ERROR', text: 'Failed to send notification: SMTP timeout after 5000ms' },
  { time: '14:32:15', level: 'INFO', text: 'Retrying notification job (attempt 2/3)' },
  { time: '14:32:17', level: 'INFO', text: 'Notification sent successfully' },
  { time: '14:32:20', level: 'DEBUG', text: 'Cache hit ratio: 0.87' },
  { time: '14:32:23', level: 'INFO', text: 'GET  /api/tasks?status=open  200  18ms' },
]

const colorByLevel: Record<LogLevel, string> = {
  INFO: 'text-black',
  DEBUG: 'text-neutral-500',
  WARN: 'text-orange-600',
  ERROR: 'text-red-600',
}

export const ConsoleView = observer(() => {
  return (
    <div className="w-full h-full overflow-auto p-2 font-mono text-xs leading-5 bg-white text-black">
      {lines.map((l, i) => (
        <div key={i} className="flex gap-3 whitespace-nowrap">
          <span className="text-neutral-500">{l.time}</span>
          <span className={`w-12 ${colorByLevel[l.level]} font-semibold`}>{l.level}</span>
          <span className={colorByLevel[l.level]}>{l.text}</span>
        </div>
      ))}
    </div>
  )
})
