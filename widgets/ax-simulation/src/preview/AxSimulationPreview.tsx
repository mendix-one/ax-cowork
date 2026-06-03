import type { ReactElement } from 'react'

// Studio Pro design-mode preview. A lightweight static skeleton of the shell (top bar, two icon rails,
// main + right region) so the widget reads as a full-page layout on the canvas. Drop-zone contents are
// not rendered here — design-time is inert.
export function AxSimulationPreview(): ReactElement {
  const railIcon = { width: 18, height: 18, borderRadius: 4, background: '#e0e0e0' }
  const rail = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 6, background: '#fafafa', borderRight: '1px solid #f0f0f0' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={railIcon} />
      ))}
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 220, border: '1px solid #f0f0f0', background: '#fff', overflow: 'hidden' }}>
      <div style={{ flex: '0 0 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ width: 120, height: 14, background: '#eee', borderRadius: 4 }} />
        <div style={{ width: 90, height: 14, background: '#eee', borderRadius: 4 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {rail}
        <div style={{ flex: 1, background: '#f5f5f5' }} />
        <div style={{ flex: '0 0 110px', background: '#fff', borderLeft: '1px solid #f0f0f0' }} />
        {rail}
      </div>
      <div style={{ flex: '0 0 22px', borderTop: '1px solid #f0f0f0', background: '#fff' }} />
    </div>
  )
}
