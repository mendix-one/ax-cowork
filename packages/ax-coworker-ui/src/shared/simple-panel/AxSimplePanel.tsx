import { observer } from 'mobx-react-lite'
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { AxMuiIcon } from '../mui-icon/AxMuiIcon.tsx'

export type AxSimplePanelProps = {
  icon: string | ReactElement
  title: string
  children?: ReactNode
}

export const AxSimplePanel = observer((props: AxSimplePanelProps) => {
  const myIcon = isValidElement(props.icon) ? (
    cloneElement(props.icon, { size: '20px', className: 'ax-simple-panel_header_title_icon' } as never)
  ) : (
    <AxMuiIcon icon={props.icon} size="20px" className="ax-simple-panel_header_title_icon" />
  )

  return (
    <div className="ax-simple-panel">
      <div className="ax-simple-panel_header">
        <div className="ax-simple-panel_header_title">
          {myIcon}
          <p className="ax-simple-panel_header_title_text">{props.title}</p>
        </div>
        <div className="ax-simple-panel_header_option">
          <button className="ax-simple-panel_header_option_button">
            <AxMuiIcon icon="mdiDotsVertical" size="20px" className="ax-simple-panel_header_title_icon" />
          </button>
        </div>
      </div>
      <div className="ax-simple-panel_body">{props.children}</div>
    </div>
  )
})
