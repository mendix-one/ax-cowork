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
    prpAtrAccount: EditableValue<string>;
    prpAtrPassword: EditableValue<string>;
    prpActSignIn?: ActionValue;
    prpActSignUp?: ActionValue;
    prpActSso?: ActionValue;
    prpExpIsBusy: DynamicValue<boolean>;
    prpTxtErrorMessage?: DynamicValue<string>;
    prpImgLogoUrl?: DynamicValue<WebImage>;
    prpTxtAccountLabel: DynamicValue<string>;
    prpTxtAccountPlaceholder: DynamicValue<string>;
    prpTxtPasswordLabel: DynamicValue<string>;
    prpTxtSubmitLabel: DynamicValue<string>;
    prpTxtSignUpPrompt: DynamicValue<string>;
    prpTxtSignUpLinkLabel: DynamicValue<string>;
    prpTxtSsoLabel: DynamicValue<string>;
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
    prpAtrAccount: string;
    prpAtrPassword: string;
    prpActSignIn: {} | null;
    prpActSignUp: {} | null;
    prpActSso: {} | null;
    prpExpIsBusy: string;
    prpTxtErrorMessage: string;
    prpImgLogoUrl: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    prpTxtAccountLabel: string;
    prpTxtAccountPlaceholder: string;
    prpTxtPasswordLabel: string;
    prpTxtSubmitLabel: string;
    prpTxtSignUpPrompt: string;
    prpTxtSignUpLinkLabel: string;
    prpTxtSsoLabel: string;
}
