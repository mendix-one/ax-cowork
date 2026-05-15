import { useMemo } from 'react'
import { Alert, Button, Flex, Input, Select, Splitter, Typography } from 'antd'
import type { EChartsOption } from 'echarts'
import { ChartBlock, ChartBlockSchema } from '@ax-cowork/markdown'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export interface ChartFormEditorProps {
  draft: string
  onDraftChange: (next: string) => void
}

type ChartType = 'bar' | 'line' | 'pie'

interface CartesianForm {
  type: 'bar' | 'line'
  title: string
  xAxis: string[]
  series: { name: string; data: number[] }[]
}

interface PieForm {
  type: 'pie'
  title: string
  slices: { name: string; value: number }[]
}

type Form = CartesianForm | PieForm

// Convert an arbitrary ECharts option into our simplified Form shape. Returns
// null when the option uses features the form can't represent (multiple
// xAxes, dataset, visualMap, mixed series types, etc.) — caller then forces
// the JSON tab.
function optionToForm(option: unknown): Form | null {
  if (!option || typeof option !== 'object') return null
  const opt = option as Record<string, unknown>

  const series = Array.isArray(opt.series) ? (opt.series as Record<string, unknown>[]) : null
  if (!series || series.length === 0) return null

  const firstType = series[0]?.type
  if (firstType !== 'bar' && firstType !== 'line' && firstType !== 'pie') return null
  if (!series.every((s) => s.type === firstType)) return null

  const title = (() => {
    const t = opt.title as Record<string, unknown> | undefined
    return typeof t?.text === 'string' ? t.text : ''
  })()

  if (firstType === 'pie') {
    const sliceData = series[0].data
    if (!Array.isArray(sliceData)) return null
    const slices = sliceData.map((s) => {
      if (typeof s !== 'object' || s === null) return null
      const o = s as Record<string, unknown>
      if (typeof o.name !== 'string' || typeof o.value !== 'number') return null
      return { name: o.name, value: o.value }
    })
    if (slices.some((s) => s === null)) return null
    return { type: 'pie', title, slices: slices as { name: string; value: number }[] }
  }

  // bar / line
  const xAxisRaw = opt.xAxis
  const xAxis = Array.isArray(xAxisRaw) ? xAxisRaw[0] : xAxisRaw
  if (!xAxis || typeof xAxis !== 'object') return null
  const xData = (xAxis as Record<string, unknown>).data
  if (!Array.isArray(xData)) return null
  const labels = xData.map((d) => String(d))

  const formSeries = series.map((s) => {
    const data = s.data
    if (!Array.isArray(data)) return null
    if (!data.every((v) => typeof v === 'number')) return null
    return { name: typeof s.name === 'string' ? s.name : '', data: data as number[] }
  })
  if (formSeries.some((s) => s === null)) return null

  return { type: firstType, title, xAxis: labels, series: formSeries as { name: string; data: number[] }[] }
}

function formToOption(form: Form): EChartsOption {
  const title = form.title ? { title: { text: form.title, left: 'center' } } : {}

  if (form.type === 'pie') {
    return {
      ...title,
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: form.slices,
        },
      ],
    }
  }

  return {
    ...title,
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: form.xAxis },
    yAxis: { type: 'value' },
    series: form.series.map((s) => ({ name: s.name, type: form.type, data: s.data })),
  }
}

export function ChartFormEditor({ draft, onDraftChange }: ChartFormEditorProps) {
  const parsed = useMemo(() => {
    try {
      const obj: unknown = JSON.parse(draft)
      const schema = ChartBlockSchema.safeParse(obj)
      if (!schema.success) return { ok: false as const, reason: 'schema' }
      const form = optionToForm(schema.data.option)
      if (!form) return { ok: false as const, reason: 'shape', id: schema.data.id }
      return { ok: true as const, id: schema.data.id, form, option: schema.data.option as EChartsOption }
    } catch {
      return { ok: false as const, reason: 'json' }
    }
  }, [draft])

  if (!parsed.ok) {
    const message =
      parsed.reason === 'json'
        ? 'Invalid JSON — switch to the JSON tab to fix.'
        : parsed.reason === 'schema'
          ? "JSON doesn't match the chart schema — switch to JSON tab."
          : 'This chart uses an option shape the form cannot represent (custom xAxis, multiple series types, dataset, …). Edit raw JSON instead.'
    return (
      <div style={{ padding: 16 }}>
        <Alert type="warning" message="Form unavailable" description={message} />
      </div>
    )
  }

  const { id, form } = parsed

  const commit = (nextForm: Form) => {
    const option = formToOption(nextForm)
    onDraftChange(JSON.stringify({ id, option }, null, 2))
  }

  const setType = (t: ChartType) => {
    // Switching type: morph form data sensibly. Pie <-> Cartesian needs reshape.
    if (t === form.type) return
    if (t === 'pie') {
      // Take the first cartesian series; xAxis labels become slice names.
      const labels = 'xAxis' in form ? form.xAxis : []
      const values = 'series' in form && form.series[0] ? form.series[0].data : []
      const slices = labels.map((name, i) => ({ name, value: typeof values[i] === 'number' ? values[i] : 0 }))
      commit({ type: 'pie', title: form.title, slices: slices.length > 0 ? slices : [{ name: 'A', value: 1 }] })
      return
    }
    if (form.type === 'pie') {
      const xAxis = form.slices.map((s) => s.name)
      const data = form.slices.map((s) => s.value)
      commit({ type: t, title: form.title, xAxis, series: [{ name: 'Series 1', data }] })
      return
    }
    commit({ ...form, type: t })
  }

  return (
    <Splitter style={{ height: '100%' }}>
      <Splitter.Panel defaultSize="45%" min="25%" max="70%">
        <div style={{ height: '100%', overflow: 'auto', padding: 12 }}>
          <Flex vertical gap={12}>
            <FormRow label="Block id">
              <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 3, fontSize: 12 }}>{id}</code>
            </FormRow>

            <FormRow label="Type">
              <Select<ChartType>
                value={form.type}
                onChange={setType}
                options={[
                  { label: 'Bar', value: 'bar' },
                  { label: 'Line', value: 'line' },
                  { label: 'Pie', value: 'pie' },
                ]}
                style={{ width: 160 }}
              />
            </FormRow>

            <FormRow label="Title">
              <Input value={form.title} placeholder="Chart title (optional)" onChange={(e) => commit({ ...form, title: e.target.value })} />
            </FormRow>

            {form.type === 'pie' ? <PieSlicesEditor form={form} onChange={commit} /> : <CartesianEditor form={form} onChange={commit} />}
          </Flex>
        </div>
      </Splitter.Panel>
      <Splitter.Panel>
        <div style={{ height: '100%', overflow: 'auto', padding: 12, background: '#fafafa' }}>
          <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
            Preview
          </Typography.Text>
          <ChartBlock option={formToOption(form)} height={300} />
        </div>
      </Splitter.Panel>
    </Splitter>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Flex vertical gap={4}>
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        {label}
      </Typography.Text>
      {children}
    </Flex>
  )
}

function CartesianEditor({ form, onChange }: { form: CartesianForm; onChange: (next: CartesianForm) => void }) {
  const setXAxis = (text: string) =>
    onChange({
      ...form,
      xAxis: text
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    })
  const setSeriesName = (idx: number, name: string) => onChange({ ...form, series: form.series.map((s, i) => (i === idx ? { ...s, name } : s)) })
  const setSeriesData = (idx: number, text: string) => {
    const data = text
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => Number(s))
      .map((n) => (Number.isFinite(n) ? n : 0))
    onChange({ ...form, series: form.series.map((s, i) => (i === idx ? { ...s, data } : s)) })
  }
  const addSeries = () => onChange({ ...form, series: [...form.series, { name: `Series ${form.series.length + 1}`, data: form.xAxis.map(() => 0) }] })
  const removeSeries = (idx: number) => {
    if (form.series.length <= 1) return
    onChange({ ...form, series: form.series.filter((_, i) => i !== idx) })
  }

  return (
    <>
      <FormRow label="X-axis labels (one per line)">
        <Input.TextArea rows={4} value={form.xAxis.join('\n')} onChange={(e) => setXAxis(e.target.value)} />
      </FormRow>

      <Typography.Text type="secondary" style={{ fontSize: 12, marginTop: 4 }}>
        Series
      </Typography.Text>
      {form.series.map((s, idx) => (
        <div key={idx} style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 8 }}>
          <Flex gap={4} align="center" style={{ marginBottom: 6 }}>
            <Input value={s.name} placeholder="Series name" size="small" onChange={(e) => setSeriesName(idx, e.target.value)} style={{ flex: 1 }} />
            <Button
              size="small"
              type="text"
              disabled={form.series.length <= 1}
              icon={<AxMuiIcon icon="mdiClose" size={12} />}
              onClick={() => removeSeries(idx)}
            />
          </Flex>
          <Input.TextArea
            rows={3}
            placeholder="Numbers, one per line or comma-separated"
            value={s.data.join('\n')}
            onChange={(e) => setSeriesData(idx, e.target.value)}
          />
        </div>
      ))}
      <Button size="small" icon={<AxMuiIcon icon="mdiPlus" size={12} />} onClick={addSeries} style={{ alignSelf: 'flex-start' }}>
        Add series
      </Button>
    </>
  )
}

function PieSlicesEditor({ form, onChange }: { form: PieForm; onChange: (next: PieForm) => void }) {
  const setSlice = (idx: number, patch: Partial<{ name: string; value: number }>) =>
    onChange({ ...form, slices: form.slices.map((s, i) => (i === idx ? { ...s, ...patch } : s)) })
  const removeSlice = (idx: number) => {
    if (form.slices.length <= 1) return
    onChange({ ...form, slices: form.slices.filter((_, i) => i !== idx) })
  }
  const addSlice = () => onChange({ ...form, slices: [...form.slices, { name: `Slice ${form.slices.length + 1}`, value: 0 }] })

  return (
    <FormRow label="Slices">
      <Flex vertical gap={4}>
        {form.slices.map((s, idx) => (
          <Flex key={idx} gap={4} align="center">
            <Input size="small" placeholder="Name" value={s.name} onChange={(e) => setSlice(idx, { name: e.target.value })} style={{ flex: 2 }} />
            <Input
              size="small"
              type="number"
              placeholder="0"
              value={s.value}
              onChange={(e) => setSlice(idx, { value: Number(e.target.value) || 0 })}
              style={{ flex: 1 }}
            />
            <Button
              size="small"
              type="text"
              disabled={form.slices.length <= 1}
              icon={<AxMuiIcon icon="mdiClose" size={12} />}
              onClick={() => removeSlice(idx)}
            />
          </Flex>
        ))}
        <Button size="small" icon={<AxMuiIcon icon="mdiPlus" size={12} />} onClick={addSlice} style={{ alignSelf: 'flex-start' }}>
          Add slice
        </Button>
      </Flex>
    </FormRow>
  )
}
