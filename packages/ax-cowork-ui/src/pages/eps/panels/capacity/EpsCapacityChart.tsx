import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { calcCapacityVsDemand } from '../../helpers/capacity.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Capacity vs demand line/area chart for the selected tool group.
// Two series + a horizontal mark line; days where demand exceeds capacity render as red markPoints.
export const EpsCapacityChart = observer(() => {
  const store = useEpsContext().capacity
  const group = store.selectedGroup
  const series = useMemo(() => (group ? calcCapacityVsDemand(group.name) : []), [group])

  const option = useMemo<EChartsOption>(() => {
    const xData = series.map((p) => p.date.slice(5))
    const capacityVal = series[0]?.capacity ?? 0
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { top: 0, textStyle: { fontSize: 11 } },
      grid: { left: 48, right: 16, top: 30, bottom: 28 },
      xAxis: { type: 'category', boundaryGap: false, data: xData, axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 }, max: Math.ceil(capacityVal * 1.2) },
      series: [
        {
          name: 'Capacity',
          type: 'line',
          data: series.map((p) => p.capacity),
          showSymbol: false,
          lineStyle: { color: '#673AB7', type: 'dashed', width: 2 },
          areaStyle: { color: 'rgba(103, 58, 183, 0.06)' },
        },
        {
          name: 'Demand',
          type: 'line',
          data: series.map((p) => p.demand),
          smooth: true,
          showSymbol: false,
          areaStyle: { color: 'rgba(33, 150, 243, 0.25)' },
          lineStyle: { color: '#2196f3', width: 2 },
          markPoint: {
            symbol: 'circle',
            symbolSize: 10,
            itemStyle: { color: '#f44336' },
            label: { show: false },
            data: series
              .map((p, i) => (p.over ? { coord: [i, p.demand], name: `Over ${p.date}` } : null))
              .filter((m): m is NonNullable<typeof m> => m !== null),
          },
        },
      ],
    }
  }, [series])

  return (
    <div className="ax-eps-analysis_section">
      <div className="ax-eps-analysis_section_header">
        <div className="ax-eps-analysis_section_header_title">
          <AxMuiIcon icon="mdiChartLineVariant" size={18} />
          <span>Capacity vs demand · {group?.name ?? '—'}</span>
        </div>
        <div className="ax-eps-analysis_section_header_hint">Red dots mark days where demand exceeded capacity.</div>
      </div>
      <div className="ax-eps-analysis_section_body" style={{ height: 240 }}>
        {group ? (
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
        ) : (
          <div style={{ color: 'rgba(0,0,0,0.45)' }}>Select a tool group on the left to see its capacity profile.</div>
        )}
      </div>
    </div>
  )
})
