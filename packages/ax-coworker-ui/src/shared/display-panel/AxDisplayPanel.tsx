import { type ReactNode } from 'react'
import { Dropdown, type DropdownProps, type MenuProps } from 'antd'
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

export const AxDisplayPanel = (props: AxDisplayPanelProps) => {
  const menuItems: MenuProps['items'] =
    props.type === 'main'
      ? [
          props.maximized
            ? { key: 'restore', label: 'Restore', icon: <AxMuiIcon icon="mdiWindowRestore" size={12} /> }
            : { key: 'maximize', label: 'Maximize', icon: <AxMuiIcon icon="mdiWindowMaximize" size={12} /> },
        ]
      : [{ key: 'close', label: 'Close', icon: <AxMuiIcon icon="mdiWindowClose" size={12} /> }]

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (props.type === 'main') {
      switch (key) {
        case 'maximize':
          props.onMaximize?.()
          break
        case 'restore':
          props.onRestore?.()
          break
      }
    } else {
      switch (key) {
        case 'close':
          props.onClose?.()
          break
      }
    }
  }

  return (
    <div className="ax-display-panel">
      <div className="ax-display-panel_header">
        <div className="ax-display-panel_header_title">
          <AxMuiIcon icon={props.icon} size="20px" className="ax-display-panel_header_title_icon" />
          <p className="ax-display-panel_header_title_text">{props.title}</p>
        </div>
        <div className="ax-display-panel_header_option">
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} styles={objectStyles} trigger={['click']} placement="bottomRight">
            <button className="ax-display-panel_header_option_button">
              <AxMuiIcon icon="mdiDotsVertical" size="20px" className="ax-display-panel_header_title_icon" />
            </button>
          </Dropdown>
        </div>
      </div>
      <div className="ax-display-panel_body">{props.children}</div>
    </div>
  )
}
