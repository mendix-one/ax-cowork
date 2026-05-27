import { Button, DatePicker, Divider, Flex, Space, Tooltip } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Mirrors the gantt toolbar: a date-range picker on the left and the adjustment toggle on the right of the
// left group. Save/undo/redo are intentionally omitted — analysis is read-only.
export const SimulationAnalysisToolbar = observer(() => {
  const analysis = useSimulationContext().analysis
  return (
    <Flex align="center" justify="space-between" gap="small" className="ax-gantt_toolbar" style={{ width: '100%' }}>
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
      </Space>
    </Flex>
  )
})
