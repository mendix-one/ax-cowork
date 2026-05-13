import { type ReactNode } from 'react'

export type AxScrollBoxProps = {
  vertical?: boolean
  horizontal?: boolean
  right?: number
  children?: ReactNode
}

export const AxScrollBox = (props: AxScrollBoxProps) => {
  const right = props.right ?? 0
  const className = `ax-scroll-box w-full h-full ${props.vertical === false ? 'overflow-y-hidden' : 'overflow-x-auto'} ${props.horizontal === false ? 'overflow-y-hidden' : 'overflow-x-auto'}`
  return (
    <div className={className}>
      <div className={`ax-scroll-inner pe-${right}`}>{props.children}</div>
    </div>
  )
}
