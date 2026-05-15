import { z } from 'zod'

export const TableColumnSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum(['string', 'number']).optional(),
  sortable: z.boolean().optional(),
})

export type TableColumnJson = z.infer<typeof TableColumnSchema>

// Caps protect against AI emitting absurd payloads that would freeze the page.
const MAX_COLUMNS = 50
const MAX_ROWS = 5000

export const TableBlockSchema = z.object({
  v: z.literal(1).optional(),
  id: z.string().min(1),
  columns: z.array(TableColumnSchema).min(1).max(MAX_COLUMNS),
  data: z.array(z.record(z.string(), z.unknown())).max(MAX_ROWS),
})

export type TableBlockJson = z.infer<typeof TableBlockSchema>
