import { type ReactNode } from 'react'
import { Dropdown, type DropdownProps, type MenuProps } from 'antd'
import { AxMuiIcon, type MdiIconName } from '../mui-icon/AxMuiIcon.tsx'

export type PanelControls = {
  maximized?: boolean
  onMaximize?: () => void
  onRestore?: () => void
  onHide?: () => void
}

export type AxSimplePanelProps = PanelControls & {
  icon: MdiIconName
  title: string
  children?: ReactNode
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
  const { maximized = false } = props

  const menuItems: MenuProps['items'] = [
    maximized
      ? { key: 'restore', label: 'Restore', icon: <AxMuiIcon icon="mdiWindowRestore" size={12} /> }
      : { key: 'maximize', label: 'Maximize', icon: <AxMuiIcon icon="mdiWindowMaximize" size={12} /> },
    { key: 'hide', label: 'Hide', icon: <AxMuiIcon icon="mdiEyeOffOutline" size={12} /> },
  ]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'maximize':
        props.onMaximize?.()
        break
      case 'restore':
        props.onRestore?.()
        break
      case 'hide':
        props.onHide?.()
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
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} styles={objectStyles} trigger={['click']} placement="bottomRight">
            <button className="ax-simple-panel_header_option_button">
              <AxMuiIcon icon="mdiDotsVertical" size="20px" className="ax-simple-panel_header_title_icon" />
            </button>
          </Dropdown>
        </div>
      </div>
      <div className="ax-simple-panel_body">{props.children}</div>
    </div>
  )
}
