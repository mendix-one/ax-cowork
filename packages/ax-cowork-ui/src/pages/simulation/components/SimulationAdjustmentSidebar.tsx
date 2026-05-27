import { Button, Space, Tree } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../store/simulation.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Shared adjustment sidebar — a PO > PF > MB tree backed by the gantt store's adjustment state.
// The sidebar's visibility is owned by each view (gantt / analysis), but the *adjustment state*
// (what's checked, apply / reset) is shared via the gantt store so changes propagate everywhere.
// Disabled checkboxes encode the business rule: anything that is already running (scheduleClass === 'fixed')
// cannot be unchecked — the user only cancels future work by unchecking new or changed batches.
export type SimulationAdjustmentSidebarProps = {
  onClose: () => void
}

export const SimulationAdjustmentSidebar = observer((props: SimulationAdjustmentSidebarProps) => {
  const gantt = useSimulationContext().gantt
  return (
    <div className="ax-gantt_side">
      <div className="ax-gantt_side_header">
        <span>Adjustment</span>
        <Button
          size="small"
          type="text"
          className="ax-antd-button-icon-small"
          icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />}
          onClick={props.onClose}
        />
      </div>
      <div className="ax-gantt_side_body">
        <div className="ax-gantt_filter_group">
          <Tree
            checkable
            selectable={false}
            defaultExpandAll
            blockNode
            treeData={gantt.adjustmentTreeData}
            checkedKeys={gantt.pendingCheckedKeys}
            onCheck={(checked) => {
              // With checkStrictly=false (default) AntD returns a plain key array, but the typings widen it.
              const keys = Array.isArray(checked) ? checked : checked.checked
              gantt.setPendingCheckedKeys(keys.map(String))
            }}
          />
        </div>
      </div>
      <div className="ax-gantt_side_footer">
        <Space size="small">
          <Button size="small" onClick={() => gantt.resetAdjustment()}>
            Reset
          </Button>
          <Button size="small" type="primary" disabled={!gantt.hasPendingAdjustmentChanges} onClick={() => gantt.applyAdjustment()}>
            Apply
          </Button>
        </Space>
      </div>
    </div>
  )
})
