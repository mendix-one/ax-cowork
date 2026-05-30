import { Button, DatePicker, Divider, Flex, Segmented, Space, Tooltip } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import { MpsScheduleActions } from '../../views/MpsScheduleActions'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export const MpsSimulationToolbar = observer(() => {
  const sim = useMpsContext()
  const simulation = sim.simulation

  return (
    <Flex align="center" justify="space-between" gap="small" className="ax-mps-simulation_toolbar" style={{ width: '100%' }}>
      <Space size={10}>
        <DatePicker.RangePicker
          size="small"
          allowClear={false}
          value={[dayjs(simulation.startDate), dayjs(simulation.endDate)]}
          onChange={(values: [Dayjs | null, Dayjs | null] | null) => {
            if (!values || !values[0] || !values[1]) return
            simulation.setStartDate(values[0].format('YYYY-MM-DD'))
            simulation.setEndDate(values[1].format('YYYY-MM-DD'))
          }}
        />

        <Divider vertical style={{ margin: 0 }} />
        <Segmented
          size="small"
          value={simulation.horizon}
          onChange={(v) => simulation.setHorizon(v as 'day' | 'week' | 'month')}
          options={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
          ]}
        />
        <Divider vertical style={{ margin: 0 }} />
        <Space size={2}>
          <Tooltip title="Collapse all rows">
            <Button size="small" icon={<AxMuiIcon icon="mdiUnfoldLessHorizontal" size={14} />} onClick={() => simulation.collapseAll()} />
          </Tooltip>
          <Tooltip title="Expand all rows">
            <Button size="small" icon={<AxMuiIcon icon="mdiUnfoldMoreHorizontal" size={14} />} onClick={() => simulation.expandAll()} />
          </Tooltip>
        </Space>
        <Divider vertical style={{ margin: 0 }} />
        <Space size={2}>
          <Tooltip title={simulation.filterSidebarOpen ? 'Hide filter sidebar' : 'Show filter sidebar'}>
            <Button
              size="small"
              type={simulation.filterSidebarOpen ? 'primary' : 'default'}
              icon={<AxMuiIcon icon="mdiFilterMenuOutline" size={14} />}
              onClick={() => simulation.toggleFilterSidebar()}
            />
          </Tooltip>
          <Tooltip title={simulation.quickAnalysisOpen ? 'Hide capacity overlay' : 'Show capacity overlay'}>
            <Button
              size="small"
              type={simulation.quickAnalysisOpen ? 'primary' : 'default'}
              icon={<AxMuiIcon icon="mdiChartTimelineVariant" size={14} />}
              onClick={() => simulation.toggleQuickAnalysis()}
            />
          </Tooltip>
        </Space>
        <Divider vertical style={{ margin: 0 }} />
        {/* Schedule-lineage legend — three swatches matching the bar fills below so the planner can decode bar
            colors without leaving the panel. Keep inline; if we add more categories, promote to a popover. */}
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
        </span>
      </Space>
      <MpsScheduleActions target="simulation" />
    </Flex>
  )
})
