import { Button, Dropdown, Space, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../store/mps.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Right-side action group rendered in the Gantt, Analysis, and Production Order panel headers.
// `target` picks which store the edit state and save flow comes from — Gantt/Analysis both target
// 'simulation' because analysis adjustments propagate through the gantt store; PO targets its own store.
// Save-as-new-scenario stays plan-level (sim.openMpsPlanModal) regardless of target.
//
// The "N unsaved" chip is intentionally NOT rendered here — the global counter lives in the app
// top bar (MpsLayoutTop) so the planner sees the aggregate dirty state regardless of which
// panel is active. editsCount is still consumed by the Save menu to gate "Submit to baseline".
export type ScheduleActionTarget = 'simulation' | 'orders'

export const MpsScheduleActions = observer(({ target }: { target: ScheduleActionTarget }) => {
  const sim = useMpsContext()
  const store = target === 'simulation' ? sim.gantt : sim.productionOrder
  const editsCount = store.unsavedEditsCount

  // Save menu — drafts vs. scenarios. The default Save still routes through the pre-flight validation;
  // "Save as new scenario" will spawn a fresh plan (wired to the plan modal until the BE is connected).
  const saveMenu: MenuProps = {
    items: [
      { key: 'draft', label: 'Save draft', icon: <AxMuiIcon icon="mdiContentSaveOutline" size={14} /> },
      { key: 'scenario', label: 'Save as new scenario…', icon: <AxMuiIcon icon="mdiContentSaveMoveOutline" size={14} /> },
      { type: 'divider' },
      { key: 'submit', label: 'Submit to baseline', icon: <AxMuiIcon icon="mdiUpload" size={14} />, disabled: editsCount === 0 },
    ],
    onClick: ({ key }) => {
      if (key === 'draft') sim.openPreflight(target)
      else if (key === 'scenario') sim.openMpsPlanModal()
      else if (key === 'submit') sim.openPreflight(target)
    },
  }

  return (
    <Space size={6}>
      <Tooltip title="Undo">
        <Button size="small" disabled={!store.canUndo} icon={<AxMuiIcon icon="mdiUndo" size={14} />} onClick={() => store.undo()} />
      </Tooltip>
      <Tooltip title="Redo">
        <Button size="small" disabled={!store.canRedo} icon={<AxMuiIcon icon="mdiRedo" size={14} />} onClick={() => store.redo()} />
      </Tooltip>
      <Tooltip title="Discard local changes">
        <Button size="small" icon={<AxMuiIcon icon="mdiRestore" size={14} />} onClick={() => store.reset()} />
      </Tooltip>
      <Space.Compact>
        <Tooltip title="Save · runs a pre-flight validation first">
          <Button
            size="small"
            type="primary"
            onClick={() => sim.openPreflight(target)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <AxMuiIcon icon="mdiContentSaveOutline" size={14} />
            <span>Save</span>
          </Button>
        </Tooltip>
        <Dropdown menu={saveMenu} placement="bottomRight" trigger={['click']}>
          <Button size="small" type="primary" aria-label="More save options" icon={<AxMuiIcon icon="mdiChevronDown" size={14} />} />
        </Dropdown>
      </Space.Compact>
    </Space>
  )
})
