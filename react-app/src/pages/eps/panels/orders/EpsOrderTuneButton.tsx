import { Button, Checkbox, Popover, Segmented, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { ColumnSticky, ColumnTune } from '../../stores/order.store'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// The mdiTune icon button that sits in the table's first-column header. Clicking opens a popover
// where the planner reorders columns, toggles visibility / sticky pinning / sort / filter per column.
// Driven entirely by po.tableTune so the state survives panel switches.
//
// One row per column. Layout: drag-up/down arrows ▸ visibility checkbox ▸ label ▸ sticky segmented ▸
// sort toggle ▸ filter toggle. Always shows the _select column too — un-toggling it would hide the
// trigger itself, so its visibility checkbox is disabled (others can be turned off freely).
const ColumnTuneRow = observer(({ tune, index, total }: { tune: ColumnTune; index: number; total: number }) => {
  const po = useEpsContext().order
  const isSelectCol = tune.key === '_select'
  return (
    <div className="ax-eps-order_tune_row">
      <div className="ax-eps-order_tune_row_move">
        <Tooltip title="Move up">
          <Button size="small" type="text" disabled={index === 0} icon={<AxMuiIcon icon="mdiArrowUp" size={12} />} onClick={() => po.moveColumnUp(tune.key)} />
        </Tooltip>
        <Tooltip title="Move down">
          <Button
            size="small"
            type="text"
            disabled={index === total - 1}
            icon={<AxMuiIcon icon="mdiArrowDown" size={12} />}
            onClick={() => po.moveColumnDown(tune.key)}
          />
        </Tooltip>
      </div>
      <Checkbox checked={tune.visible} disabled={isSelectCol} onChange={(e) => po.setColumnVisible(tune.key, e.target.checked)} />
      <span className="ax-eps-order_tune_row_label" title={tune.label}>
        {tune.label}
      </span>
      <Segmented<ColumnSticky>
        size="small"
        value={tune.sticky}
        onChange={(v) => po.setColumnSticky(tune.key, v as ColumnSticky)}
        options={[
          { label: <AxMuiIcon icon="mdiPinOutline" size={12} />, value: 'left' as ColumnSticky, title: 'Pin left' },
          { label: <AxMuiIcon icon="mdiClose" size={12} />, value: null as unknown as ColumnSticky, title: 'No pin' },
          { label: <AxMuiIcon icon="mdiPin" size={12} />, value: 'right' as ColumnSticky, title: 'Pin right' },
        ]}
      />
      <Tooltip title={tune.sortable ? 'Sortable — click to disable' : 'Not sortable — click to enable'}>
        <Button
          size="small"
          type={tune.sortable ? 'primary' : 'default'}
          icon={<AxMuiIcon icon="mdiSortVariant" size={12} />}
          onClick={() => po.setColumnSortable(tune.key, !tune.sortable)}
        />
      </Tooltip>
      <Tooltip title={tune.filterable ? 'Filterable — click to disable' : 'Not filterable — click to enable'}>
        <Button
          size="small"
          type={tune.filterable ? 'primary' : 'default'}
          icon={<AxMuiIcon icon="mdiFilterOutline" size={12} />}
          onClick={() => po.setColumnFilterable(tune.key, !tune.filterable)}
        />
      </Tooltip>
    </div>
  )
})

const TuneContent = observer(() => {
  const po = useEpsContext().order
  const total = po.tableTune.length
  return (
    <div className="ax-eps-order_tune">
      <div className="ax-eps-order_tune_header">
        <span>Column tune</span>
        <Button size="small" type="text" onClick={() => po.resetTableTune()}>
          Reset
        </Button>
      </div>
      <div className="ax-eps-order_tune_body">
        {po.tableTune.map((tune, index) => (
          <ColumnTuneRow key={tune.key} tune={tune} index={index} total={total} />
        ))}
      </div>
    </div>
  )
})

export const EpsOrderTuneButton = () => (
  <Popover content={<TuneContent />} trigger="click" placement="bottomLeft" destroyOnHidden>
    <Button size="small" type="text" icon={<AxMuiIcon icon="mdiTune" size={16} />} title="Tune columns" style={{ cursor: 'pointer' }} />
  </Popover>
)
