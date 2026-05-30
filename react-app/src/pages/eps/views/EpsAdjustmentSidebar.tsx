import { Button, Space, Tree } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../stores/eps.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Shared adjustment sidebar — a PO > PF > MB tree backed by the simulation store's adjustment state.
// The sidebar's visibility is owned by each view (simulation / analysis), but the *adjustment state*
// (what's checked, apply / reset) is shared via the simulation store so changes propagate everywhere.
// Disabled checkboxes encode the business rule: anything that is already running (scheduleClass === 'fixed')
// cannot be unchecked — the user only cancels future work by unchecking new or changed batches.
export type EpsAdjustmentSidebarProps = {
  onClose: () => void
}

export const EpsAdjustmentSidebar = observer((props: EpsAdjustmentSidebarProps) => {
  const simulation = useEpsContext().simulation
  return (
    <div className="ax-eps-simulation_side">
      <div className="ax-eps-simulation_side_header">
        <span>Adjustment</span>
        <Button size="small" type="text" className="ax-antd-button-icon-small" icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />} onClick={props.onClose} />
      </div>
      <div className="ax-eps-simulation_side_body">
        <div className="ax-eps-simulation_filter_group">
          <Tree
            checkable
            selectable={false}
            defaultExpandAll
            blockNode
            treeData={simulation.adjustmentTreeData}
            checkedKeys={simulation.pendingCheckedKeys}
            onCheck={(checked) => {
              // With checkStrictly=false (default) AntD returns a plain key array, but the typings widen it.
              const keys = Array.isArray(checked) ? checked : checked.checked
              simulation.setPendingCheckedKeys(keys.map(String))
            }}
          />
        </div>
      </div>
      <div className="ax-eps-simulation_side_footer">
        <Space size="small">
          <Button size="small" onClick={() => simulation.resetAdjustment()}>
            Reset
          </Button>
          <Button size="small" type="primary" disabled={!simulation.hasPendingAdjustmentChanges} onClick={() => simulation.applyAdjustment()}>
            Apply
          </Button>
        </Space>
      </div>
    </div>
  )
})
