import { Button, DatePicker, Divider, Flex, Segmented, Space, Tooltip } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export const SimulationGanttToolbar = observer(() => {
  const sim = useSimulationContext()
  const gantt = sim.gantt
  return (
    <Flex align="center" justify="space-between" gap="small" className="ax-gantt_toolbar" style={{ width: '100%' }}>
      <Space size={10}>
        <DatePicker.RangePicker
          size="small"
          allowClear={false}
          value={[dayjs(gantt.startDate), dayjs(gantt.endDate)]}
          onChange={(values: [Dayjs | null, Dayjs | null] | null) => {
            if (!values || !values[0] || !values[1]) return
            gantt.setStartDate(values[0].format('YYYY-MM-DD'))
            gantt.setEndDate(values[1].format('YYYY-MM-DD'))
          }}
        />

        <Divider vertical style={{ margin: 0 }} />
        <Segmented
          size="small"
          value={gantt.horizon}
          onChange={(v) => gantt.setHorizon(v as 'day' | 'week' | 'month')}
          options={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
          ]}
        />
        <Divider vertical style={{ margin: 0 }} />
        <Space size={2}>
          <Tooltip title="Collapse all">
            <Button size="small" icon={<AxMuiIcon icon="mdiUnfoldLessHorizontal" size={14} />} onClick={() => gantt.collapseAll()} />
          </Tooltip>
          <Tooltip title="Expand all">
            <Button size="small" icon={<AxMuiIcon icon="mdiUnfoldMoreHorizontal" size={14} />} onClick={() => gantt.expandAll()} />
          </Tooltip>
        </Space>
        <Divider vertical style={{ margin: 0 }} />
        <Space size={2}>
          <Tooltip title={gantt.filterSidebarOpen ? 'Hide filter sidebar' : 'Show filter sidebar'}>
            <Button
              size="small"
              type={gantt.filterSidebarOpen ? 'primary' : 'default'}
              icon={<AxMuiIcon icon="mdiFilterMenuOutline" size={14} />}
              onClick={() => gantt.toggleFilterSidebar()}
            />
          </Tooltip>
          <Tooltip title={gantt.quickAnalysisOpen ? 'Hide quick analysis' : 'Show quick analysis'}>
            <Button
              size="small"
              type={gantt.quickAnalysisOpen ? 'primary' : 'default'}
              icon={<AxMuiIcon icon="mdiChartTimelineVariant" size={14} />}
              onClick={() => gantt.toggleQuickAnalysis()}
            />
          </Tooltip>
        </Space>
      </Space>
      <Space size={4}>
        <Tooltip title="Undo">
          <Button size="small" disabled={!gantt.canUndo} icon={<AxMuiIcon icon="mdiUndo" size={14} />} onClick={() => gantt.undo()} />
        </Tooltip>
        <Tooltip title="Redo">
          <Button size="small" disabled={!gantt.canRedo} icon={<AxMuiIcon icon="mdiRedo" size={14} />} onClick={() => gantt.redo()} />
        </Tooltip>
        <Tooltip title="Reset">
          <Button size="small" icon={<AxMuiIcon icon="mdiRestore" size={14} />} onClick={() => gantt.reset()} />
        </Tooltip>
        <Tooltip title="Save · runs a pre-flight validation first">
          <Button size="small" type="primary" icon={<AxMuiIcon icon="mdiContentSaveOutline" size={14} />} onClick={() => sim.openPreflight('gantt')}>
            Save
          </Button>
        </Tooltip>
      </Space>
    </Flex>
  )
})
