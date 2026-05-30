import { useState, type ReactNode } from 'react'
import { Button, Descriptions, Input, Space, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { StateChip, SubTaskKindChip, MilestoneChips } from './order-chips'
import { EpsOrderSummary } from './EpsOrderSummary'
import { formatMtoAnchor, noteKeyForFamily, noteKeyForSubTask, noteKeyForTask } from '../../helpers/order.helpers'
import { bizTeamById, milestonesForFamily, orgPathForCell, processPathLabel, productionFamilyById } from '../../data/mock-plan'

const EntityNotesList = observer(({ entityKey, placeholder }: { entityKey: string; placeholder: string }) => {
  const po = useEpsContext().order
  const notes = po.getNotes(entityKey)
  const [draft, setDraft] = useState('')
  const submit = () => {
    if (!draft.trim()) return
    po.addNote(entityKey, draft)
    setDraft('')
  }
  return (
    <div className="ax-eps-order_pn">
      {notes.length === 0 ? (
        <Typography.Text type="secondary" className="text-sm">
          No notes yet — add one below.
        </Typography.Text>
      ) : (
        <div className="ax-eps-order_pn_list">
          {notes.map((n) => (
            <div key={n.id} className="ax-eps-order_pn_item">
              <div className="ax-eps-order_pn_item_meta">
                <AxMuiIcon icon="mdiNoteTextOutline" size={12} />
                <span>{new Date(n.createdAt).toLocaleString()}</span>
                <Tooltip title="Delete note">
                  <Button
                    size="small"
                    type="text"
                    danger
                    className="ax-eps-order_pn_item_del"
                    icon={<AxMuiIcon icon="mdiClose" size={12} />}
                    onClick={() => po.removeNote(entityKey, n.id)}
                  />
                </Tooltip>
              </div>
              <div className="ax-eps-order_pn_item_text">{n.text}</div>
            </div>
          ))}
        </div>
      )}
      <Space.Compact style={{ width: '100%', marginTop: 8 }}>
        <Input value={draft} placeholder={placeholder} onChange={(e) => setDraft(e.target.value)} onPressEnter={submit} />
        <Button type="primary" disabled={!draft.trim()} onClick={submit} icon={<AxMuiIcon icon="mdiPlus" size={14} />}>
          Add
        </Button>
      </Space.Compact>
    </div>
  )
})

export const EpsOrderInfoPanel = observer(() => {
  const sim = useEpsContext()
  const po = sim.order
  const row = po.selectedRow

  let titleLeft: ReactNode = 'Summary'
  let titleActions: ReactNode = null

  if (row && row.kind === 'pf' && row.pfId) {
    titleLeft = (
      <span className="ax-eps-order_info_header_title">
        <span className="ax-eps-order_info_header_title_code">{row.code ?? row.label}</span>
        <span className="ax-eps-order_info_header_title_sep">·</span>
        <span className="ax-eps-order_info_header_title_context">Production Family</span>
        <StateChip state={row.scheduleClass} />
      </span>
    )
  } else if (row && row.kind === 'task' && row.taskId) {
    titleLeft = (
      <span className="ax-eps-order_info_header_title">
        <span className="ax-eps-order_info_header_title_code">{row.code ?? row.label}</span>
        <span className="ax-eps-order_info_header_title_sep">·</span>
        <span className="ax-eps-order_info_header_title_context">Engineering Task</span>
        <StateChip state={row.scheduleClass} />
      </span>
    )
  } else if (row && row.kind === 'subTask' && row.taskId && row.subTaskId) {
    titleLeft = (
      <span className="ax-eps-order_info_header_title">
        <span className="ax-eps-order_info_header_title_code">{row.label}</span>
        <SubTaskKindChip kind={row.subTaskKind} />
        <StateChip state={row.scheduleClass} />
      </span>
    )
    if (row.scheduleClass !== 'fixed' && row.pfId) {
      titleActions = (
        <Button
          size="small"
          danger
          icon={<AxMuiIcon icon="mdiTrashCanOutline" size={14} />}
          onClick={() => po.removeSubTask(row.pfId!, row.taskId!, row.subTaskId!)}
        >
          Remove
        </Button>
      )
    }
  }

  const heightClass = row ? 'ax-eps-order_info__detail' : 'ax-eps-order_info__summary'

  return (
    <div className={`ax-eps-order_info ${heightClass}`}>
      <div className="ax-eps-order_info_header">
        <div className="ax-eps-order_info_header_left">{titleLeft}</div>
        <div className="ax-eps-order_info_header_right">
          {titleActions}
          <Button
            size="small"
            type="text"
            className="ax-antd-button-icon-small"
            icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />}
            onClick={() => po.closeInfoPanel()}
          />
        </div>
      </div>
      <div className="ax-eps-order_info_body">
        {!row ? (
          <EpsOrderSummary />
        ) : row.kind === 'pf' && row.pfId ? (
          (() => {
            const pf = productionFamilyById(row.pfId)
            if (!pf) return null
            const bizTeam = bizTeamById(pf.bizTeamId)
            const ms = milestonesForFamily(pf.id)
            const totalSpm = pf.tasks.reduce((s, t) => s + t.spm + t.subTasks.reduce((ss, x) => ss + x.spm, 0), 0)
            return (
              <div className="ax-eps-order_info_card">
                <div className="ax-eps-order_info_section">
                  <div className="ax-eps-order_info_section_title">Meta Info</div>
                  <Descriptions size="small" column={2} bordered labelStyle={{ width: 130, fontWeight: 500, color: '#262626' }}>
                    <Descriptions.Item label="Code">{pf.code}</Descriptions.Item>
                    <Descriptions.Item label="Name">{pf.name}</Descriptions.Item>
                    <Descriptions.Item label="Family Group">{pf.familyGroup}</Descriptions.Item>
                    <Descriptions.Item label="Biz Team">{bizTeam ? `${bizTeam.code} · ${bizTeam.name}` : '—'}</Descriptions.Item>
                    <Descriptions.Item label="MTO Anchor">{formatMtoAnchor(pf.mtoAnchor)}</Descriptions.Item>
                    <Descriptions.Item label="Tasks">{pf.tasks.length}</Descriptions.Item>
                    <Descriptions.Item label="Total SPM" span={2}>
                      <Typography.Text strong>{totalSpm} P/M</Typography.Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Milestones" span={2}>
                      <MilestoneChips milestones={ms} pfId={pf.id} />
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <div className="ax-eps-order_info_section">
                  <div className="ax-eps-order_info_section_title">Tasks ({pf.tasks.length})</div>
                  <div className="ax-eps-order_fams">
                    {pf.tasks.map((t) => (
                      <button key={t.id} type="button" className="ax-eps-order_fams_item" onClick={() => po.selectRow(`task::${t.id}`)}>
                        <div className="ax-eps-order_fams_item_top">
                          <span className="ax-eps-order_fams_item_label">
                            {t.code} · {t.name}
                          </span>
                          <StateChip state={t.scheduleClass} />
                        </div>
                        <div className="ax-eps-order_fams_item_meta">
                          <span>{processPathLabel(t.processPath)}</span>
                          <span>·</span>
                          <span>{t.spm} P/M</span>
                          <span>·</span>
                          <span>
                            {t.start} → {t.end}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ax-eps-order_info_section">
                  <div className="ax-eps-order_info_section_title">Notes ({po.getNotes(noteKeyForFamily(pf.id)).length})</div>
                  <EntityNotesList entityKey={noteKeyForFamily(pf.id)} placeholder="Add a note for this production family…" />
                </div>
              </div>
            )
          })()
        ) : row.kind === 'task' && row.pfId && row.taskId ? (
          (() => {
            const pf = productionFamilyById(row.pfId)
            const task = pf?.tasks.find((t) => t.id === row.taskId)
            if (!pf || !task) return null
            return (
              <div className="ax-eps-order_info_card">
                <div className="ax-eps-order_info_section">
                  <div className="ax-eps-order_info_section_title">Meta Info</div>
                  <Descriptions size="small" column={2} bordered labelStyle={{ width: 130, fontWeight: 500, color: '#262626' }}>
                    <Descriptions.Item label="Code">{task.code}</Descriptions.Item>
                    <Descriptions.Item label="Family">{pf.code}</Descriptions.Item>
                    <Descriptions.Item label="Process Path" span={2}>
                      {processPathLabel(task.processPath)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Owner">{task.ownerCellIds.map((id) => orgPathForCell(id)).join('; ')}</Descriptions.Item>
                    <Descriptions.Item label="SPM">{task.spm} P/M</Descriptions.Item>
                    <Descriptions.Item label="Start">{task.start}</Descriptions.Item>
                    <Descriptions.Item label="End">{task.end}</Descriptions.Item>
                    <Descriptions.Item label="Duration">{task.durationDays} days</Descriptions.Item>
                    <Descriptions.Item label="State">
                      <StateChip state={task.scheduleClass} />
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <div className="ax-eps-order_info_section">
                  <div className="ax-eps-order_info_section_title">
                    Sub-Tasks ({task.subTasks.length})
                    <Button size="small" type="link" icon={<AxMuiIcon icon="mdiPlusCircleOutline" size={14} />} onClick={() => po.addSubTask(pf.id, task.id)}>
                      Add Sub-Task
                    </Button>
                  </div>
                  <div className="ax-eps-order_fams">
                    {task.subTasks.map((s) => (
                      <button key={s.id} type="button" className="ax-eps-order_fams_item" onClick={() => po.selectRow(`sub::${task.id}::${s.id}`)}>
                        <div className="ax-eps-order_fams_item_top">
                          <span className="ax-eps-order_fams_item_label">{s.name}</span>
                          <SubTaskKindChip kind={s.kind} />
                          <StateChip state={s.scheduleClass} />
                        </div>
                        <div className="ax-eps-order_fams_item_meta">
                          <span>{s.spm} P/M</span>
                          <span>·</span>
                          <span>{s.durationDays} days</span>
                          <span>·</span>
                          <span>
                            {s.start} → {s.end}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ax-eps-order_info_section">
                  <div className="ax-eps-order_info_section_title">Notes ({po.getNotes(noteKeyForTask(task.id)).length})</div>
                  <EntityNotesList entityKey={noteKeyForTask(task.id)} placeholder="Add a note for this task…" />
                </div>
              </div>
            )
          })()
        ) : row.kind === 'subTask' && row.pfId && row.taskId && row.subTaskId ? (
          (() => {
            const pf = productionFamilyById(row.pfId)
            const task = pf?.tasks.find((t) => t.id === row.taskId)
            const sub = task?.subTasks.find((s) => s.id === row.subTaskId)
            if (!pf || !task || !sub) return null
            return (
              <div className="ax-eps-order_info_card">
                <div className="ax-eps-order_info_section">
                  <div className="ax-eps-order_info_section_title">Meta Info</div>
                  <Descriptions size="small" column={2} bordered labelStyle={{ width: 130, fontWeight: 500, color: '#262626' }}>
                    <Descriptions.Item label="Kind">
                      <SubTaskKindChip kind={sub.kind} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Name">{sub.name}</Descriptions.Item>
                    <Descriptions.Item label="Owner">{sub.ownerCellIds.map((id) => orgPathForCell(id)).join('; ')}</Descriptions.Item>
                    <Descriptions.Item label="SPM">{sub.spm} P/M</Descriptions.Item>
                    <Descriptions.Item label="Start">{sub.start}</Descriptions.Item>
                    <Descriptions.Item label="End">{sub.end}</Descriptions.Item>
                    <Descriptions.Item label="Duration">{sub.durationDays} days</Descriptions.Item>
                    <Descriptions.Item label="State">
                      <StateChip state={sub.scheduleClass} />
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <div className="ax-eps-order_info_section">
                  <div className="ax-eps-order_info_section_title">Notes ({po.getNotes(noteKeyForSubTask(task.id, sub.id)).length})</div>
                  <EntityNotesList entityKey={noteKeyForSubTask(task.id, sub.id)} placeholder="Add a note for this sub-task…" />
                </div>
              </div>
            )
          })()
        ) : null}
      </div>
    </div>
  )
})
