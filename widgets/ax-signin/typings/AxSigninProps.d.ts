/**
 * This file was generated from AxSignin.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue, WebImage } from "mendix";

export interface AxSigninContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    prpImgLogoUrl?: DynamicValue<WebImage>;
    prpAttAccount: EditableValue<string>;
    prpAttPassword: EditableValue<string>;
    prpAttIsBusy: EditableValue<boolean>;
    prpTxtErrorMessage: EditableValue<string>;
    prpTxtSuccessMessage: EditableValue<string>;
    prpBlnBackground: boolean;
    prpTxtBgTitle?: DynamicValue<string>;
    prpTxtBgSubtitle?: DynamicValue<string>;
    prpTxtBgTagline?: DynamicValue<string>;
    prpActSignIn?: ActionValue;
    prpActSignUp?: ActionValue;
    prpActSso?: ActionValue;
    prpTxtAccountLabel: DynamicValue<string>;
    prpTxtAccountPlaceholder: DynamicValue<string>;
    prpTxtPasswordLabel: DynamicValue<string>;
    prpTxtSubmitLabel: DynamicValue<string>;
    prpTxtSignUpPrompt: DynamicValue<string>;
    prpTxtSignUpLinkLabel: DynamicValue<string>;
    prpTxtSsoLabel: DynamicValue<string>;
}

export interface AxSigninPreviewProps {
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
    prpImgLogoUrl: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    prpAttAccount: string;
    prpAttPassword: string;
    prpAttIsBusy: string;
    prpTxtErrorMessage: string;
    prpTxtSuccessMessage: string;
    prpBlnBackground: boolean;
    prpTxtBgTitle: string;
    prpTxtBgSubtitle: string;
    prpTxtBgTagline: string;
    prpActSignIn: {} | null;
    prpActSignUp: {} | null;
    prpActSso: {} | null;
    prpTxtAccountLabel: string;
    prpTxtAccountPlaceholder: string;
    prpTxtPasswordLabel: string;
    prpTxtSubmitLabel: string;
    prpTxtSignUpPrompt: string;
    prpTxtSignUpLinkLabel: string;
    prpTxtSsoLabel: string;
}
