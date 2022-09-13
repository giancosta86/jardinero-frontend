import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  CommandResponse,
  DictionaryStatus,
  InitializationMessage,
  SocketMessages
} from "@lib/shared";

export type InitializationListener = (
  initializationMessage: InitializationMessage
) => void;

export type DictionaryStatusListener = (
  dictionaryStatus: DictionaryStatus
) => void;

export type CommandResponseListener = (
  commandResponse: CommandResponse
) => void;

export interface DictionaryControl {
  startPipeline(): void;
  cancelPipeline(): void;
  runCommand(command: string): void;
  refresh(): void;
}

function createWebSocket(
  socketPort: number,
  initializationListener: InitializationListener,
  dictionaryStatusListener: DictionaryStatusListener,
  commandResponseListener: CommandResponseListener
) {
  console.info("Now creating a websocket to port:", socketPort);
  const socket = io(`ws://localhost:${socketPort}`);
  console.info("Socket created!");

  let firstConnection = true;

  socket.on("connect", () => {
    console.info("Socket connected! ^__^!");

    if (firstConnection) {
      console.debug("Registering socket listeners!");
      registerSocketListeners();
      firstConnection = false;
    }

    socket.emit(SocketMessages.DictionaryStatusRequest);
  });

  const registerSocketListeners = () => {
    socket.on(
      SocketMessages.InitializeFrontend,
      (initializationMessage: InitializationMessage) => {
        console.debug(
          "Got initialization message! ^__^ -->",
          initializationMessage
        );
        initializationListener(initializationMessage);
      }
    );

    socket.on(
      SocketMessages.DictionaryStatusResponse,
      (dictionaryStatus: DictionaryStatus) => {
        console.debug("Got dictionary status! ^__^ -->", dictionaryStatus);
        dictionaryStatusListener(dictionaryStatus);
      }
    );

    socket.on(
      SocketMessages.CommandResponse,
      (commandResponse: CommandResponse) => {
        console.debug("Got command response! ^__^ -->", commandResponse);
        commandResponseListener(commandResponse);
      }
    );
  };

  return socket;
}

export function useBackendWebSocket(
  socketPort: number,
  initializationListener: InitializationListener,
  dictionaryStatusListener: DictionaryStatusListener,
  commandResponseListener: CommandResponseListener
): DictionaryControl {
  const [socket] = useState(() =>
    createWebSocket(
      socketPort,
      initializationListener,
      dictionaryStatusListener,
      commandResponseListener
    )
  );

  useEffect(() => {
    return () => {
      console.info("Closing the socket! ^__^");
      socket.close();
    };
  }, [socket]);

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
