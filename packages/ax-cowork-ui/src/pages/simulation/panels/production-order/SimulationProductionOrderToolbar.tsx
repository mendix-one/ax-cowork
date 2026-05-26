import { Button, DatePicker, Divider, Flex, Select, Space, Tooltip } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import type { StatusFilter } from './production-order.store'

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Running (Has changes)', value: 'running-changes' },
  { label: 'Running (No changes)', value: 'running-fixed' },
]

export const SimulationProductionOrderToolbar = observer(() => {
  const po = useSimulationContext().productionOrder
  return (
    <Flex align="center" justify="space-between" gap="small" className="ax-po_toolbar" style={{ width: '100%' }}>
      <Space size={10}>
        <DatePicker.RangePicker
          size="small"
          allowClear={false}
          value={[dayjs(po.startDate), dayjs(po.endDate)]}
          onChange={(values: [Dayjs | null, Dayjs | null] | null) => {
            if (!values || !values[0] || !values[1]) return
            po.setStartDate(values[0].format('YYYY-MM-DD'))
            po.setEndDate(values[1].format('YYYY-MM-DD'))
          }}
        />
        <Divider vertical style={{ margin: 0 }} />
        <Select<StatusFilter> size="small" style={{ minWidth: 180 }} value={po.statusFilter} onChange={(v) => po.setStatusFilter(v)} options={STATUS_OPTIONS} />
        <Divider vertical style={{ margin: 0 }} />
        <Space size={2}>
          <Tooltip title="Collapse all">
            <Button size="small" icon={<AxMuiIcon icon="mdiUnfoldLessHorizontal" size={14} />} onClick={() => po.collapseAll()} />
          </Tooltip>
          <Tooltip title="Expand all">
            <Button size="small" icon={<AxMuiIcon icon="mdiUnfoldMoreHorizontal" size={14} />} onClick={() => po.expandAll()} />
          </Tooltip>
        </Space>
        <Divider vertical style={{ margin: 0 }} />
        <Space size={2}>
          <Tooltip title={po.filterSidebarOpen ? 'Hide filter sidebar' : 'Show filter sidebar'}>
            <Button
              size="small"
              type={po.filterSidebarOpen ? 'primary' : 'default'}
              icon={<AxMuiIcon icon="mdiFilterMenuOutline" size={14} />}
              onClick={() => po.toggleFilterSidebar()}
            />
          </Tooltip>
          <Tooltip title={po.infoPanelOpen ? 'Hide info panel' : 'Show info panel'}>
            <Button
              size="small"
              type={po.infoPanelOpen ? 'primary' : 'default'}
              icon={<AxMuiIcon icon="mdiInformationOutline" size={14} />}
              onClick={() => po.toggleInfoPanel()}
            />
          </Tooltip>
        </Space>
      </Space>
      <Space size={4}>
        <Tooltip title="Undo">
          <Button size="small" disabled={!po.canUndo} icon={<AxMuiIcon icon="mdiUndo" size={14} />} onClick={() => po.undo()} />
        </Tooltip>
        <Tooltip title="Redo">
          <Button size="small" disabled={!po.canRedo} icon={<AxMuiIcon icon="mdiRedo" size={14} />} onClick={() => po.redo()} />
        </Tooltip>
        <Tooltip title="Reset">
          <Button size="small" icon={<AxMuiIcon icon="mdiRestore" size={14} />} onClick={() => po.reset()} />
        </Tooltip>
        <Tooltip title="Save">
          <Button size="small" type="primary" icon={<AxMuiIcon icon="mdiContentSaveOutline" size={14} />} onClick={() => po.save()}>
            Save
          </Button>
        </Tooltip>
      </Space>
    </Flex>
  )
})
