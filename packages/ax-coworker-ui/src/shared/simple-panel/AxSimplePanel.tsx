import { type ReactNode } from 'react'
import { Dropdown, type DropdownProps, type MenuProps } from 'antd'
import { AxMuiIcon, type MdiIconName } from '../mui-icon/AxMuiIcon.tsx'

export type AxSimplePanelProps = {
  icon: MdiIconName
  title: string
  children?: ReactNode
  minimized?: boolean
  maximized?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onRestore?: () => void
  onMoveLeft?: () => void
  onMoveRight?: () => void
  onClose?: () => void
}

const objectStyles: DropdownProps['styles'] = {
  root: {
    backgroundColor: '#fff',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
  },
  item: {
    padding: '2px 8px 2px 2px',
    fontSize: '1rem',
  },
  itemTitle: {
    fontWeight: '500',
  },
  itemIcon: {
    color: '#1890ff',
    marginInlineEnd: '2px',
  },
  itemContent: {
    backgroundColor: 'transparent',
  },
}

export const AxSimplePanel = (props: AxSimplePanelProps) => {
  const { minimized = false, maximized = false } = props
  const isAltered = minimized || maximized

  const sizeMenuItems: MenuProps['items'] = isAltered
    ? [{ key: 'restore', label: 'Restore', icon: <AxMuiIcon icon="mdiWindowRestore" size={12} /> }]
    : [
        { key: 'minimize', label: 'Minimize', icon: <AxMuiIcon icon="mdiWindowMinimize" size={12} /> },
        { key: 'maximize', label: 'Maximize', icon: <AxMuiIcon icon="mdiWindowMaximize" size={12} /> },
      ]

  const menuItems: MenuProps['items'] = [
    ...sizeMenuItems,
    { key: 'move-left', label: 'Move left', icon: <AxMuiIcon icon="mdiArrowLeft" size={12} /> },
    { key: 'move-right', label: 'Move right', icon: <AxMuiIcon icon="mdiArrowRight" size={12} /> },
    { key: 'close', label: 'Close', icon: <AxMuiIcon icon="mdiWindowClose" size={12} /> },
  ]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'minimize':
        props.onMinimize?.()
        break
      case 'maximize':
        props.onMaximize?.()
        break
      case 'restore':
        props.onRestore?.()
        break
      case 'move-left':
        props.onMoveLeft?.()
        break
      case 'move-right':
        props.onMoveRight?.()
        break
      case 'close':
        props.onClose?.()
        break
    }
  }

  return (
    <div className="ax-simple-panel">
      <div className="ax-simple-panel_header">
        <div className="ax-simple-panel_header_title">
          <AxMuiIcon icon={props.icon} size="20px" className="ax-simple-panel_header_title_icon" />
          <p className="ax-simple-panel_header_title_text">{props.title}</p>
        </div>
        <div className="ax-simple-panel_header_option">
          <button className="ax-simple-panel_header_option_button">
            <AxMuiIcon icon="mdiArrowDownDropCircleOutline" size="16px" className="ax-simple-panel_header_title_icon" />
          </button>
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} styles={objectStyles} trigger={['click']} placement="bottomRight">
            <button className="ax-simple-panel_header_option_button">
              <AxMuiIcon icon="mdiDotsVertical" size="20px" className="ax-simple-panel_header_title_icon" />
            </button>
          </Dropdown>
        </div>
      </div>
      {!minimized && <div className="ax-simple-panel_body">{props.children}</div>}
    </div>
  )
}
