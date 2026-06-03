/**
 * This file was generated from AxDisplayPanel.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, EditableValue, WebIcon } from "mendix";

export type PrpEnmTypeEnum = "main" | "sub";

export interface AxDisplayPanelContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    prpIcnHeader?: DynamicValue<WebIcon>;
    prpStrTitle: string;
    prpWdgToolbar?: ReactNode;
    prpWdgContent?: ReactNode;
    prpEnmType: PrpEnmTypeEnum;
    prpAtrMaximized?: EditableValue<boolean>;
    prpActMaximize?: ActionValue;
    prpActRestore?: ActionValue;
    prpActClose?: ActionValue;
}

export interface AxDisplayPanelPreviewProps {
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
    prpIcnHeader: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; iconUrl: string; } | { type: "icon"; iconClass: string; } | undefined;
    prpStrTitle: string;
    prpWdgToolbar: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgContent: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpEnmType: PrpEnmTypeEnum;
    prpAtrMaximized: string;
    prpActMaximize: {} | null;
    prpActRestore: {} | null;
    prpActClose: {} | null;
}
