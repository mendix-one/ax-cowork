import { Segmented, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { HeatGranularity } from './analysis.store'
import { calcHeatmap, type HeatBand } from './analysis.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Band palette is pinned to the tool-group bar chart so both surfaces speak the same color language —
// teal=running normally, orange=approaching limit, red=over capacity. Idle (<40%) has no bar-chart
// equivalent, so it uses axSchedule.ghost.bar (neutral blue-grey) to read as "barely loaded".
const BAND_COLOR: Record<HeatBand, string> = {
  idle: '#cfd8dc', // axSchedule.ghost.bar (Blue Grey 200) — barely-loaded, neutral
  safe: '#00897b', // matches bar COLOR_USED_SAFE (axSchedule.new.bar, Teal 600)
  warning: '#EF6C00', // matches bar COLOR_USED_WARN (Orange 800)
  overload: '#C62828', // matches bar COLOR_USED_DANGER (Red 800)
}
const BAND_LABEL: Record<HeatBand, string> = {
  idle: '<40%',
  safe: '40–85%',
  warning: '85–100%',
  overload: '>100%',
}

// Workload heatmap — tool group × time bucket. Granularity is chosen via a Segmented control,
// which the store keeps so other parts of the view could also react if needed.
export const SimulationAnalysisHeatmap = observer(() => {
  const analysis = useSimulationContext().analysis
  const rows = calcHeatmap(analysis.heatGranularity)
  const buckets = rows[0]?.cells.map((c) => c.bucket) ?? []

  return (
    <div className="ax-analysis_section">
      <div className="ax-analysis_section_header">
        <div className="ax-analysis_section_header_title">
          <AxMuiIcon icon="mdiViewGridOutline" size={18} />
          <span>Workload heatmap · Tool group × {analysis.heatGranularity}</span>
        </div>
        <Segmented
          size="small"
          value={analysis.heatGranularity}
          onChange={(v) => analysis.setHeatGranularity(v as HeatGranularity)}
          options={[
            { label: 'Day', value: 'day' },
            { label: 'Month', value: 'month' },
            { label: 'Quarter', value: 'quarter' },
            { label: 'Year', value: 'year' },
          ]}
        />
      </div>
      <div className="ax-analysis_section_body" style={{ overflowX: 'auto' }}>
        <table className="ax-analysis_heatmap">
          <thead>
            <tr>
              <th className="ax-analysis_heatmap_label" style={{ textAlign: 'left' }}>
                Tool Group
              </th>
              {buckets.map((b) => (
                <th key={b} className="ax-analysis_heatmap_label" style={{ textAlign: 'center' }}>
                  {b.length > 7 ? b.slice(5) : b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.toolGroup}>
                <td className="ax-analysis_heatmap_label">{row.toolGroup}</td>
                {row.cells.map((cell) => (
                  <td key={cell.bucket} style={{ textAlign: 'center' }}>
                    <Tooltip title={`${row.toolGroup} · ${cell.bucket} · ${BAND_LABEL[cell.band]} (${Math.round(cell.ratio * 100)}%)`}>
                      <span className="ax-analysis_heatmap_cell" style={{ background: BAND_COLOR[cell.band] }} />
                    </Tooltip>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ax-analysis_heatmap_legend">
          {(['idle', 'safe', 'warning', 'overload'] as HeatBand[]).map((b) => (
            <Typography.Text key={b} type="secondary">
              <span className="ax-analysis_heatmap_swatch" style={{ background: BAND_COLOR[b] }} />
              {b} {BAND_LABEL[b]}
            </Typography.Text>
          ))}
        </div>
      </div>
    </div>
  )
})
