/**
 * This file was generated from AxSimulation.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";
import { ActionValue, ListValue, SelectionSingleValue } from "mendix";

export interface AxSimulationContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    prpDsContexts?: ListValue;
    prpSelContext?: SelectionSingleValue;
    prpWdgLogo?: ReactNode;
    prpWdgSimulation?: ReactNode;
    prpWdgProjects?: ReactNode;
    prpWdgAnalysis?: ReactNode;
    prpWdgPmData?: ReactNode;
    prpWdgTuningLogic?: ReactNode;
    prpWdgFactorControl?: ReactNode;
    prpWdgPmStandard?: ReactNode;
    prpWdgIntegration?: ReactNode;
    prpWdgSetting?: ReactNode;
    prpWdgCompare?: ReactNode;
    prpWdgAiAssistant?: ReactNode;
    prpWdgRecommendation?: ReactNode;
    prpWdgHistory?: ReactNode;
    prpActApps?: ActionValue;
    prpActWorldMap?: ActionValue;
    prpActNotify?: ActionValue;
    prpActAccount?: ActionValue;
    prpActSettings?: ActionValue;
    prpStrSimulation: string;
    prpStrProjects: string;
    prpStrAnalysis: string;
    prpStrPmData: string;
    prpStrTuningLogic: string;
    prpStrSetting: string;
    prpStrCompare: string;
    prpStrAiAssistant: string;
    prpStrRecommendation: string;
    prpStrHistory: string;
    prpStrApps: string;
    prpStrWorldMap: string;
    prpStrNotify: string;
    prpStrAccount: string;
    prpStrSettings: string;
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
    prpDsContexts: {} | { caption: string } | { type: string } | null;
    prpSelContext: "Single" | "None";
    prpWdgLogo: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgSimulation: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgProjects: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgAnalysis: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgPmData: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgTuningLogic: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgFactorControl: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgPmStandard: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgIntegration: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgSetting: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgCompare: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgAiAssistant: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgRecommendation: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpWdgHistory: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    prpActApps: {} | null;
    prpActWorldMap: {} | null;
    prpActNotify: {} | null;
    prpActAccount: {} | null;
    prpActSettings: {} | null;
    prpStrSimulation: string;
    prpStrProjects: string;
    prpStrAnalysis: string;
    prpStrPmData: string;
    prpStrTuningLogic: string;
    prpStrSetting: string;
    prpStrCompare: string;
    prpStrAiAssistant: string;
    prpStrRecommendation: string;
    prpStrHistory: string;
    prpStrApps: string;
    prpStrWorldMap: string;
    prpStrNotify: string;
    prpStrAccount: string;
    prpStrSettings: string;
}
