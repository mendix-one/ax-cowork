import { z } from 'zod'

// ECharts `option` is a huge open object — we only enforce it is an object.
// Deep validation of every chart-type-specific field would be brittle for AI output.
export const ChartBlockSchema = z.object({
  v: z.literal(1).optional(),
  id: z.string().min(1),
  option: z.record(z.string(), z.unknown()),
})

export type ChartBlockJson = z.infer<typeof ChartBlockSchema>
