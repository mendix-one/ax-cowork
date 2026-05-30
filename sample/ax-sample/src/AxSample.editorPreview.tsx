import { ReactElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { AxSamplePreviewProps } from "../typings/AxSampleProps";

export function preview({ sampleText }: AxSamplePreviewProps): ReactElement {
    return <HelloWorldSample sampleText={sampleText} />;
}

export function getPreviewCss(): string {
    return require("./ui/AxSample.css");
}
