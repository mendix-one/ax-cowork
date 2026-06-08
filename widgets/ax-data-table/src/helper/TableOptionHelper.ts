import type { Big } from 'big.js'
import type { ListValue, ObjectItem } from 'mendix'
import type { DynamicValue } from 'mendix'
import { executeAction } from '@ax/common'
import { DataTableStore, DataTableCell, DataTableRow, DataTableColumn, DataTableSelectionMode } from 'src/store/store'
import { AxDataTableContainerProps, ColumnsType } from 'typings/AxDataTableProps'

export type RuntimeColumn = DataTableColumn & {
  source: 'fixed' | 'dynamic'
  attributeValue?: ColumnsType['attributeValue']
  dynamicTextValue?: ColumnsType['dynamicTextValue']
  linkCaption?: ColumnsType['linkCaption']
  linkAction?: ColumnsType['linkAction']
  valueKey?: string
}

export function buildStoreEvent(props: AxDataTableContainerProps, store: DataTableStore) {
  store.setOnPageChange((pageNo, pageSize) => {
    const safePageSize = Math.max(1, pageSize)
    const pageSizeChanged = safePageSize !== store.pageSize
    const safePage = Math.max(1, pageSizeChanged ? 1 : pageNo)
    store.setCurrentPage(safePage)
    store.setPageSize(safePageSize)

    // pagingButtons: fully client-side — no datasource offset/limit changes needed
    if (store.paginationMode === 'loadMore' || store.paginationMode === 'virtualScroll') {
      props.dataSource.setOffset(0)
      props.dataSource.setLimit(Math.max(1, safePage * safePageSize))
    }
  })

  store.setOnLoadMore(() => {
    const nextPage = store.currentPage + 1
    store.setCurrentPage(nextPage)
    props.dataSource.setOffset(0)
    props.dataSource.setLimit(Math.max(1, nextPage * store.pageSize))
  })

  store.setOnSortChange((columnKey, direction) => {
    const column = normalizeColumns(props.columns ?? []).find((item) => item.key === columnKey)
    if (!column?.attributeValue || !column.attributeValue.sortable || !direction) {
      props.dataSource.setSortOrder(undefined)
      store.setSortState(undefined, undefined)
      return
    }

    props.dataSource.setSortOrder([[column.attributeValue.id, direction]])
    store.setSortState(column.key, direction)
  })

  store.setOnSelectionChange((keys) => {
    applySelection(props.selection, props.dataSource.items ?? [], keys)
    syncSelectedKeysAttribute(props.selectedKeysAttr, keys)
  })

  store.setOnRowClick((item) => {
    executeAction(props.onRowClick?.get(item))
  })

  store.setOnRowDoubleClick((item) => {
    executeAction(props.onRowDoubleClick?.get(item))
  })

  return store
}

export function buildTableConfig(props: AxDataTableContainerProps, store: DataTableStore) {
  const initialPage = Math.max(1, props.defaultPageNumber)
  store.setTitle(props.title?.value ?? '')
  store.setShowTitle(props.showTitle)
  store.setTitleAlign(props.titleAlign)
  store.setStickyHeader(props.stickyHeader)
  store.setTableHeight(props.tableHeight || 0)
  store.setPaginationMode(props.paginationMode)
  store.setDefaultPageNumber(initialPage)
  store.setPageSize(props.pageSize)
  store.setShowRowCount(props.showRowCount)
  store.setPaginationVerticalPosition(props.paginationVerticalPosition)
  store.setPaginationHorizontalAlign(props.paginationHorizontalAlign)
  store.setSelectionMethod(props.selectionMethod)
  store.setShowSelectAll(props.showSelectAll)
  store.setKeepSelection(props.keepSelection)
  store.setBordered(props.bordered)
  store.setShowSizeChanger(props.showSizeChanger)
  store.setHeaderRowHeight(props.headerRowHeight ?? 0)
  store.setBodyRowHeight(props.bodyRowHeight ?? 0)
  store.setEnableTreeTable(props.enableTreeTable)
  store.setTreeIndentSize(props.treeIndentSize ?? 15)
  store.setTreeCheckStrictly(props.treeCheckStrictly ?? true)
}

export function buildPagination(dataSource: ListValue, store: DataTableStore) {
  // always need total count to render pagination correctly, even if pagination mode is 'none'
  dataSource.requestTotalCount(true)

  if (store.paginationMode === 'pagingButtons') {
    // Client-side pagination: load all rows, slicing is done in store.visibleRows
    dataSource.setOffset(0)
    dataSource.setLimit(undefined)
    store.setCurrentPage(store.defaultPageNumber)
    return
  }

  if (store.paginationMode === 'loadMore' || store.paginationMode === 'virtualScroll') {
    dataSource.setOffset(0)
    dataSource.setLimit(Math.max(1, store.defaultPageNumber * store.pageSize))
    store.setCurrentPage(store.defaultPageNumber)
  } else if (store.paginationMode === 'none') {
    dataSource.setOffset(0)
    dataSource.setLimit(undefined)
  }
}

export function syncRuntimeState(props: AxDataTableContainerProps, store: DataTableStore) {
  store.setLoading(props.dataSource.status.toString().toLocaleLowerCase() === 'loading')
  store.setUnavailable(props.dataSource.status.toString().toLocaleLowerCase() === 'unavailable')

  if (props.dataSource.status.toString().toLocaleLowerCase() === 'available') {
    store.setHasMoreItems(Boolean(props.dataSource.hasMoreItems))
    const fixedColumns = normalizeColumns(props.columns ?? [])
    const columns = [...fixedColumns, ...normalizeDynamicColumns(props)]
    const flatRows = (props.dataSource.items ?? []).map((item) => buildRow(item, columns, props.dynamicCellsAttribute))
    const treeRows = store.enableTreeTable ? buildTreeRows(flatRows, props.treeTableIdAttr, props.treeTableParentIdAttr) : flatRows

    // Store all rows — visibleRows getter handles client-side slicing for pagingButtons
    store.setTotalCount(store.paginationMode === 'pagingButtons' ? treeRows.length : props.dataSource.totalCount)
    store.setColumns(columns)
    store.setRows(treeRows)
    store.pruneSelection(flatRows.map((row) => row.key))

    store.setSelectionMode(getSelectionMode(props.selection))
    store.setSelectedKeys(getSelectionKeys(props.selection))

    const sortInstruction = props.dataSource.sortOrder?.[0]
    if (!sortInstruction) {
      store.setSortState(undefined, undefined)
      return
    }

    const matchedColumn = fixedColumns.find((column) => column.attributeValue?.id === sortInstruction[0])
    store.setSortState(matchedColumn?.key, sortInstruction[1])
  }
}

export function normalizeColumns(columns: ColumnsType[]): RuntimeColumn[] {
  return columns
    .filter((column) => column.visible)
    .map((column, index) => {
      const key = buildFixedColumnBaseKey(index)

      return {
        source: 'fixed' as const,
        key,
        title: column.caption?.value ?? '',
        groupKey: column.groupKey || undefined,
        groupCaption: column.groupCaption || undefined,
        align: column.cellAlign !== 'auto' ? (column.cellAlign as DataTableColumn['align']) : (column.headerAlign as DataTableColumn['align']),
        headerAlign: column.headerAlign as DataTableColumn['headerAlign'],
        width: column.width > 0 ? column.width : undefined,
        minWidth: column.minWidth > 0 ? column.minWidth : undefined,
        maxWidth: column.maxWidth > 0 ? column.maxWidth : undefined,
        fixed: column.fixed === 'none' ? undefined : column.fixed,
        ellipsis: column.ellipsis,
        renderType: column.renderType,
        allowRowEvents: column.allowRowEvents,
        canSort: Boolean(column.sortable && column.attributeValue?.sortable),
        attributeValue: column.attributeValue,
        dynamicTextValue: column.dynamicTextValue,
        linkCaption: column.linkCaption,
        linkAction: column.linkAction,
      }
    })
}

function buildFixedColumnBaseKey(index: number): string {
  return `ax_column_${index + 1}`
}

export function normalizeDynamicColumns(props: AxDataTableContainerProps): RuntimeColumn[] {
  if (!props.dynamicColumnsSource?.items?.length || !props.dynamicColumnKey || !props.dynamicColumnTitle) {
    return []
  }

  return props.dynamicColumnsSource.items.flatMap((item) => {
    const key = props.dynamicColumnKey?.get(item).value?.trim()
    if (!key) {
      return []
    }

    const visibleStr = props.dynamicColumnVisible?.get(item).value
    const visible = visibleStr === undefined || visibleStr === null ? true : visibleStr.trim() !== 'false'
    if (!visible) {
      return []
    }

    const cellAlign = normalizeAlign(props.dynamicColumnAlign?.get(item).value)
    const headerAlignRaw = props.dynamicColumnHeaderAlign?.get(item).value
    const sortableStr = props.dynamicColumnSortable?.get(item).value
    const ellipsisStr = props.dynamicColumnEllipsis?.get(item).value

    return [
      {
        source: 'dynamic',
        key,
        title: props.dynamicColumnTitle?.get(item).value ?? key,
        groupKey: props.dynamicColumnGroupKey?.get(item).value || undefined,
        groupCaption: props.dynamicColumnGroupTitle?.get(item).value || undefined,
        align: cellAlign,
        headerAlign: headerAlignRaw ? normalizeAlign(headerAlignRaw) : cellAlign,
        width: normalizeWidth(props.dynamicColumnWidth?.get(item).value),
        fixed: normalizeFixed(props.dynamicColumnFixed?.get(item).value),
        ellipsis: ellipsisStr === undefined || ellipsisStr === null ? true : ellipsisStr.trim() !== 'false',
        renderType: 'dynamicText',
        allowRowEvents: true,
        canSort: sortableStr !== undefined && sortableStr !== null ? sortableStr.trim() !== 'false' : false,
        valueKey: props.dynamicColumnValueKey?.get(item).value || key,
      },
    ]
  })
}

export function buildRow(
  item: ObjectItem,
  columns: RuntimeColumn[],
  dynamicCellsAttribute?: AxDataTableContainerProps['dynamicCellsAttribute'],
): { key: string; item: ObjectItem; cells: Record<string, DataTableCell> } {
  const dynamicCells = parseDynamicCells(item, dynamicCellsAttribute)
  const cells = columns.reduce<Record<string, DataTableCell>>((accumulator, column) => {
    accumulator[column.key] = buildCell(item, column, dynamicCells)
    return accumulator
  }, {})

  return {
    key: String(item.id),
    item,
    cells,
  }
}

export function buildCell(item: ObjectItem, column: RuntimeColumn, dynamicCells: Record<string, unknown>): DataTableCell {
  if (column.source === 'dynamic') {
    return {
      kind: 'text',
      text: getDynamicCellText(dynamicCells, column.valueKey ?? column.key),
      allowRowEvents: true,
    }
  }

  if (column.renderType === 'link') {
    const caption = getCellText(item, column.linkCaption, column.dynamicTextValue, column.attributeValue)
    return {
      kind: 'link',
      text: caption,
      allowRowEvents: column.allowRowEvents,
      onClick: () => {
        if ('linkAction' in column && column.linkAction) {
          executeAction(column.linkAction.get(item))
        }
      },
    }
  }

  return {
    kind: 'text',
    text: getCellText(item, undefined, column.dynamicTextValue, column.attributeValue),
    allowRowEvents: column.allowRowEvents,
  }
}

export function getCellText(
  item: ObjectItem,
  preferred?: { get: (item: ObjectItem) => DynamicValue<string> },
  template?: { get: (item: ObjectItem) => DynamicValue<string> },
  attribute?: ColumnsType['attributeValue'],
): string {
  if (preferred) {
    const value = preferred.get(item)
    if (value.value) {
      return value.value
    }
  }

  if (template) {
    const value = template.get(item)
    if (value.value) {
      return value.value
    }
  }

  if (attribute) {
    const value = attribute.get(item)
    return value.displayValue ?? ''
  }

  return ''
}

export function parseDynamicCells(item: ObjectItem, dynamicCellsAttribute?: AxDataTableContainerProps['dynamicCellsAttribute']): Record<string, unknown> {
  if (!dynamicCellsAttribute) {
    return {}
  }

  const value = dynamicCellsAttribute.get(item).value
  if (!value) {
    return {}
  }

  try {
    const parsed = JSON.parse(value) as unknown
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

export function getDynamicCellText(dynamicCells: Record<string, unknown>, key: string): string {
  const value = dynamicCells[key]
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return JSON.stringify(value)
}

export function buildTreeRows(
  flatRows: DataTableRow[],
  idAttr: AxDataTableContainerProps['treeTableIdAttr'],
  parentIdAttr: AxDataTableContainerProps['treeTableParentIdAttr'],
): DataTableRow[] {
  if (!idAttr || !parentIdAttr) {
    return flatRows
  }

  // Build lookup: treeId string -> mutable row clone
  const rowByTreeId = new Map<string, DataTableRow>()
  const rowClones = flatRows.map((row) => {
    const clone: DataTableRow = { ...row, children: undefined }
    const rawId = idAttr.get(row.item).value
    if (rawId !== undefined && rawId !== null) {
      const treeId =
        (rawId as Big | string | undefined) instanceof Object && 'toString' in Object(rawId) ? (rawId as { toString(): string }).toString() : String(rawId)
      rowByTreeId.set(treeId, clone)
    }

    return clone
  })

  const roots: DataTableRow[] = []

  for (const clone of rowClones) {
    const originalRow = flatRows.find((r) => r.key === clone.key)
    if (!originalRow) {
      roots.push(clone)
      continue
    }

    const rawParentId = parentIdAttr.get(originalRow.item).value
    const parentIdStr =
      rawParentId !== undefined && rawParentId !== null
        ? (rawParentId as Big | string | undefined) instanceof Object && 'toString' in Object(rawParentId)
          ? (rawParentId as { toString(): string }).toString()
          : String(rawParentId)
        : ''

    if (!parentIdStr || !rowByTreeId.has(parentIdStr)) {
      roots.push(clone)
    } else {
      const parent = rowByTreeId.get(parentIdStr)!
      if (!parent.children) {
        parent.children = []
      }

      parent.children.push(clone)
    }
  }

  return roots
}

export function normalizeAlign(value?: string): DataTableColumn['align'] {
  if (value === 'center' || value === 'right') {
    return value
  }

  return 'left'
}

export function normalizeFixed(value?: string): DataTableColumn['fixed'] {
  if (value === 'left' || value === 'right') {
    return value
  }

  return undefined
}

export function normalizeWidth(value: unknown): number | undefined {
  if (typeof value === 'number' && value > 0) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim())
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
  }

  if (value && typeof value === 'object' && 'toString' in value) {
    const parsed = Number(value.toString())
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
  }

  return undefined
}

export function getSelectionMode(selection: AxDataTableContainerProps['selection']): DataTableSelectionMode {
  if (!selection) {
    return 'none'
  }

  return selection.type === 'Multi' ? 'multi' : 'single'
}

export function getSelectionKeys(selection: AxDataTableContainerProps['selection']): string[] {
  if (!selection) {
    return []
  }

  if (selection.type === 'Single') {
    return selection.selection ? [String(selection.selection.id)] : []
  }

  return selection.selection.map((item) => String(item.id))
}

export function applySelection(selection: AxDataTableContainerProps['selection'], items: ObjectItem[], keys: string[]) {
  if (!selection) {
    return
  }

  const selectedItems = items.filter((item) => keys.includes(String(item.id)))

  if (selection.type === 'Single') {
    selection.setSelection(selectedItems[0])
    return
  }

  selection.setSelection(selectedItems)
}

export function syncSelectedKeysAttribute(attribute: AxDataTableContainerProps['selectedKeysAttr'], keys: string[]) {
  if (!attribute || attribute.readOnly) {
    return
  }

  attribute.setValue(JSON.stringify(keys))
}
