import { ReactElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { AxLoginPreviewProps } from "../typings/AxLoginProps";

export function preview({ sampleText }: AxLoginPreviewProps): ReactElement {
    return <HelloWorldSample sampleText={sampleText} />;
}

export function getPreviewCss(): string {
    return require("./ui/AxLogin.css");
}
