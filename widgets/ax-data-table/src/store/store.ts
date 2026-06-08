import { makeAutoObservable } from 'mobx'

import type { ObjectItem } from 'mendix'

export type DataTablePaginationMode = 'pagingButtons' | 'virtualScroll' | 'loadMore' | 'none'
export type DataTablePaginationVerticalPosition = 'above' | 'below' | 'both'
export type DataTablePaginationHorizontalAlign = 'left' | 'center' | 'right'
export type DataTableSelectionMethod = 'checkbox' | 'radio' | 'row'
export type DataTableSelectionMode = 'none' | 'single' | 'multi'
export type DataTableAlign = 'left' | 'center' | 'right'
export type DataTableFixed = 'left' | 'right' | undefined
export type DataTableSortDirection = 'asc' | 'desc' | undefined

export interface DataTableCell {
  kind: 'text' | 'link'
  text: string
  allowRowEvents: boolean
  onClick?: () => void
}

export interface DataTableColumn {
  key: string
  title: string
  groupKey?: string
  groupCaption?: string
  align: DataTableAlign
  headerAlign?: DataTableAlign
  width?: number
  minWidth?: number
  maxWidth?: number
  fixed?: DataTableFixed
  ellipsis: boolean
  renderType: 'attribute' | 'dynamicText' | 'link'
  allowRowEvents: boolean
  canSort: boolean
}

export interface DataTableRow {
  key: string
  item: ObjectItem
  cells: Record<string, DataTableCell>
  children?: DataTableRow[]
}

export type DataTableTitleAlign = 'left' | 'center' | 'right'

export interface DataTableStoreConfig {
  title: string
  showTitle: boolean
  titleAlign: DataTableTitleAlign
  stickyHeader: boolean
  tableHeight: number
  paginationMode: DataTablePaginationMode
  defaultPageNumber: number
  pageSize: number
  showRowCount: boolean
  paginationVerticalPosition: DataTablePaginationVerticalPosition
  paginationHorizontalAlign: DataTablePaginationHorizontalAlign
  selectionMethod: DataTableSelectionMethod
  showSelectAll: boolean
  keepSelection: boolean
  currentPage: number
  bordered: boolean
  showSizeChanger: boolean
  headerRowHeight: number
  bodyRowHeight: number
  enableTreeTable: boolean
  treeIndentSize: number
  treeCheckStrictly: boolean
}

export class DataTableStore {
  title = ''
  showTitle = false
  titleAlign: DataTableTitleAlign = 'left'
  stickyHeader = false
  tableHeight = 480
  paginationMode: DataTablePaginationMode = 'pagingButtons'
  defaultPageNumber = 1
  pageSize = 20
  showRowCount = true
  paginationVerticalPosition: DataTablePaginationVerticalPosition = 'below'
  paginationHorizontalAlign: DataTablePaginationHorizontalAlign = 'right'
  selectionMethod: DataTableSelectionMethod = 'checkbox'
  selectionMode: DataTableSelectionMode = 'none'
  showSelectAll = true
  keepSelection = false
  loading = false
  unavailable = false
  bordered = false
  showSizeChanger = false
  headerRowHeight = 0
  bodyRowHeight = 0
  enableTreeTable = false
  treeIndentSize = 15
  treeCheckStrictly = true
  hasMoreItems = false
  totalCount?: number = undefined
  currentPage = 1
  sortColumnKey?: string = undefined
  sortDirection?: DataTableSortDirection = undefined
  selectedKeys: string[] = []
  columns: DataTableColumn[] = []
  rows: DataTableRow[] = []

  onPageChange?: (pageNo: number, pageSize: number) => void
  onLoadMore?: () => void
  onSortChange?: (columnKey: string, direction: DataTableSortDirection) => void
  onSelectionChange?: (keys: string[]) => void
  onRowClick?: (item: ObjectItem) => void
  onRowDoubleClick?: (item: ObjectItem) => void

  constructor(config?: Partial<DataTableStoreConfig>) {
    if (config) {
      Object.assign(this, config)
    }
    
    makeAutoObservable(this)
  }

  setTitle(value: string) { this.title = value }
  setShowTitle(value: boolean) { this.showTitle = value }
  setTitleAlign(value: DataTableTitleAlign) { this.titleAlign = value }
  setStickyHeader(value: boolean) { this.stickyHeader = value }
  setTableHeight(value: number) { this.tableHeight = value }
  setPaginationMode(value: DataTablePaginationMode) { this.paginationMode = value }
  setDefaultPageNumber(value: number) { this.defaultPageNumber = value }
  setPageSize(value: number) { this.pageSize = value }
  setShowRowCount(value: boolean) { this.showRowCount = value }
  setPaginationVerticalPosition(value: DataTablePaginationVerticalPosition) { this.paginationVerticalPosition = value }
  setPaginationHorizontalAlign(value: DataTablePaginationHorizontalAlign) { this.paginationHorizontalAlign = value }
  setSelectionMethod(value: DataTableSelectionMethod) { this.selectionMethod = value }
  setSelectionMode(value: DataTableSelectionMode) { this.selectionMode = value }
  setShowSelectAll(value: boolean) { this.showSelectAll = value }
  setKeepSelection(value: boolean) { this.keepSelection = value }
  setLoading(value: boolean) { this.loading = value }
  setUnavailable(value: boolean) { this.unavailable = value }
  setBordered(value: boolean) { this.bordered = value }
  setShowSizeChanger(value: boolean) { this.showSizeChanger = value }
  setHeaderRowHeight(value: number) { this.headerRowHeight = value }
  setBodyRowHeight(value: number) { this.bodyRowHeight = value }
  setEnableTreeTable(value: boolean) { this.enableTreeTable = value }
  setTreeIndentSize(value: number) { this.treeIndentSize = value }
  setTreeCheckStrictly(value: boolean) { this.treeCheckStrictly = value }
  setHasMoreItems(value: boolean) { this.hasMoreItems = value }
  setTotalCount(value: number | undefined) { this.totalCount = value }
  setCurrentPage(value: number) { this.currentPage = value }
  setSortState(columnKey: string | undefined, direction: DataTableSortDirection) {
    this.sortColumnKey = columnKey
    this.sortDirection = direction
  }
  setSelectedKeys(keys: string[]) { this.selectedKeys = [...keys] }
  setColumns(columns: DataTableColumn[]) { this.columns = columns }
  setRows(rows: DataTableRow[]) { this.rows = rows }

  setOnPageChange(handler: ((pageNo: number, pageSize: number) => void) | undefined) { this.onPageChange = handler }
  setOnLoadMore(handler: (() => void) | undefined) { this.onLoadMore = handler }
  setOnSortChange(handler: ((columnKey: string, direction: DataTableSortDirection) => void) | undefined) {
    this.onSortChange = handler
  }
  setOnSelectionChange(handler: ((keys: string[]) => void) | undefined) { this.onSelectionChange = handler }
  setOnRowClick(handler: ((item: ObjectItem) => void) | undefined) { this.onRowClick = handler }
  setOnRowDoubleClick(handler: ((item: ObjectItem) => void) | undefined) { this.onRowDoubleClick = handler }

  pruneSelection(visibleKeys: string[]) {
    if (this.keepSelection || this.selectedKeys.length === 0) {
      return
    }

    const nextKeys = this.selectedKeys.filter((key) => visibleKeys.includes(key))
    if (nextKeys.length !== this.selectedKeys.length) {
      this.selectedKeys = nextKeys
      this.onSelectionChange?.(nextKeys)
    }
  }

  handlePageChange(pageNo: number, pageSize: number) {
    this.onPageChange?.(pageNo, pageSize)
  }

  handleLoadMore() {
    this.onLoadMore?.()
  }

  handleSortChange(columnKey: string, direction: DataTableSortDirection) {
    this.onSortChange?.(columnKey, direction)
  }

  handleSelectionChange(keys: string[]) {
    this.selectedKeys = [...keys]
    this.onSelectionChange?.(keys)
  }

  handleRowClick(item: ObjectItem) {
    if (this.selectionMode !== 'none') {
      const itemKey = String(item.id)
      const nextKeys = this.selectionMode === 'single'
        ? [itemKey]
        : this.selectedKeys.includes(itemKey)
          ? this.selectedKeys.filter((key) => key !== itemKey)
          : [...this.selectedKeys, itemKey]

      this.handleSelectionChange(nextKeys)
    }

    this.onRowClick?.(item)
  }

  handleRowDoubleClick(item: ObjectItem) {
    this.onRowDoubleClick?.(item)
  }

  get visibleRows(): DataTableRow[] {
    if (this.paginationMode === 'pagingButtons') {
      const start = (this.currentPage - 1) * this.pageSize
      return this.rows.slice(start, start + this.pageSize)
    }
    return this.rows
  }
}