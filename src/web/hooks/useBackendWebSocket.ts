import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Logger } from "@giancosta86/unified-logging";
import { CommandResponse, DictionaryStatus, SocketMessages } from "../../lib";
import { CommandResponseListener, DictionaryStatusListener } from "./listeners";

export interface DictionaryControl {
  startPipeline(): void;
  cancelPipeline(): void;
  runCommand(command: string): void;
  refresh(): void;
}

function createWebSocket(
  socketPort: number,
  dictionaryStatusListener: DictionaryStatusListener,
  commandResponseListener: CommandResponseListener,
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

    socket.emit(SocketMessages.dictionaryStatusRequest);
  });

  const registerSocketListeners = () => {
    socket.on(
      SocketMessages.dictionaryStatusResponse,
      (dictionaryStatus: DictionaryStatus) => {
        logger?.debug(`Got dictionary status! ^__^ --> ${dictionaryStatus}`);
        dictionaryStatusListener(dictionaryStatus);
      }
    );

    socket.on(
      SocketMessages.commandResponse,
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
  dictionaryStatusListener: DictionaryStatusListener,
  commandResponseListener: CommandResponseListener,
  logger?: Logger
): DictionaryControl {
  const [socket, _] = useState(() =>
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
  }, []);

  return {
    startPipeline() {
      socket.emit(SocketMessages.startPipeline);
    },

    cancelPipeline() {
      socket.emit(SocketMessages.cancelPipeline);
    },

    runCommand(command: string) {
      socket.emit(SocketMessages.runCommand, command);
    },

    refresh() {
      socket.emit(SocketMessages.dictionaryStatusRequest);
    }
  };
}
