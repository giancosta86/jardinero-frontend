import { useState } from "react";
import { CommandResponse } from "@lib";

export interface CommandState {
  running: boolean;
  startRunning: () => void;
  response: CommandResponse;
  responseListener: (commandResponse: CommandResponse) => void;
}

export function useCommandState(): CommandState {
  const [running, setRunning] = useState(false);

  const [response, setResponse] = useState<CommandResponse>(() => ({
    exception: null,
    dataSet: null
  }));

  const responseListener = (response: CommandResponse) => {
    setRunning(false);
    setResponse(response);
  };

  const startRunning = () => {
    setRunning(true);
  };

  return {
    running,
    startRunning,
    response,
    responseListener
  };
}
