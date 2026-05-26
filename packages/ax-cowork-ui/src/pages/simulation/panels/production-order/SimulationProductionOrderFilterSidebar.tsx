import { Button, Checkbox, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export const SimulationProductionOrderFilterSidebar = observer(() => {
  const po = useSimulationContext().productionOrder
  return (
    <div className="ax-po_side">
      <div className="ax-po_side_header">
        <span>Filters</span>
        <Button
          size="small"
          type="text"
          className="ax-antd-button-icon-small"
          icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />}
          onClick={() => po.toggleFilterSidebar()}
        />
      </div>
      <div className="ax-po_side_body">
        <div className="ax-po_filter_group">
          <span className="ax-po_filter_group_title">Customers</span>
          <Checkbox.Group value={po.pendingCustomerFilters} onChange={(vals) => po.setPendingCustomerFilters(vals as string[])}>
            <Space direction="vertical" size={4}>
              {po.allCustomers.map((c) => (
                <Checkbox key={c} value={c}>
                  {c}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>
        <div className="ax-po_filter_group">
          <span className="ax-po_filter_group_title">Production Orders</span>
          <Checkbox.Group value={po.pendingOrderFilters} onChange={(vals) => po.setPendingOrderFilters(vals as string[])}>
            <Space direction="vertical" size={4}>
              {po.allOrders.map((o) => (
                <Checkbox key={o} value={o}>
                  {o}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>
        <div className="ax-po_filter_group">
          <span className="ax-po_filter_group_title">Product Families</span>
          <Checkbox.Group value={po.pendingFamilyFilters} onChange={(vals) => po.setPendingFamilyFilters(vals as string[])}>
            <Space direction="vertical" size={4}>
              {po.allFamilies.map((f) => (
                <Checkbox key={f} value={f}>
                  {f}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>
      </div>
      <div className="ax-po_side_footer">
        <Space size="small">
          <Button size="small" onClick={() => po.resetFilters()}>
            Reset
          </Button>
          <Button size="small" type="primary" disabled={!po.hasPendingFilterChanges} onClick={() => po.applyFilters()}>
            Apply
          </Button>
        </Space>
      </div>
    </div>
  )
})
