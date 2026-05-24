// Default content for newly-inserted blocks. Short slug ids from Date.now() —
// good enough for editing; conflicts with AI-emitted ids are unlikely and
// non-catastrophic (each id only needs to be unique within one doc).

export function newChartBody(): string {
  return JSON.stringify(
    {
      id: `cht-${Date.now().toString(36)}`,
      option: {
        title: { text: 'New chart' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['A', 'B', 'C', 'D'] },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: [10, 20, 15, 25] }],
      },
    },
    null,
    2,
  )
}

export function newTableBody(): string {
  return JSON.stringify(
    {
      id: `tbl-${Date.now().toString(36)}`,
      columns: [
        { key: 'name', title: 'Name', kind: 'string', sortable: true },
        { key: 'count', title: 'Count', kind: 'number', sortable: true },
      ],
      data: [
        { name: 'Row 1', count: 10 },
        { name: 'Row 2', count: 20 },
        { name: 'Row 3', count: 30 },
      ],
    },
    null,
    2,
  )
}
