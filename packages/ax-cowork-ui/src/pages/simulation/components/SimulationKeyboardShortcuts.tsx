import { Modal, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../store/simulation.context'
import type { MainPanelId, SubPanelId } from '../store/simulation.store'

// Senior planners live in this UI for hours — keyboard navigation has to be first-class. This component owns:
//   • a global keydown listener that translates physical keys into store actions
//   • a "?" cheatsheet modal documenting every binding
//
// Binding scheme:
//   • Cmd/Ctrl-prefixed actions for global ones a planner expects from any IDE-class tool
//       ⌘S         · Save (pre-flight runs)
//       ⌘Z / ⌘⇧Z   · Undo / Redo
//       ⌘/         · Open the cheatsheet
//   • "g" leader — IDE jump pattern. Press `g` then one of g/a/o/p/s/t/c/i/r within 1.5s to switch panel.
//   • `?`        · Open the cheatsheet (matches GitHub / Linear convention)
//   • Esc        · Close the cheatsheet
//
// Bindings are skipped when the user is typing in an input/textarea/contenteditable so the planner can edit
// notes without losing their work.

type Binding = { keys: string; label: string; section: 'Global' | 'Navigate' | 'Edit' }

const BINDINGS: Binding[] = [
  { keys: '?', label: 'Toggle keyboard cheatsheet', section: 'Global' },
  { keys: '⌘S', label: 'Save (runs pre-flight)', section: 'Global' },
  { keys: '⌘Z', label: 'Undo last Gantt edit', section: 'Edit' },
  { keys: '⌘⇧Z', label: 'Redo last Gantt edit', section: 'Edit' },
  { keys: 'g g', label: 'Go to Gantt', section: 'Navigate' },
  { keys: 'g a', label: 'Go to Analysis', section: 'Navigate' },
  { keys: 'g o', label: 'Go to Production Order', section: 'Navigate' },
  { keys: 'g p', label: 'Go to Processes', section: 'Navigate' },
  { keys: 'g s', label: 'Go to Shop Floor', section: 'Navigate' },
  { keys: 'g t', label: 'Go to Process Tuning', section: 'Navigate' },
  { keys: 'g c', label: 'Go to Capacity Tuning', section: 'Navigate' },
  { keys: 'g i', label: 'Go to Data Integration', section: 'Navigate' },
  { keys: 'g r', label: 'Toggle Recommendations', section: 'Navigate' },
  { keys: 'g h', label: 'Toggle History', section: 'Navigate' },
]

const PANEL_KEYS: Record<string, MainPanelId> = {
  g: 'gantt',
  a: 'analysis',
  o: 'productionOrder',
  p: 'productionProcess',
  s: 'shopFloor',
  t: 'processTuning',
  c: 'capacityTuning',
  i: 'dataIntegration',
}

const SUB_PANEL_KEYS: Record<string, SubPanelId> = {
  r: 'recommendations',
  h: 'history',
}

const isEditable = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  return false
}

export const SimulationKeyboardShortcuts = observer(() => {
  const sim = useSimulationContext()
  const [cheatsheetOpen, setCheatsheetOpen] = useState(false)
  const [leader, setLeader] = useState<'g' | null>(null)

  useEffect(() => {
    if (!leader) return
    const t = window.setTimeout(() => setLeader(null), 1500)
    return () => window.clearTimeout(t)
  }, [leader])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return
      const mod = e.metaKey || e.ctrlKey

      // ⌘S — save the current edit-bearing panel via the existing pre-flight flow.
      if (mod && !e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        sim.openPreflight('gantt')
        return
      }
      // ⌘Z / ⌘⇧Z — Gantt undo/redo.
      if (mod && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault()
        if (e.shiftKey) sim.gantt.redo()
        else sim.gantt.undo()
        return
      }
      // ⌘/ or "?" — cheatsheet.
      if ((mod && e.key === '/') || (!mod && e.key === '?')) {
        e.preventDefault()
        setCheatsheetOpen((v) => !v)
        return
      }
      if (e.key === 'Escape' && cheatsheetOpen) {
        setCheatsheetOpen(false)
        return
      }
      // g-leader navigation.
      if (!mod && !leader && e.key === 'g') {
        e.preventDefault()
        setLeader('g')
        return
      }
      if (leader === 'g' && !mod) {
        const k = e.key.toLowerCase()
        const panel = PANEL_KEYS[k]
        if (panel) {
          e.preventDefault()
          sim.setActiveMainPanel(panel)
          setLeader(null)
          return
        }
        const sub = SUB_PANEL_KEYS[k]
        if (sub) {
          e.preventDefault()
          sim.toggleSubPanel(sub)
          setLeader(null)
          return
        }
        // Unknown key under leader — drop the leader so the planner can try again.
        setLeader(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [sim, leader, cheatsheetOpen])

  return (
    <Modal title="Keyboard shortcuts" open={cheatsheetOpen} onCancel={() => setCheatsheetOpen(false)} footer={null} width={520}>
      {(['Global', 'Navigate', 'Edit'] as const).map((section) => (
        <div key={section} style={{ marginBottom: 12 }}>
          <Typography.Text
            type="secondary"
            style={{ display: 'block', textTransform: 'uppercase', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}
          >
            {section}
          </Typography.Text>
          <table className="ax-cheatsheet">
            <tbody>
              {BINDINGS.filter((b) => b.section === section).map((b) => (
                <tr key={b.keys}>
                  <td style={{ width: 96, padding: '4px 0' }}>
                    {b.keys.split(' ').map((part, i) => (
                      <Tag key={`${b.keys}-${i}`} bordered style={{ marginInlineEnd: 4, fontFamily: 'monospace', fontWeight: 600 }}>
                        {part}
                      </Tag>
                    ))}
                  </td>
                  <td style={{ padding: '4px 0' }}>{b.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Tip: Press the leader{' '}
        <Tag bordered style={{ marginInlineEnd: 0, fontFamily: 'monospace' }}>
          g
        </Tag>{' '}
        then one of the letters above within 1.5s — same pattern as Linear / GitHub.
      </Typography.Text>
    </Modal>
  )
})
