import { ReactElement } from 'react'
import { AxDataTablePreviewProps } from '../typings/AxDataTableProps'
import { DataTablePreview } from './preview/DataTablePreview'

export function preview(props: AxDataTablePreviewProps): ReactElement {
  return (
    <div className={props.class} style={props.styleObject}>
      <DataTablePreview
        title={props.title}
        columns={props.columns ?? []}
        stickyHeader={props.stickyHeader}
        paginationMode={props.paginationMode}
        pageSize={props.pageSize ?? 20}
      />
    </div>
  )
}

export function getPreviewCss(): string {
  return require('./styles/AxDataTablePreview.scss')
}
