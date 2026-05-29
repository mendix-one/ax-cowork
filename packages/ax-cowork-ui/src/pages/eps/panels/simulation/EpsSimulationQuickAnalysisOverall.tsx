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
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Two horizontal reference lines drawn on the chart:
//   • Limit — total headcount portfolio (the headcount available as person-months).
//   • Safe  — safe-planning threshold = 80% of limit.
// Labels sit on the *outside* of the chart on the right so they don't sit on top of the data line.
const REFERENCE_MARK_LINE = {
  symbol: 'none' as const,
  silent: true,
  lineStyle: { width: 1.5 },
  label: {
    position: 'end' as const,
    distance: 4,
    fontSize: 10,
    fontWeight: 'bold' as const,
    backgroundColor: '#ffffff',
    padding: [2, 4] as [number, number],
    borderRadius: 2,
  },
  data: [
    {
      yAxis: HEADCOUNT_CAPACITY_LIMIT,
      name: 'Limit',
      lineStyle: { color: '#f44336', type: 'solid' as const, width: 2 },
      label: { formatter: `Limit ${HEADCOUNT_CAPACITY_LIMIT}`, color: '#f44336' },
    },
    {
      yAxis: HEADCOUNT_CAPACITY_SAFE,
      name: 'Safe',
      lineStyle: { color: '#ff9800', type: 'dashed' as const, width: 2 },
      label: { formatter: `Safe ${HEADCOUNT_CAPACITY_SAFE}`, color: '#ff9800' },
    },
  ],
}

// Col #1 — Overall Resource Capacity. Stacked area of per-stage SPM demand per month-offset around MTO(0),
// against the headcount portfolio Limit / Safe references.
export const EpsSimulationQuickAnalysisOverall = observer(() => {
  const option = useMemo<EChartsOption>(() => {
    const offsets = MOCK_DEMAND_MONTH_OFFSETS
    const xData = offsets.map((o) => mtoLabel(o))

    // Build one stacked series per stage code present in the demand map.
    const stackedSeries = MOCK_DEMAND_STAGE_CODES.map((stage) => ({
      name: stage,
      type: 'line' as const,
      stack: 'Total',
      smooth: true,
      showSymbol: false,
      areaStyle: { opacity: 0.85 },
      emphasis: { focus: 'series' as const },
      data: offsets.map((off) => {
        const row = MOCK_MONTHLY_DEMAND_BY_STAGE.get(off)?.find((r) => r.stage === stage)
        return row?.demand ?? 0
      }),
    }))

    // Invisible host series solely for the two reference lines.
    const referenceSeries = {
      name: 'Capacity reference',
      type: 'line' as const,
      data: [],
      showSymbol: false,
      silent: true,
      tooltip: { show: false },
      markLine: REFERENCE_MARK_LINE,
    }

    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      // Generous right margin so the Limit/Safe labels sit cleanly outside the data area.
      grid: { left: 42, right: 60, top: 12, bottom: 26 },
      xAxis: { type: 'category', boundaryGap: false, data: xData, axisLabel: { fontSize: 10 } },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10 },
        max: Math.ceil(HEADCOUNT_CAPACITY_LIMIT * 1.1),
      },
      series: [...stackedSeries, referenceSeries],
    }
  }, [])

  return (
    <div className="ax-eps-simulation_analysis_card ax-eps-simulation_analysis_card__chart">
      <div className="ax-eps-simulation_analysis_card_header">
        <div className="ax-eps-simulation_analysis_card_header_title">Overall resource capacity (SPM)</div>
        <div className="ax-eps-simulation_analysis_card_header_option">
          <button className="ax-eps-simulation_analysis_card_header_option_button" type="button" title={'Large view'}>
            <AxMuiIcon icon={'mdiArrowExpandAll'} size="1.15rem" className="ax-eps-simulation_analysis_header_option_button_icon" />
          </button>
        </div>
      </div>
      <div className="ax-eps-simulation_analysis_card_chart_box">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
      </div>
    </div>
  )
})
