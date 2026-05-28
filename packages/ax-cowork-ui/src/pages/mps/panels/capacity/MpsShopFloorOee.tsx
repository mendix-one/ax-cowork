import { Progress, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../store/mps.context'
import { calcOee } from './shop-floor.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// OEE breakdown card — Theoretical vs Effective ceilings plus the Availability × Performance × Quality factors.
// Helps the planner answer "why can't this group run faster?" without diving into MES.
export const MpsShopFloorOee = observer(() => {
  const store = useMpsContext().shopFloor
  const group = store.selectedGroup
  if (!group) return null
  const oee = calcOee(group.name)
  const oeeColor = oee.oee >= 0.85 ? '#4caf50' : oee.oee >= 0.7 ? '#ff9800' : '#f44336'

  return (
    <div className="ax-analysis_section">
      <div className="ax-analysis_section_header">
        <div className="ax-analysis_section_header_title">
          <AxMuiIcon icon="mdiSpeedometerMedium" size={18} />
          <span>OEE · {group.name}</span>
        </div>
        <Tag color={oee.oee >= 0.85 ? 'green' : oee.oee >= 0.7 ? 'orange' : 'red'} style={{ margin: 0 }}>
          OEE {Math.round(oee.oee * 100)}%
        </Tag>
      </div>
      <div className="ax-analysis_section_body ax-sf_oee_body">
        <div className="ax-sf_oee_grid">
          <div className="ax-sf_oee_block">
            <div className="ax-sf_oee_label">Effective ceiling</div>
            <div className="ax-sf_oee_value">{oee.effective.toLocaleString()}</div>
            <Typography.Text type="secondary" className="text-sm">
              wafer-moves/day
            </Typography.Text>
          </div>
          <div className="ax-sf_oee_block">
            <div className="ax-sf_oee_label">Theoretical max</div>
            <div className="ax-sf_oee_value">{oee.theoretical.toLocaleString()}</div>
            <Typography.Text type="secondary" className="text-sm">
              wafer-moves/day · 24/7 baseline
            </Typography.Text>
          </div>
          <div className="ax-sf_oee_block">
            <div className="ax-sf_oee_label">Headroom lost</div>
            <div className="ax-sf_oee_value" style={{ color: oeeColor }}>
              {(oee.theoretical - oee.effective).toLocaleString()}
            </div>
            <Typography.Text type="secondary" className="text-sm">
              to availability + drift
            </Typography.Text>
          </div>
        </div>
        <div className="ax-sf_oee_factors">
          <div className="ax-sf_oee_factor">
            <div className="ax-sf_oee_factor_label">Availability</div>
            <Progress percent={Math.round(oee.availability * 100)} size="small" status={oee.availability < 0.9 ? 'exception' : 'active'} />
          </div>
          <div className="ax-sf_oee_factor">
            <div className="ax-sf_oee_factor_label">Performance</div>
            <Progress percent={Math.round(oee.performance * 100)} size="small" status={oee.performance < 0.92 ? 'exception' : 'active'} />
          </div>
          <div className="ax-sf_oee_factor">
            <div className="ax-sf_oee_factor_label">Quality</div>
            <Progress percent={Math.round(oee.quality * 100)} size="small" status={oee.quality < 0.97 ? 'exception' : 'active'} />
          </div>
        </div>
      </div>
    </div>
  )
})
