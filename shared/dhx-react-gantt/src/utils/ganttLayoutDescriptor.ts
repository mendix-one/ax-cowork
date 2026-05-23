export default function buildLayoutDescriptor(layout: any | undefined): any {
  if (!layout) return null
  if (layout.rows) {
    return {
      type: 'rows',
      children: layout.rows.map(buildRowDescriptor),
    }
  } else if (layout.cols) {
    return {
      type: 'cols',
      children: layout.cols.map(buildRowDescriptor),
    }
  }
  return null
}

function buildRowDescriptor(row: any): any {
  if ('cols' in row) {
    return { type: 'cols', children: row.cols.map(buildRowDescriptor) }
  } else if ('rows' in row) {
    return { type: 'rows', children: row.rows.map(buildRowDescriptor) }
  } else if (row.view) {
    return {
      type: row.view,
      id: row.id ?? null,
    }
  } else if (row.resizer) {
    return { type: 'resizer' }
  } else {
    return { type: 'html' }
  }
}
