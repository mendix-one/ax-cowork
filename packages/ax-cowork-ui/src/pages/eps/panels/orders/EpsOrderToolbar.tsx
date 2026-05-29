import { Button, Divider, Flex, Segmented, Space, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { EpsScheduleActions } from '../../views/EpsScheduleActions'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import type { StatusFilter } from '../../stores/order.store'

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Changes', value: 'changes' },
  { label: 'Fixed', value: 'fixed' },
]

export const EpsOrderToolbar = observer(() => {
  const po = useEpsContext().order
  return (
    <Flex align="center" justify="space-between" gap="small" className="ax-eps-order_toolbar" style={{ width: '100%' }}>
      <Space size={10}>
        <Segmented size="small" value={po.statusFilter} onChange={(v) => po.setStatusFilter(v as StatusFilter)} options={STATUS_OPTIONS} />
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
          <Tooltip title={po.filterSidebarOpen ? 'Hide adjustment sidebar' : 'Show adjustment sidebar'}>
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
        <Divider vertical style={{ margin: 0 }} />
        <span className="ax-eps-simulation_legend" aria-label="Schedule lineage legend">
          <span className="ax-eps-simulation_legend_item">
            <span className="ax-eps-simulation_legend_swatch ax-eps-simulation_legend_swatch__fixed" />
            Fixed
          </span>
          <span className="ax-eps-simulation_legend_item">
            <span className="ax-eps-simulation_legend_swatch ax-eps-simulation_legend_swatch__changes" />
            Changes
          </span>
          <span className="ax-eps-simulation_legend_item">
            <span className="ax-eps-simulation_legend_swatch ax-eps-simulation_legend_swatch__new" />
            New
          </span>
        </span>
      </Space>
      <EpsScheduleActions target="orders" />
    </Flex>
  )
})
