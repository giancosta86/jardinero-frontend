import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Logger } from "@giancosta86/unified-logging";
import { CommandResponse, DictionaryStatus, SocketMessages } from "@lib";

export interface DictionaryControl {
  startPipeline(): void;
  cancelPipeline(): void;
  runCommand(command: string): void;
  refresh(): void;
}

function createWebSocket(
  socketPort: number,
  dictionaryStatusListener: (dictionaryStatus: DictionaryStatus) => void,
  commandResponseListener: (commandResponse: CommandResponse) => void,
  logger?: Logger
) {
  logger?.info(`Now creating a websocket to port ${socketPort}`);
  const socket = io(`ws://localhost:${socketPort}`);
  logger?.info("Socket created!");

  let firstConnection = true;

  socket.on("connect", () => {
    logger?.info("Socket connected! ^__^!");

    if (firstConnection) {
      logger?.info("Registering socket listeners!");
      registerSocketListeners();
      firstConnection = false;
    }

    socket.emit(SocketMessages.DictionaryStatusRequest);
  });

  const registerSocketListeners = () => {
    socket.on(
      SocketMessages.DictionaryStatusResponse,
      (dictionaryStatus: DictionaryStatus) => {
        logger?.debug(`Got dictionary status! ^__^ --> ${dictionaryStatus}`);
        dictionaryStatusListener(dictionaryStatus);
      }
    );

    socket.on(
      SocketMessages.CommandResponse,
      (commandResponse: CommandResponse) => {
        logger?.debug(`Got command response! ^__^ -> ${commandResponse}`);
        commandResponseListener(commandResponse);
      }
    );
  };

  return socket;
}

export function useBackendWebSocket(
  socketPort: number,
  dictionaryStatusListener: (dictionaryStatus: DictionaryStatus) => void,
  commandResponseListener: (commandResponse: CommandResponse) => void,
  logger?: Logger
): DictionaryControl {
  const [socket] = useState(() =>
    createWebSocket(
      socketPort,
      dictionaryStatusListener,
      commandResponseListener
    )
  );

  useEffect(() => {
    return () => {
      logger?.info("Closing the socket! ^__^");
      socket.close();
    };
  }, [logger, socket]);

  return {
    startPipeline() {
      socket.emit(SocketMessages.StartPipeline);
    },

    cancelPipeline() {
      socket.emit(SocketMessages.CancelPipeline);
    },

    runCommand(command: string) {
      socket.emit(SocketMessages.RunCommand, command);
    },

    refresh() {
      socket.emit(SocketMessages.DictionaryStatusRequest);
    }
  };
}
