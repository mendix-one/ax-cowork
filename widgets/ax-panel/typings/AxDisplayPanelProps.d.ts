/**
 * This file was generated from AxDisplayPanel.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, DynamicValue, EditableValue, WebIcon } from "mendix";

export type TypeEnum = "main" | "sub";

export interface AxDisplayPanelContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    headerIcon?: DynamicValue<WebIcon>;
    title: string;
    toolbar?: ReactNode;
    content?: ReactNode;
    type: TypeEnum;
    maximized?: EditableValue<boolean>;
    onMaximize?: ActionValue;
    onRestore?: ActionValue;
    onClose?: ActionValue;
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
    headerIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; iconUrl: string; } | { type: "icon"; iconClass: string; } | undefined;
    title: string;
    toolbar: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    content: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    type: TypeEnum;
    maximized: string;
    onMaximize: {} | null;
    onRestore: {} | null;
    onClose: {} | null;
}
