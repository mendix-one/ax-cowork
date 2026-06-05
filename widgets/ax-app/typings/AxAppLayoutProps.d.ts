/**
 * This file was generated from AxAppLayout.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, ListValue, SelectionSingleValue, WebIcon, WebImage } from "mendix";

export type PrpEnmModeEnum = "FILL_CONTENT_PAGE" | "ONE_PANEL_PAGE" | "SPLIT_VIEW_SINGLE" | "SPLIT_VIEW_MULTIPLE";

export interface PrpDsLeftMenusType {
    prpLeftMenuNo: number;
    prpLeftMenuIcon: DynamicValue<WebIcon>;
    prpLeftMenuCaption: DynamicValue<string>;
    prpLeftMenuAction?: ActionValue;
}

export interface PrpDsRightMenusType {
    prpRightMenuNo: number;
    prpRightMenuIcon: DynamicValue<WebIcon>;
    prpRightMenuCaption: DynamicValue<string>;
    prpRightMenuAction?: ActionValue;
}

export interface PrpDsLeftPanelsType {
    prpLeftPanelNo: number;
    prpLeftPanelIcon: DynamicValue<WebIcon>;
    prpLeftPanelCaption: DynamicValue<string>;
    prpLeftPanelContent: ReactNode;
}

export interface PrpDsRightPanelsType {
    prpRightPanelNo: number;
    prpRightPanelIcon: DynamicValue<WebIcon>;
    prpRightPanelCaption: DynamicValue<string>;
    prpRightPanelContent: ReactNode;
}

export interface PrpDsLeftMenusPreviewType {
    prpLeftMenuNo: number | null;
    prpLeftMenuIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; iconUrl: string; } | { type: "icon"; iconClass: string; } | undefined;
    prpLeftMenuCaption: string;
    prpLeftMenuAction: {} | null;
}

export interface PrpDsRightMenusPreviewType {
    prpRightMenuNo: number | null;
    prpRightMenuIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; iconUrl: string; } | { type: "icon"; iconClass: string; } | undefined;
    prpRightMenuCaption: string;
    prpRightMenuAction: {} | null;
}

export interface PrpDsLeftPanelsPreviewType {
    prpLeftPanelNo: number | null;
    prpLeftPanelIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; iconUrl: string; } | { type: "icon"; iconClass: string; } | undefined;
    prpLeftPanelCaption: string;
    prpLeftPanelContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
}

export interface PrpDsRightPanelsPreviewType {
    prpRightPanelNo: number | null;
    prpRightPanelIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; iconUrl: string; } | { type: "icon"; iconClass: string; } | undefined;
    prpRightPanelCaption: string;
    prpRightPanelContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
}

export interface AxAppLayoutContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    prpEnmMode: PrpEnmModeEnum;
    prpImgLogo?: DynamicValue<WebImage>;
    prpBlnHeaderMenuApps?: boolean;
    prpBlnHeaderMenuWorldMap?: boolean;
    prpBlnHeaderMenuNotify?: boolean;
    prpBlnHeaderMenuAccount?: boolean;
    prpBlnHeaderMenuSettings?: boolean;
    prpDsLeftMenus: PrpDsLeftMenusType[];
    prpDsRightMenus: PrpDsRightMenusType[];
    prpDsLeftPanels: PrpDsLeftPanelsType[];
    prpDsRightPanels: PrpDsRightPanelsType[];
    prpDsThemeConfigs?: ListValue;
    prpSelThemeConfig?: SelectionSingleValue;
    prpWdgPageContent?: ReactNode;
    prpActLogo?: ActionValue;
    prpActApps?: ActionValue;
    prpActWorldMap?: ActionValue;
    prpActNotify?: ActionValue;
    prpActAccount?: ActionValue;
    prpActSettings?: ActionValue;
    prpStrApps: string;
    prpStrWorldMap: string;
    prpStrNotify: string;
    prpStrAccount: string;
    prpStrSettings: string;
}

export interface AxAppLayoutPreviewProps {
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
    prpEnmMode: PrpEnmModeEnum;
    prpImgLogo: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    prpBlnHeaderMenuApps: boolean;
    prpBlnHeaderMenuWorldMap: boolean;
    prpBlnHeaderMenuNotify: boolean;
    prpBlnHeaderMenuAccount: boolean;
    prpBlnHeaderMenuSettings: boolean;
    prpDsLeftMenus: PrpDsLeftMenusPreviewType[];
    prpDsRightMenus: PrpDsRightMenusPreviewType[];
    prpDsLeftPanels: PrpDsLeftPanelsPreviewType[];
    prpDsRightPanels: PrpDsRightPanelsPreviewType[];
    prpDsThemeConfigs: {} | { caption: string } | { type: string } | null;
    prpSelThemeConfig: "Single" | "None";
    prpWdgPageContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpActLogo: {} | null;
    prpActApps: {} | null;
    prpActWorldMap: {} | null;
    prpActNotify: {} | null;
    prpActAccount: {} | null;
    prpActSettings: {} | null;
    prpStrApps: string;
    prpStrWorldMap: string;
    prpStrNotify: string;
    prpStrAccount: string;
    prpStrSettings: string;
}
