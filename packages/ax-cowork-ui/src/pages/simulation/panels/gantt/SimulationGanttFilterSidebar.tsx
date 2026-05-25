import { Button, Checkbox, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export const SimulationGanttFilterSidebar = observer(() => {
  const gantt = useSimulationContext().gantt
  return (
    <div className="ax-gantt_side">
      <div className="ax-gantt_side_header">
        <span>Filters</span>
        <Button
          size="small"
          type="text"
          className="ax-antd-button-icon-small"
          icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />}
          onClick={() => gantt.toggleFilterSidebar()}
        />
      </div>
      <div className="ax-gantt_side_body">
        <div className="ax-gantt_filter_group">
          <span className="ax-gantt_filter_group_title">Customers</span>
          <Checkbox.Group value={gantt.pendingCustomerFilters} onChange={(vals) => gantt.setCustomerFilters(vals as string[])}>
            <Space direction="vertical" size={4}>
              {gantt.allCustomers.map((c) => (
                <Checkbox key={c} value={c}>
                  {c}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>
        <div className="ax-gantt_filter_group">
          <span className="ax-gantt_filter_group_title">Production Orders</span>
          <Checkbox.Group value={gantt.pendingOrderFilters} onChange={(vals) => gantt.setOrderFilters(vals as string[])}>
            <Space direction="vertical" size={4}>
              {gantt.allOrders.map((o) => (
                <Checkbox key={o} value={o}>
                  {o}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>
        <div className="ax-gantt_filter_group">
          <span className="ax-gantt_filter_group_title">Product Families</span>
          <Checkbox.Group value={gantt.pendingFamilyFilters} onChange={(vals) => gantt.setFamilyFilters(vals as string[])}>
            <Space direction="vertical" size={4}>
              {gantt.allFamilies.map((f) => (
                <Checkbox key={f} value={f}>
                  {f}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>
      </div>
      <div className="ax-gantt_side_footer">
        <Space size="small">
          <Button size="small" onClick={() => gantt.resetFilters()}>
            Reset
          </Button>
          <Button size="small" type="primary" disabled={!gantt.hasPendingFilterChanges} onClick={() => gantt.applyFilters()}>
            Apply
          </Button>
        </Space>
      </div>
    </div>
  )
})
