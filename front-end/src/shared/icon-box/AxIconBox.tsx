import { observer } from 'mobx-react-lite'
import { cloneElement, isValidElement, type ReactElement } from 'react'
import { Flex } from 'antd'
import { AxMuiIcon } from '../mui-icon/AxMuiIcon.tsx'

export type AxMenuIconProps = {
  icon: string | ReactElement
  color?: string
  size?: string | number
  className?: string
}

export const AxIconBox = observer((props: AxMenuIconProps) => {
  const size = props.size ? (typeof props.size === 'number' ? `${props.size}px` : props.size) : '24px'
  const className = props.className || 'ax-icon-box_icon'
  const myIcon = isValidElement(props.icon) ? (
    cloneElement(props.icon, { size, className, color: props.color } as never)
  ) : (
    <AxMuiIcon icon={props.icon} size={size} color={props.color} className={className} />
  )
  return (
    <Flex align="center" justify="center" style={{ width: size, height: size }} className="ax-icon-box">
      {myIcon}
    </Flex>
  )
})
