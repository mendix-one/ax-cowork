// Single source of truth for what the AI is allowed to emit inside markdown
// docs. Consumers (BE prompt builders, future tool definitions) should pull
// from here rather than hand-rolling block syntax descriptions.

export const AX_MARKDOWN_BLOCK_PROMPT = `
You may embed interactive blocks inside markdown using fenced code blocks with these exact language tags.

CHART block (renders as an ECharts chart):
\`\`\`ax-chart
{
  "id": "<stable-unique-id-within-doc>",
  "option": { /* full ECharts option object — title/tooltip/xAxis/yAxis/series/... */ }
}
\`\`\`

TABLE block (renders as a sortable data table):
\`\`\`ax-table
{
  "id": "<stable-unique-id-within-doc>",
  "columns": [
    { "key": "<field>", "title": "<header>", "kind": "string" | "number", "sortable": true }
  ],
  "data": [ { "<field>": <value>, ... } ]
}
\`\`\`

Hard rules:
- The block body MUST be valid JSON (double-quoted keys, no trailing commas, no comments).
- "id" must be unique within the document. Use kebab-case or short slug.
- Data is INLINE — embed the snapshot values. Do not reference URLs or filesystem paths.
- Limits per table: max 50 columns, max 5000 rows.
- A "column.key" must match the keys used in each "data" row.

When in doubt, render as plain markdown (paragraphs, lists, tables, code) — only use ax-chart / ax-table when a visual widget genuinely helps the reader.
`.trim()
