import { ReactElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";

import { AxSampleContainerProps } from "../typings/AxSampleProps";

import "./ui/AxSample.css";

export function AxSample({ sampleText }: AxSampleContainerProps): ReactElement {
    return <HelloWorldSample sampleText={sampleText ? sampleText : "World"} />;
}
