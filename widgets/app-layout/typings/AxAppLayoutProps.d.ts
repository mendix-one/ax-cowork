/**
 * This file was generated from AxAppLayout.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";

export interface AxAppLayoutContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    header?: ReactNode;
    left?: ReactNode;
    content?: ReactNode;
    right?: ReactNode;
    footer?: ReactNode;
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
    header: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    left: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    content: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    right: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    footer: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
}
