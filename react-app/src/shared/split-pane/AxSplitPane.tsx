import { type CSSProperties, type ReactNode, useCallback, useRef, useState } from 'react'

// Smooth horizontal split with show/hide + drag-to-resize. Replaces AntD Splitter for the simulation shell
// where the main concern is *transition smoothness* of open/close/maximize, not power-user resizing UX.
//
// Behavior:
//   • CSS-grid-driven width — single `transition: grid-template-columns` carries the open/close animation.
//   • Drag-to-resize via a thin separator. While the user is dragging we disable the transition so the
//     pane follows the cursor 1:1; we re-enable when the drag ends.
//   • When the second pane is hidden, its column collapses to 0 with overflow hidden and the divider hides;
//     when restored, the column transitions back to the last user-set width (or `defaultRightPercent`).
//   • All sizes are percentages of the container so the layout reflows on window resize for free.

export type AxSplitPaneProps = {
  first: ReactNode
  second: ReactNode
  // When false, the second pane collapses to 0 width and the divider hides. The width memory persists so
  // toggling back restores the previous size.
  secondVisible: boolean
  // Initial width of the second pane (% of container). Used until the user drags.
  defaultRightPercent?: number
  // Allowed range for the second pane, as % of container.
  minRightPercent?: number
  maxRightPercent?: number
  // Forwarded onto the root for placement under flex parents.
  style?: CSSProperties
  className?: string
}

// Matches --ax-dur-deliberate / --ax-ease-standard from src/styles/_ax-shared.scss. Kept inline here because
// the value is also handed to the dragging-mid switch (we disable transition during drag), which is JS state.
const TRANSITION_MS = 280
const TRANSITION_EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)'

export const AxSplitPane = ({
  first,
  second,
  secondVisible,
  defaultRightPercent = 30,
  minRightPercent = 12,
  maxRightPercent = 80,
  style,
  className,
}: AxSplitPaneProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  // Remembered (open) width of the second pane in %. Survives toggle so the planner gets the same size back.
  // Clamp inline on read so an external bounds change is handled without a state-syncing effect.
  const [rawRightPct, setRightPct] = useState<number>(clamp(defaultRightPercent, minRightPercent, maxRightPercent))
  const rightPct = clamp(rawRightPct, minRightPercent, maxRightPercent)
  // Whether the user is currently dragging — switches off the CSS transition to keep dragging crisp.
  const [dragging, setDragging] = useState(false)

  // While dragging, listen on window so the cursor can leave the divider without breaking the drag.
  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!secondVisible) return
      e.preventDefault()
      setDragging(true)
      const container = rootRef.current
      if (!container) return
      const startX = e.clientX
      const startW = container.getBoundingClientRect().width
      const startPct = rightPct
      const onMove = (ev: MouseEvent) => {
        const dx = startX - ev.clientX // moving left → second pane grows
        const deltaPct = (dx / startW) * 100
        const next = clamp(startPct + deltaPct, minRightPercent, maxRightPercent)
        setRightPct(next)
      }
      const onUp = () => {
        setDragging(false)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    [secondVisible, rightPct, minRightPercent, maxRightPercent],
  )

  // Build the grid template — collapses the second column to 0 when hidden so it transitions naturally.
  const dividerW = 4
  const secondPct = secondVisible ? rightPct : 0
  const gridTemplate = `minmax(0, 1fr) ${dividerW}px ${secondPct}%`

  return (
    <div
      ref={rootRef}
      className={`ax-split ${className ?? ''} ${secondVisible ? 'is-open' : 'is-collapsed'} ${dragging ? 'is-dragging' : ''}`}
      style={{
        ...style,
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        gridTemplateRows: '100%',
        height: '100%',
        width: '100%',
        transition: dragging ? 'none' : `grid-template-columns ${TRANSITION_MS}ms ${TRANSITION_EASE}`,
      }}
    >
      <div className="ax-split_first">{first}</div>
      <div
        className="ax-split_divider"
        role="separator"
        aria-orientation="vertical"
        aria-hidden={!secondVisible}
        onMouseDown={onMouseDown}
        style={{ cursor: secondVisible ? 'col-resize' : 'default', pointerEvents: secondVisible ? 'auto' : 'none' }}
      />
      <div className="ax-split_second" aria-hidden={!secondVisible}>
        {second}
      </div>
    </div>
  )
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
