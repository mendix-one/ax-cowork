import type { ReactElement } from 'react'

// Studio Pro design-mode preview. A lightweight static skeleton of the login card (logo, two inputs,
// primary button, sign-up hint, SSO card) so the widget reads correctly on the canvas. Design-time is
// inert — no store, no handlers.
export function AxLoginPreview(): ReactElement {
  const card: React.CSSProperties = {
    width: 320,
    border: '1px solid #f0f0f0',
    borderRadius: 8,
    background: '#fff',
    padding: 16,
    boxSizing: 'border-box',
  }
  const input: React.CSSProperties = { height: 32, borderRadius: 6, border: '1px solid #d9d9d9', background: '#fafafa' }
  const label: React.CSSProperties = { width: 80, height: 12, borderRadius: 3, background: '#eee', marginBottom: 6 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 12 }}>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#3F51B5' }} />
        </div>
        <div style={label} />
        <div style={{ ...input, marginBottom: 14 }} />
        <div style={label} />
        <div style={{ ...input, marginBottom: 16 }} />
        <div style={{ height: 36, borderRadius: 6, background: '#3F51B5' }} />
        <div style={{ width: 180, height: 12, borderRadius: 3, background: '#eee', margin: '14px auto 0' }} />
      </div>
      <div style={card}>
        <div style={{ height: 36, borderRadius: 6, border: '1px solid #d9d9d9', background: '#fafafa' }} />
      </div>
    </div>
  )
}
