import { Button, DatePicker, Divider, Flex, Segmented, Select, Space, Tooltip } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import { MpsScheduleActions } from '../../views/MpsScheduleActions'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import type { GroupBy, StatusFilter } from '../../stores/order.store'

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Running (Has changes)', value: 'running-changes' },
  { label: 'Running (No changes)', value: 'running-fixed' },
]

export const MpsOrderToolbar = observer(() => {
  const po = useMpsContext().order
  return (
    <Flex align="center" justify="space-between" gap="small" className="ax-mps-order_toolbar" style={{ width: '100%' }}>
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
        {/* Group-by pivot — flip the tree between PO-first and Customer-first reading order. */}
        <Segmented
          size="small"
          value={po.groupBy}
          onChange={(v) => po.setGroupBy(v as GroupBy)}
          options={[
            { label: 'By PO', value: 'po' },
            { label: 'By Customer', value: 'customer' },
          ]}
        />
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
        {/* Schedule-lineage legend — decoder for the State column chips. Includes Exclude (Blue Grey
            ghost) which the simulation/analysis legends don't carry, since this is the only view that
            renders rows for items the planner has unchecked in the Adjustment sidebar. */}
        <span className="ax-mps-simulation_legend" aria-label="Schedule lineage legend">
          <span className="ax-mps-simulation_legend_item">
            <span className="ax-mps-simulation_legend_swatch ax-mps-simulation_legend_swatch__fixed" />
            Fixed
          </span>
          <span className="ax-mps-simulation_legend_item">
            <span className="ax-mps-simulation_legend_swatch ax-mps-simulation_legend_swatch__changes" />
            Changes
          </span>
          <span className="ax-mps-simulation_legend_item">
            <span className="ax-mps-simulation_legend_swatch ax-mps-simulation_legend_swatch__new" />
            New
          </span>
          <span className="ax-mps-simulation_legend_item">
            <span className="ax-mps-simulation_legend_swatch ax-mps-simulation_legend_swatch__exclude" />
            Exclude
          </span>
        </span>
      </Space>
      <MpsScheduleActions target="orders" />
    </Flex>
  )
})
