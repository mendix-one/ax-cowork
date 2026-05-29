import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { observer } from 'mobx-react-lite'
import {
  HEADCOUNT_CAPACITY_LIMIT,
  HEADCOUNT_CAPACITY_SAFE,
  MOCK_DEMAND_MONTH_OFFSETS,
  MOCK_DEMAND_STAGE_CODES,
  MOCK_MONTHLY_DEMAND_BY_STAGE,
  mtoLabel,
} from '../../data/mock-plan'

// Resource demand by Engineering Stage across the MTO timeline. Stacked area chart with two reference
// lines (Limit = total headcount portfolio, Safe = 80% threshold) — same shape as the simulation
// Quick Analysis overall card but rendered at panel size.
export const EpsAnalysisShopFloorArea = observer(() => {
  const option = useMemo<EChartsOption>(() => {
    const offsets = MOCK_DEMAND_MONTH_OFFSETS
    const xData = offsets.map((o) => mtoLabel(o))
    const series = MOCK_DEMAND_STAGE_CODES.map((stage) => ({
      name: stage,
      type: 'line' as const,
      stack: 'Total',
      smooth: true,
      showSymbol: false,
      areaStyle: { opacity: 0.7 },
      data: offsets.map((off) => {
        const row = MOCK_MONTHLY_DEMAND_BY_STAGE.get(off)?.find((r) => r.stage === stage)
        return row?.demand ?? 0
      }),
    }))
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { type: 'scroll', bottom: 0, textStyle: { fontSize: 10 } },
      // Wider right margin so the Limit / Safe labels sit cleanly outside the data area.
      grid: { left: 50, right: 70, top: 16, bottom: 40 },
      xAxis: { type: 'category', boundaryGap: false, data: xData, axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 }, max: Math.ceil(HEADCOUNT_CAPACITY_LIMIT * 1.1) },
      series: [
        ...series,
        {
          name: 'Capacity reference',
          type: 'line',
          data: [],
          showSymbol: false,
          silent: true,
          tooltip: { show: false },
          markLine: {
            symbol: 'none' as const,
            silent: true,
            label: { position: 'end' as const, distance: 4, fontSize: 10, fontWeight: 'bold' as const, backgroundColor: '#ffffff', padding: [2, 4] as [number, number], borderRadius: 2 },
            data: [
              { yAxis: HEADCOUNT_CAPACITY_LIMIT, name: 'Limit', lineStyle: { color: '#f44336', type: 'solid' as const, width: 2 }, label: { formatter: `Limit ${HEADCOUNT_CAPACITY_LIMIT}`, color: '#f44336' } },
              { yAxis: HEADCOUNT_CAPACITY_SAFE, name: 'Safe', lineStyle: { color: '#ff9800', type: 'dashed' as const, width: 2 }, label: { formatter: `Safe ${HEADCOUNT_CAPACITY_SAFE}`, color: '#ff9800' } },
            ],
          },
        },
      ],
    }
  }, [])

  return (
    <div className="ax-eps-analysis_section">
      <div className="ax-eps-analysis_section_title">Resource demand by Engineering Stage (MTO timeline)</div>
      <div className="ax-eps-analysis_chart" style={{ height: 280 }}>
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
      </div>
    </div>
  )
})
