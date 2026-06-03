/**
 * This file was generated from AxLogin.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue, WebImage } from "mendix";

export interface AxLoginContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    accountAttribute: EditableValue<string>;
    passwordAttribute: EditableValue<string>;
    signInAction?: ActionValue;
    signUpAction?: ActionValue;
    ssoAction?: ActionValue;
    isBusy: DynamicValue<boolean>;
    errorMessage?: DynamicValue<string>;
    logoUrl?: DynamicValue<WebImage>;
    accountLabel: DynamicValue<string>;
    accountPlaceholder: DynamicValue<string>;
    passwordLabel: DynamicValue<string>;
    submitLabel: DynamicValue<string>;
    signUpPrompt: DynamicValue<string>;
    signUpLinkLabel: DynamicValue<string>;
    ssoLabel: DynamicValue<string>;
}

export interface AxLoginPreviewProps {
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
    accountAttribute: string;
    passwordAttribute: string;
    signInAction: {} | null;
    signUpAction: {} | null;
    ssoAction: {} | null;
    isBusy: string;
    errorMessage: string;
    logoUrl: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    accountLabel: string;
    accountPlaceholder: string;
    passwordLabel: string;
    submitLabel: string;
    signUpPrompt: string;
    signUpLinkLabel: string;
    ssoLabel: string;
}
