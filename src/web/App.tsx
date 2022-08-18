import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { DictionaryStatus } from "@lib";
import { CommandBox, OutputBox, useCommandState } from "./components/Command";
import { DictionaryBox } from "./components/DictionaryBox";
import { useBackendWebSocket } from "./useBackendWebSocket";
import logo from "./logo.svg";
import "./styles/globals.scss";
import pkg from "../../package.json";

export interface Props {
  websocketPort: number;
}

export const App = ({ websocketPort }: Props) => {
  const [dictionaryStatus, setDictionaryStatus] = useState<DictionaryStatus>(
    () => ({
      statusMessage: null,
      pipelineMessage: null,
      errorInPreviousPipeline: null
    })
  );

  const {
    response: commandResponse,
    running: commandRunning,
    startRunning,
    responseListener: commandResponseListener
  } = useCommandState();

  const dictionaryControl = useBackendWebSocket(
    websocketPort,
    setDictionaryStatus,
    commandResponseListener
  );

  const hasDictionary = dictionaryStatus.statusMessage != null;

  const runCommand = (command: string) => {
    startRunning();
    dictionaryControl.runCommand(command);
  };

  return (
    <div className="main">
      <Helmet>
        <meta name="frontend-version" content={pkg.version} />
      </Helmet>

      <header>
        <img className="logo" src={logo}></img>
      </header>

      {hasDictionary && (
        <CommandBox runCommand={runCommand} commandRunning={commandRunning} />
      )}

      <OutputBox commandResponse={commandResponse} />

      <DictionaryBox
        dictionaryStatus={dictionaryStatus}
        startPipeline={dictionaryControl.startPipeline}
        cancelPipeline={dictionaryControl.cancelPipeline}
      />

      <footer>
        Created by <a href="https://gianlucacosta.info/">Gianluca Costa</a>
      </footer>
    </div>
  );
};
