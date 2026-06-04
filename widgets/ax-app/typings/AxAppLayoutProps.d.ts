/**
 * This file was generated from AxAppLayout.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, WebIcon, WebImage } from "mendix";

export interface PrpDsLeftPanelsType {
    prpLeftPanelIcon: DynamicValue<WebIcon>;
    prpLeftPanelCaption: DynamicValue<string>;
    prpLeftPanelContent: ReactNode;
}

export interface PrpDsRightPanelsType {
    prpRightPanelIcon: DynamicValue<WebIcon>;
    prpRightPanelCaption: DynamicValue<string>;
    prpRightPanelContent: ReactNode;
}

export interface PrpDsLeftPanelsPreviewType {
    prpLeftPanelIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; iconUrl: string; } | { type: "icon"; iconClass: string; } | undefined;
    prpLeftPanelCaption: string;
    prpLeftPanelContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
}

export interface PrpDsRightPanelsPreviewType {
    prpRightPanelIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; iconUrl: string; } | { type: "icon"; iconClass: string; } | undefined;
    prpRightPanelCaption: string;
    prpRightPanelContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
}

export interface AxAppLayoutContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    prpImgLogo?: DynamicValue<WebImage>;
    prpDsLeftPanels: PrpDsLeftPanelsType[];
    prpDsRightPanels: PrpDsRightPanelsType[];
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
    prpImgLogo: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    prpDsLeftPanels: PrpDsLeftPanelsPreviewType[];
    prpDsRightPanels: PrpDsRightPanelsPreviewType[];
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
