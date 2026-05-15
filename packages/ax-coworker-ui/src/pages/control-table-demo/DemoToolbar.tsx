import { Button, Divider, Dropdown, Flex, Space, Typography } from 'antd'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

interface DemoToolbarProps {
  totalCount: number
  selectedCount: number
  filterOpen: boolean
  onToggleFilter: () => void
  onToggleConfig: () => void
  onSelectAll: () => void
  onUnselectAll: () => void
  onAction: (label: string) => void
}

export function DemoToolbar({ totalCount, selectedCount, filterOpen, onToggleFilter, onToggleConfig, onSelectAll, onUnselectAll, onAction }: DemoToolbarProps) {
  // Action 1 always shows selected-row count (the user clicks it to act on those).
  // Action 2/3 keep the fallback-to-total behavior so they're useful with no selection.
  const fallbackCount = selectedCount > 0 ? selectedCount : totalCount

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={8}
      style={{
        height: 40,
        padding: '0 12px',
        borderBottom: '1px solid #f0f0f0',
        background: '#fff',
      }}
    >
      <Flex align="center" gap={4}>
        <AxMuiIcon icon="mdiTable" size={18} color="#262626" />
        <Typography.Text strong style={{ marginRight: 8 }}>
          Control Table
        </Typography.Text>
        <Button type={filterOpen ? 'primary' : 'text'} size="small" icon={<AxMuiIcon icon="mdiFilterOutline" size={16} />} onClick={onToggleFilter}>
          Filter
        </Button>
        <Button type="text" size="small" icon={<AxMuiIcon icon="mdiCogOutline" size={16} />} onClick={onToggleConfig}>
          Config
        </Button>
        <Divider type="vertical" style={{ margin: '0 4px' }} />
        <Button type="text" size="small" icon={<AxMuiIcon icon="mdiCheckboxMarkedOutline" size={16} />} onClick={onSelectAll}>
          Select All
        </Button>
        <Button type="text" size="small" icon={<AxMuiIcon icon="mdiCheckboxBlankOutline" size={16} />} onClick={onUnselectAll}>
          Unselect All
        </Button>
        <Divider type="vertical" style={{ margin: '0 4px' }} />
        <Space size={4}>
          <Button size="small" icon={<AxMuiIcon icon="mdiCheckCircleOutline" size={14} />} onClick={() => onAction('Action 1')} disabled={selectedCount === 0}>
            Action 1 ({selectedCount})
          </Button>
          <Button size="small" icon={<AxMuiIcon icon="mdiPlayCircleOutline" size={14} />} onClick={() => onAction('Action 2')} disabled={selectedCount === 0}>
            Action 2 ({selectedCount})
          </Button>
          <Button size="small" icon={<AxMuiIcon icon="mdiExportVariant" size={14} />} onClick={() => onAction('Action 3')}>
            Action 3 ({fallbackCount})
          </Button>
        </Space>
      </Flex>
      <Flex align="center" gap={4}>
        <Button type="text" size="small" icon={<AxMuiIcon icon="mdiCloseCircleOutline" size={16} color="#8c8c8c" />} />
        <Dropdown
          menu={{
            items: [
              { key: 'export', label: 'Export', icon: <AxMuiIcon icon="mdiDownload" size={14} /> },
              { key: 'reload', label: 'Reload', icon: <AxMuiIcon icon="mdiRefresh" size={14} /> },
              { type: 'divider' },
              { key: 'reset', label: 'Reset view', icon: <AxMuiIcon icon="mdiBackupRestore" size={14} /> },
            ],
          }}
        >
          <Button type="text" size="small" icon={<AxMuiIcon icon="mdiDotsVertical" size={16} color="#8c8c8c" />} />
        </Dropdown>
      </Flex>
    </Flex>
  )
}
