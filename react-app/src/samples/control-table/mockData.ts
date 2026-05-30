export const ROW_COUNT = 500
export const COL_COUNT = 100
export const NUMERIC_COL_COUNT = 50

export interface DemoRow {
  id: number
  [key: `c${number}`]: string | number
}

function buildCellValue(rowIndex: number, colIndex: number): string | number {
  if (colIndex < NUMERIC_COL_COUNT) {
    // Deterministic spread across 0..15 so all 3 color buckets appear.
    return (rowIndex * 7 + colIndex * 3) % 16
  }
  const variants = ['Body Cell', 'Body Cell A', 'Body Cell B', 'Body Cell C']
  return `${variants[(rowIndex + colIndex) % variants.length]} ${rowIndex + 1}-${colIndex + 1}`
}

export function buildMockRows(): DemoRow[] {
  const rows: DemoRow[] = []
  for (let r = 0; r < ROW_COUNT; r++) {
    const row: DemoRow = { id: r + 1 }
    for (let c = 0; c < COL_COUNT; c++) {
      row[`c${c + 1}`] = buildCellValue(r, c)
    }
    rows.push(row)
  }
  return rows
}
