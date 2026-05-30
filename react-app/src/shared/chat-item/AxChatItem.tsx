import { Tooltip } from 'antd'
import type { TooltipPlacement } from 'antd/es/tooltip'
import { AxMuiIcon } from '../mui-icon/AxMuiIcon.tsx'

export type AxMenuIconProps = {
  name: string
  count?: number
  title?: string
  placement?: TooltipPlacement
  onClick?: () => void
}

export const AxChatItem = (props: AxMenuIconProps) => {
  return (
    <div className="ax-chat-item">
      <Tooltip title={props.title} placement={props.placement}>
        <button className="ax-chat-item_left" onClick={props.onClick}>
          <AxMuiIcon icon="mdiAccountCircleOutline" size="1.15rem" className="ax-chat-item_left_icon" />
          <p className="ax-chat-item_left_name">{props.name}</p>
          <p className="ax-chat-item_left_count">({props.count})</p>
        </button>
      </Tooltip>
      <button className="ax-chat-item_right" onClick={props.onClick}>
        <AxMuiIcon icon="mdiWindowClose" size="1rem" className="ax-chat-item_right_icon" />
      </button>
    </div>
  )
}
