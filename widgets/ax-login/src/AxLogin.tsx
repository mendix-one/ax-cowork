import { ReactElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";

import { AxLoginContainerProps } from "../typings/AxLoginProps";

import "./ui/AxLogin.css";

export function AxLogin({ sampleText }: AxLoginContainerProps): ReactElement {
    return <HelloWorldSample sampleText={sampleText ? sampleText : "World"} />;
}
