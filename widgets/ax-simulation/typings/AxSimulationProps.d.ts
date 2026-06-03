/**
 * This file was generated from AxSimulation.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";

export interface AxSimulationContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    logo?: ReactNode;
    topMenu?: ReactNode;
    line?: ReactNode;
    planVersion?: ReactNode;
    splitView?: ReactNode;
    notify?: ReactNode;
    user?: ReactNode;
    setting?: ReactNode;
    leftSimulation?: ReactNode;
    leftProjects?: ReactNode;
    leftAnalysis?: ReactNode;
    leftPmData?: ReactNode;
    leftTuningLogic?: ReactNode;
    leftFactorControl?: ReactNode;
    leftPmStandard?: ReactNode;
    leftIntegration?: ReactNode;
    leftSetting?: ReactNode;
    rightCompare?: ReactNode;
    rightAiAssistant?: ReactNode;
    rightRecommendation?: ReactNode;
    rightHistory?: ReactNode;
    footer?: ReactNode;
}

export interface AxSimulationPreviewProps {
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
    logo: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    topMenu: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    line: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    planVersion: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    splitView: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    notify: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    user: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    setting: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    leftSimulation: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    leftProjects: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    leftAnalysis: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    leftPmData: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    leftTuningLogic: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    leftFactorControl: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    leftPmStandard: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    leftIntegration: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    leftSetting: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    rightCompare: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    rightAiAssistant: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    rightRecommendation: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    rightHistory: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    footer: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
}
