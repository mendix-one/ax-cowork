import { Flex } from 'antd'
import { AxMuiIcon, type MdiIconName } from '../mui-icon/AxMuiIcon.tsx'

export type AxIconBoxProps = {
  icon: MdiIconName
  color?: string
  size?: string | number
  className?: string
}

export const AxIconBox = (props: AxIconBoxProps) => {
  const size = props.size ? (typeof props.size === 'number' ? `${props.size}px` : props.size) : '1.715rem'
  const className = props.className || 'ax-icon-box_icon'
  return (
    <Flex align="center" justify="center" style={{ width: size, height: size }} className="ax-icon-box">
      <AxMuiIcon icon={props.icon} size={size} color={props.color} className={className} />
    </Flex>
  )
}
