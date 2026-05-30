import { Tooltip } from 'antd'
import { AxMuiIcon, type MdiIconName } from '../mui-icon/AxMuiIcon.tsx'

export type AxDocItemProps = {
  icon: MdiIconName
  name: string
  title?: string
  onClick?: () => void
}

export const AxDocItem = (props: AxDocItemProps) => {
  return (
    <div className="ax-doc-item">
      <Tooltip title={props.title}>
        <button className="ax-doc-item_left" onClick={props.onClick}>
          <AxMuiIcon icon={props.icon} size="1.15rem" className="ax-doc-item_left_icon" />
          <p className="ax-doc-item_left_name">{props.name}</p>
        </button>
      </Tooltip>
      <button className="ax-doc-item_right" onClick={props.onClick}>
        <AxMuiIcon icon="mdiWindowClose" size="1rem" className="ax-doc-item_right_icon" />
      </button>
    </div>
  )
}
