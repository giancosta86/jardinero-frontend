import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { DictionaryStatus, InitializationMessage } from "@lib/shared";
import { CommandBox, OutputBox, useCommandState } from "./components/Command";
import { DictionaryBox } from "./components/DictionaryBox";
import { useBackendWebSocket } from "./useBackendWebSocket";
import logo from "./logo.svg";
import "./styles/globals.scss";
import pkg from "../../package.json";

export interface Props {
  websocketPort: number;
}

function computePageTitle(pluginName?: string): string {
  const baseTitle = "Jardinero";

  return pluginName ? `${baseTitle} - ${pluginName}` : baseTitle;
}

export const App = ({ websocketPort }: Props) => {
  const [queryText, setQueryText] = useState<string>("");
  const [pageTitle, setPageTitle] = useState<string>(computePageTitle());

  const initializeFrontend = ({
    pluginName,
    startupQuery
  }: InitializationMessage) => {
    setPageTitle(computePageTitle(pluginName));
    setQueryText(startupQuery);
  };

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
    initializeFrontend,
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
        <title>{pageTitle}</title>
        <meta name="frontend-version" content={pkg.version} />
      </Helmet>

      <header>
        <img className="logo" src={logo}></img>
      </header>

      {hasDictionary && (
        <CommandBox
          queryText={queryText}
          setQueryText={setQueryText}
          runCommand={runCommand}
          commandRunning={commandRunning}
        />
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
