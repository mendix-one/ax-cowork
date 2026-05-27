import { Button, DatePicker, Divider, Dropdown, Flex, Segmented, Space, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export const SimulationGanttToolbar = observer(() => {
  const sim = useSimulationContext()
  const gantt = sim.gantt
  const editsCount = gantt.unsavedEditsCount

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
      if (key === 'draft') sim.openPreflight('gantt')
      else if (key === 'scenario') sim.openSimulationPlanModal()
      else if (key === 'submit') sim.openPreflight('gantt')
    },
  }

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
          <Tooltip title="Collapse all rows">
            <Button size="small" icon={<AxMuiIcon icon="mdiUnfoldLessHorizontal" size={14} />} onClick={() => gantt.collapseAll()} />
          </Tooltip>
          <Tooltip title="Expand all rows">
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
          <Tooltip title={gantt.quickAnalysisOpen ? 'Hide capacity overlay' : 'Show capacity overlay'}>
            <Button
              size="small"
              type={gantt.quickAnalysisOpen ? 'primary' : 'default'}
              icon={<AxMuiIcon icon="mdiChartTimelineVariant" size={14} />}
              onClick={() => gantt.toggleQuickAnalysis()}
            />
          </Tooltip>
        </Space>
        <Divider vertical style={{ margin: 0 }} />
        {/* Schedule-lineage legend — three swatches matching the bar fills below so the planner can decode bar
            colors without leaving the panel. Keep inline; if we add more categories, promote to a popover. */}
        <span className="ax-gantt_legend" aria-label="Schedule lineage legend">
          <span className="ax-gantt_legend_item">
            <span className="ax-gantt_legend_swatch ax-gantt_legend_swatch__fixed" />
            Fixed
          </span>
          <span className="ax-gantt_legend_item">
            <span className="ax-gantt_legend_swatch ax-gantt_legend_swatch__changes" />
            Changes
          </span>
          <span className="ax-gantt_legend_item">
            <span className="ax-gantt_legend_swatch ax-gantt_legend_swatch__new" />
            New
          </span>
        </span>
      </Space>
      <Space size={6}>
        {editsCount > 0 && (
          <Tooltip title={`${editsCount} unsaved edit${editsCount === 1 ? '' : 's'} — click Save to commit`}>
            <span className="ax-gantt_edits">
              <AxMuiIcon icon="mdiCircleMedium" size={12} />
              {editsCount} unsaved
            </span>
          </Tooltip>
        )}
        <Tooltip title="Undo">
          <Button size="small" disabled={!gantt.canUndo} icon={<AxMuiIcon icon="mdiUndo" size={14} />} onClick={() => gantt.undo()} />
        </Tooltip>
        <Tooltip title="Redo">
          <Button size="small" disabled={!gantt.canRedo} icon={<AxMuiIcon icon="mdiRedo" size={14} />} onClick={() => gantt.redo()} />
        </Tooltip>
        <Tooltip title="Discard local changes">
          <Button size="small" icon={<AxMuiIcon icon="mdiRestore" size={14} />} onClick={() => gantt.reset()} />
        </Tooltip>
        <Space.Compact>
          <Tooltip title="Save · runs a pre-flight validation first">
            <Button
              size="small"
              type="primary"
              onClick={() => sim.openPreflight('gantt')}
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
    </Flex>
  )
})
