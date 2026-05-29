import { Statistic, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { ProductionFamily } from '../../data/mock-plan'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const calcSummary = (families: ProductionFamily[]) => {
  let pfCount = families.length
  let taskCount = 0
  let subTaskCount = 0
  let totalSpm = 0
  let atRiskCount = 0
  for (const pf of families) {
    if (pf.scheduleClass === 'changes') atRiskCount += 1
    for (const t of pf.tasks) {
      taskCount += 1
      totalSpm += t.spm
      for (const s of t.subTasks) {
        subTaskCount += 1
        totalSpm += s.spm
      }
    }
  }
  return { pfCount, taskCount, subTaskCount, totalSpm, atRiskCount }
}

export const EpsOrderSummary = observer(() => {
  const po = useEpsContext().order
  const s = calcSummary(po.filteredFamilies)

  return (
    <div className="ax-eps-order_summary">
      <div className="ax-eps-order_summary_card">
        <div className="ax-eps-order_summary_card_title">
          <AxMuiIcon icon="mdiClipboardListOutline" size={16} />
          <span>Production families</span>
        </div>
        <div className="ax-eps-order_summary_card_body">
          <Statistic
            value={s.pfCount}
            suffix={
              <Typography.Text type="secondary" className="text-sm">
                {' '}
                PFs · {s.taskCount} tasks
              </Typography.Text>
            }
            styles={{ content: { fontSize: 22, color: '#2196f3' } }}
          />
          <Typography.Text type="secondary" className="text-sm">
            Sub-tasks {s.subTaskCount} · At-risk {s.atRiskCount}
          </Typography.Text>
        </div>
      </div>

      <div className="ax-eps-order_summary_card">
        <div className="ax-eps-order_summary_card_title">
          <AxMuiIcon icon="mdiAccountClockOutline" size={16} />
          <span>Total SPM demand</span>
        </div>
        <div className="ax-eps-order_summary_card_body">
          <Statistic
            value={s.totalSpm}
            suffix={
              <Typography.Text type="secondary" className="text-sm">
                {' '}
                P/M
              </Typography.Text>
            }
            styles={{ content: { fontSize: 22, color: '#3F51B5' } }}
          />
          <Typography.Text type="secondary" className="text-sm">
            Across {s.pfCount} production families
          </Typography.Text>
        </div>
      </div>

      <div className="ax-eps-order_summary_card">
        <div className="ax-eps-order_summary_card_title">
          <AxMuiIcon icon="mdiCheckCircleOutline" size={16} />
          <span>At-risk families</span>
        </div>
        <div className="ax-eps-order_summary_card_body">
          {s.atRiskCount > 0 ? (
            <Tag color="orange" style={{ margin: 0, alignSelf: 'flex-start' }}>
              {s.atRiskCount} at-risk PF · review priorities
            </Tag>
          ) : (
            <Typography.Text type="secondary" className="text-sm">
              All visible PFs on track.
            </Typography.Text>
          )}
        </div>
      </div>
    </div>
  )
})
