import { type ReactNode } from 'react'
import { AxMuiIcon, type MdiIconName } from '../mui-icon/AxMuiIcon.tsx'

export type MainPanelControls = {
  maximized?: boolean
  onMaximize?: () => void
  onRestore?: () => void
}

export type SubPanelControls = {
  onClose?: () => void
}

type BaseProps = {
  icon: MdiIconName
  title: string
  children?: ReactNode
}

export type AxDisplayPanelProps = (BaseProps & { type: 'main' } & MainPanelControls) | (BaseProps & { type: 'sub' } & SubPanelControls)

export const AxDisplayPanel = (props: AxDisplayPanelProps) => {
  const action =
    props.type === 'main'
      ? props.maximized
        ? { icon: 'mdiWindowRestore' as MdiIconName, title: 'Restore', onClick: () => props.onRestore?.() }
        : { icon: 'mdiWindowMaximize' as MdiIconName, title: 'Maximize', onClick: () => props.onMaximize?.() }
      : { icon: 'mdiWindowClose' as MdiIconName, title: 'Close', onClick: () => props.onClose?.() }

  return (
    <div className="ax-display-panel">
      <div className="ax-display-panel_header">
        <div className="ax-display-panel_header_title">
          <AxMuiIcon icon={props.icon} size="20px" className="ax-display-panel_header_title_icon" />
          <p className="ax-display-panel_header_title_text">{props.title}</p>
        </div>
        <div className="ax-display-panel_header_option">
          <button className="ax-display-panel_header_option_button" type="button" title={action.title} onClick={action.onClick}>
            <AxMuiIcon icon={action.icon} size="16px" className="ax-display-panel_header_title_icon" />
          </button>
        </div>
      </div>
      <div className="ax-display-panel_body">{props.children}</div>
    </div>
  )
}
