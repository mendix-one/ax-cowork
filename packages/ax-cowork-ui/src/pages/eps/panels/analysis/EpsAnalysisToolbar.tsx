import { Button, DatePicker, Divider, Flex, Space, Tooltip } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { EpsScheduleActions } from '../../views/EpsScheduleActions'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Mirrors the simulation toolbar: date-range picker, adjustment toggle, schedule-lineage legend on the left;
// unsaved chip + undo/redo/reset + save split-button on the right. Edit/save state lives on the simulation
// store — the right-side actions are sourced from EpsScheduleActions so both panel toolbars stay
// in sync automatically when the save flow evolves.
export const EpsAnalysisToolbar = observer(() => {
  const analysis = useEpsContext().analysis
  return (
    <Flex align="center" justify="space-between" gap="small" className="ax-eps-simulation_toolbar" style={{ width: '100%' }}>
      <Space size={10}>
        <DatePicker.RangePicker
          size="small"
          allowClear={false}
          value={[dayjs(analysis.startDate), dayjs(analysis.endDate)]}
          onChange={(values: [Dayjs | null, Dayjs | null] | null) => {
            if (!values || !values[0] || !values[1]) return
            analysis.setDateRange(values[0].format('YYYY-MM-DD'), values[1].format('YYYY-MM-DD'))
          }}
        />
        <Divider vertical style={{ margin: 0 }} />
        <Tooltip title={analysis.filterSidebarOpen ? 'Hide adjustment sidebar' : 'Show adjustment sidebar'}>
          <Button
            size="small"
            type={analysis.filterSidebarOpen ? 'primary' : 'default'}
            icon={<AxMuiIcon icon="mdiFilterMenuOutline" size={14} />}
            onClick={() => analysis.toggleFilterSidebar()}
          />
        </Tooltip>
        <Divider vertical style={{ margin: 0 }} />
        {/* Schedule-lineage legend — same swatches as the simulation toolbar so the planner can decode chart
            colors without switching panels. */}
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
      <EpsScheduleActions target="simulation" />
    </Flex>
  )
})
