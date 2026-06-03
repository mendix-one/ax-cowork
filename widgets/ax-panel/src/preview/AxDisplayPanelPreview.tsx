import type { ReactElement } from 'react'
import type { AxDisplayPanelPreviewProps } from '../../typings/AxDisplayPanelProps'

// Studio Pro design-mode preview. Renders the panel chrome (header with title + control glyph, body)
// with the toolbar / content drop zones live so the structure reads correctly on the canvas.
const GLYPH = {
  maximize: 'M4,4H20V20H4V4M6,8V18H18V8H6Z',
  close: 'M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z',
}

export function AxDisplayPanelPreview(props: AxDisplayPanelPreviewProps): ReactElement {
  const Toolbar = props.toolbar.renderer
  const Content = props.content.renderer
  const glyph = props.type === 'sub' ? GLYPH.close : GLYPH.maximize

  return (
    <div style={{ width: '100%', border: '1px solid #d9d9d9', borderRadius: 6, background: '#fff', overflow: 'hidden' }}>
      <div
        style={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 8px',
          background: '#e7e5e4',
          borderBottom: '1px solid #d6d3d1',
        }}
      >
        <span style={{ fontWeight: 600, color: '#292524', whiteSpace: 'nowrap' }}>{props.title || 'Panel'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Toolbar>{null}</Toolbar>
        </div>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="#57534e">
          <path d={glyph} />
        </svg>
      </div>
      <div style={{ padding: 8 }}>
        <Content>{null}</Content>
      </div>
    </div>
  )
}
