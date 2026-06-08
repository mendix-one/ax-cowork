import { type ReactElement } from 'react'

type PreviewColumn = {
  columnKey?: string
  caption?: string
  groupCaption?: string
}

interface DataTablePreviewProps {
  title?: string
  columns: PreviewColumn[]
  stickyHeader: boolean
  paginationMode: string
  pageSize: number
}

export function DataTablePreview({ title, columns, stickyHeader, paginationMode, pageSize }: DataTablePreviewProps): ReactElement {
  return (
    <div className="ax-data-table-preview">
      <div className="ax-data-table-preview__title">{title || 'Ax Data Table'}</div>
      <div className="ax-data-table-preview__meta">
        <span>{columns.length || 0} columns</span>
        <span>{stickyHeader ? 'Sticky header' : 'Static header'}</span>
        <span>{paginationMode}</span>
        <span>{pageSize} rows/page</span>
      </div>
      <div className="ax-data-table-preview__table">
        <div className="ax-data-table-preview__header">
          {(columns.length
            ? columns
            : [
                { columnKey: 'column1', caption: 'Column 1' },
                { columnKey: 'column2', caption: 'Column 2' },
              ]
          ).map((column, index) => (
            <div className="ax-data-table-preview__cell ax-data-table-preview__cell--header" key={column.columnKey ?? `column-${index}`}>
              {column.groupCaption ? `${column.groupCaption} / ` : ''}
              {column.caption || column.columnKey || `Column ${index + 1}`}
            </div>
          ))}
        </div>
        <div className="ax-data-table-preview__row">
          {(columns.length
            ? columns
            : [
                { columnKey: 'column1', caption: 'Column 1' },
                { columnKey: 'column2', caption: 'Column 2' },
              ]
          ).map((column, index) => (
            <div className="ax-data-table-preview__cell" key={column.columnKey ?? `column-row-${index}`}>
              Row value
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
