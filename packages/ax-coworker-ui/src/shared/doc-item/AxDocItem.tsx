import { observer } from 'mobx-react-lite'
import { Tooltip } from 'antd'
import { AxMuiIcon } from '../mui-icon/AxMuiIcon.tsx'
import { cloneElement, isValidElement, type ReactElement } from 'react'

export type AxMenuIconProps = {
  icon: string | ReactElement
  name: string
  title?: string
  onClick?: () => void
}

export const AxDocItem = observer((props: AxMenuIconProps) => {
  const myIcon = isValidElement(props.icon) ? (
    cloneElement(props.icon, { size: '20px', className: 'ax-doc-item_left_icon' } as never)
  ) : (
    <AxMuiIcon icon={props.icon} size="20px" className="ax-doc-item_left_icon" />
  )
  return (
    <div className="ax-doc-item">
      <Tooltip title={props.title}>
        <button className="ax-doc-item_left" onClick={props.onClick}>
          {myIcon}
          <p className="ax-doc-item_left_name">{props.name}</p>
        </button>
      </Tooltip>
      <button className="ax-doc-item_right" onClick={props.onClick}>
        <AxMuiIcon icon="mdiWindowClose" size="16px" className="ax-doc-item_right_icon" />
      </button>
    </div>
  )
})
