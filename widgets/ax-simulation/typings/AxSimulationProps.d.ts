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
    dsContexts?: ListValue;
    propContext?: SelectionSingleValue;
    logo?: ReactNode;
    propSimulation?: ReactNode;
    propProjects?: ReactNode;
    propAnalysis?: ReactNode;
    propPmData?: ReactNode;
    propTuningLogic?: ReactNode;
    propFactorControl?: ReactNode;
    propPmStandard?: ReactNode;
    propIntegration?: ReactNode;
    propSetting?: ReactNode;
    propCompare?: ReactNode;
    propAiAssistant?: ReactNode;
    propRecommendation?: ReactNode;
    propHistory?: ReactNode;
    actionApps?: ActionValue;
    actionWorldMap?: ActionValue;
    actionNotify?: ActionValue;
    actionAccount?: ActionValue;
    actionSettings?: ActionValue;
    labelSimulation: string;
    labelProjects: string;
    labelAnalysis: string;
    labelPmData: string;
    labelTuningLogic: string;
    labelSetting: string;
    labelCompare: string;
    labelAiAssistant: string;
    labelRecommendation: string;
    labelHistory: string;
    labelApps: string;
    labelWorldMap: string;
    labelNotify: string;
    labelAccount: string;
    labelSettings: string;
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
    dsContexts: {} | { caption: string } | { type: string } | null;
    propContext: "Single" | "None";
    logo: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propSimulation: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propProjects: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propAnalysis: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propPmData: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propTuningLogic: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propFactorControl: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propPmStandard: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propIntegration: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propSetting: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propCompare: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propAiAssistant: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propRecommendation: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    propHistory: { widgetCount: number; renderer: ComponentType<{ children: ReactNode; caption?: string }> };
    actionApps: {} | null;
    actionWorldMap: {} | null;
    actionNotify: {} | null;
    actionAccount: {} | null;
    actionSettings: {} | null;
    labelSimulation: string;
    labelProjects: string;
    labelAnalysis: string;
    labelPmData: string;
    labelTuningLogic: string;
    labelSetting: string;
    labelCompare: string;
    labelAiAssistant: string;
    labelRecommendation: string;
    labelHistory: string;
    labelApps: string;
    labelWorldMap: string;
    labelNotify: string;
    labelAccount: string;
    labelSettings: string;
}
