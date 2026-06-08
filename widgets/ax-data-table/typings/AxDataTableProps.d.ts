/**
 * This file was generated from AxDataTable.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { DynamicValue, EditableValue, ListValue, ListActionValue, ListAttributeValue, ListExpressionValue, SelectionSingleValue, SelectionMultiValue } from "mendix";
import { Big } from "big.js";

export type TitleAlignEnum = "left" | "center" | "right";

export type PaginationModeEnum = "pagingButtons" | "virtualScroll" | "loadMore" | "none";

export type PaginationVerticalPositionEnum = "above" | "below" | "both";

export type PaginationHorizontalAlignEnum = "left" | "center" | "right";

export type SelectionMethodEnum = "checkbox" | "radio" | "row";

export type RenderTypeEnum = "attribute" | "dynamicText" | "link";

export type HeaderAlignEnum = "left" | "center" | "right";

export type CellAlignEnum = "auto" | "left" | "center" | "right";

export type FixedEnum = "none" | "left" | "right";

export interface ColumnsType {
    attributeValue?: ListAttributeValue<Big | boolean | Date | string>;
    caption?: DynamicValue<string>;
    groupKey: string;
    groupCaption: string;
    visible: boolean;
    renderType: RenderTypeEnum;
    dynamicTextValue?: ListExpressionValue<string>;
    linkCaption?: ListExpressionValue<string>;
    linkAction?: ListActionValue;
    allowRowEvents: boolean;
    sortable: boolean;
    headerAlign: HeaderAlignEnum;
    cellAlign: CellAlignEnum;
    fixed: FixedEnum;
    ellipsis: boolean;
    width: number;
    minWidth: number;
    maxWidth: number;
}

export interface ColumnsPreviewType {
    attributeValue: string;
    caption: string;
    groupKey: string;
    groupCaption: string;
    visible: boolean;
    renderType: RenderTypeEnum;
    dynamicTextValue: string;
    linkCaption: string;
    linkAction: {} | null;
    allowRowEvents: boolean;
    sortable: boolean;
    headerAlign: HeaderAlignEnum;
    cellAlign: CellAlignEnum;
    fixed: FixedEnum;
    ellipsis: boolean;
    width: number | null;
    minWidth: number | null;
    maxWidth: number | null;
}

export interface AxDataTableContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    dataSource: ListValue;
    showTitle: boolean;
    title?: DynamicValue<string>;
    titleAlign: TitleAlignEnum;
    stickyHeader: boolean;
    tableHeight: number;
    bordered: boolean;
    headerRowHeight: number;
    bodyRowHeight: number;
    paginationMode: PaginationModeEnum;
    defaultPageNumber: number;
    pageSize: number;
    showSizeChanger: boolean;
    showRowCount: boolean;
    paginationVerticalPosition: PaginationVerticalPositionEnum;
    paginationHorizontalAlign: PaginationHorizontalAlignEnum;
    selection?: SelectionSingleValue | SelectionMultiValue;
    selectedKeysAttr?: EditableValue<string>;
    selectionMethod: SelectionMethodEnum;
    showSelectAll: boolean;
    keepSelection: boolean;
    enableTreeTable: boolean;
    treeTableIdAttr?: ListAttributeValue<string | Big>;
    treeTableParentIdAttr?: ListAttributeValue<string | Big>;
    treeIndentSize: number;
    treeCheckStrictly: boolean;
    columns: ColumnsType[];
    dynamicColumnsSource?: ListValue;
    dynamicCellsAttribute?: ListAttributeValue<string>;
    dynamicColumnKey?: ListExpressionValue<string>;
    dynamicColumnTitle?: ListExpressionValue<string>;
    dynamicColumnValueKey?: ListExpressionValue<string>;
    dynamicColumnGroupKey?: ListExpressionValue<string>;
    dynamicColumnGroupTitle?: ListExpressionValue<string>;
    dynamicColumnVisible?: ListExpressionValue<string>;
    dynamicColumnWidth?: ListExpressionValue<string>;
    dynamicColumnHeaderAlign?: ListExpressionValue<string>;
    dynamicColumnAlign?: ListExpressionValue<string>;
    dynamicColumnFixed?: ListExpressionValue<string>;
    dynamicColumnSortable?: ListExpressionValue<string>;
    dynamicColumnEllipsis?: ListExpressionValue<string>;
    onRowClick?: ListActionValue;
    onRowDoubleClick?: ListActionValue;
}

export interface AxDataTablePreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    dataSource: {} | { caption: string } | { type: string } | null;
    showTitle: boolean;
    title: string;
    titleAlign: TitleAlignEnum;
    stickyHeader: boolean;
    tableHeight: number | null;
    bordered: boolean;
    headerRowHeight: number | null;
    bodyRowHeight: number | null;
    paginationMode: PaginationModeEnum;
    defaultPageNumber: number | null;
    pageSize: number | null;
    showSizeChanger: boolean;
    showRowCount: boolean;
    paginationVerticalPosition: PaginationVerticalPositionEnum;
    paginationHorizontalAlign: PaginationHorizontalAlignEnum;
    selection: "None" | "Single" | "Multi";
    selectedKeysAttr: string;
    selectionMethod: SelectionMethodEnum;
    showSelectAll: boolean;
    keepSelection: boolean;
    enableTreeTable: boolean;
    treeTableIdAttr: string;
    treeTableParentIdAttr: string;
    treeIndentSize: number | null;
    treeCheckStrictly: boolean;
    columns: ColumnsPreviewType[];
    dynamicColumnsSource: {} | { caption: string } | { type: string } | null;
    dynamicCellsAttribute: string;
    dynamicColumnKey: string;
    dynamicColumnTitle: string;
    dynamicColumnValueKey: string;
    dynamicColumnGroupKey: string;
    dynamicColumnGroupTitle: string;
    dynamicColumnVisible: string;
    dynamicColumnWidth: string;
    dynamicColumnHeaderAlign: string;
    dynamicColumnAlign: string;
    dynamicColumnFixed: string;
    dynamicColumnSortable: string;
    dynamicColumnEllipsis: string;
    onRowClick: {} | null;
    onRowDoubleClick: {} | null;
    onSelectionChanged: {} | null;
}
