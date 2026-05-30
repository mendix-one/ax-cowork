import { observer } from 'mobx-react-lite'
import { Typography } from 'antd'
import { calcHeatmap, type HeatBand } from '../../helpers/analysis.helpers'

const BAND_COLOR: Record<HeatBand, string> = {
  idle: '#ECEFF1',
  safe: '#0277BD',
  warning: '#EF6C00',
  overload: '#C62828',
}

// Org × MTO month-offset heatmap. Each cell tinted by the demand / headcount ratio band.
export const EpsAnalysisHeatmap = observer(() => {
  const rows = calcHeatmap()
  if (rows.length === 0 || rows[0].cells.length === 0) {
    return (
      <div className="ax-eps-analysis_section">
        <div className="ax-eps-analysis_section_title">Org demand heatmap (MTO offsets)</div>
        <Typography.Text type="secondary">No demand data.</Typography.Text>
      </div>
    )
  }
  const buckets = rows[0].cells.map((c) => c.bucket)
  return (
    <div className="ax-eps-analysis_section">
      <div className="ax-eps-analysis_section_title">Org demand heatmap (MTO offsets)</div>
      <div className="ax-eps-analysis_heatmap" style={{ overflowX: 'auto' }}>
        <table className="ax-eps-analysis_heatmap_table" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px 8px', fontSize: 11 }}>Org node</th>
              {buckets.map((b) => (
                <th key={b} style={{ padding: '4px 8px', fontSize: 11, textAlign: 'center' }}>
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.org}>
                <td style={{ padding: '4px 8px', fontSize: 11, whiteSpace: 'nowrap' }}>{r.org}</td>
                {r.cells.map((c) => (
                  <td
                    key={c.bucket}
                    title={`${c.bucket} · ${(c.ratio * 100).toFixed(0)}%`}
                    style={{
                      background: BAND_COLOR[c.band],
                      width: 36,
                      height: 22,
                      color: c.band === 'idle' ? '#37474F' : '#ffffff',
                      fontSize: 10,
                      textAlign: 'center',
                    }}
                  >
                    {(c.ratio * 100).toFixed(0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})
