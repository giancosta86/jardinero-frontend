import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  CommandResponse,
  CommandResponseListener,
  DictionaryStatus,
  DictionaryStatusListener
} from "../protocol";
import { SocketMessages } from "../../lib";

type DictionaryStatusMessage = DictionaryStatus;
type CommandResponseMessage = CommandResponse;

export interface DictionaryControl {
  startPipeline(): void;
  cancelPipeline(): void;
  runCommand(command: string): void;
  refresh(): void;
}

function createWebSocket(
  socketPort: number,
  dictionaryStatusListener: DictionaryStatusListener,
  commandResponseListener: CommandResponseListener
) {
  console.info("Now creating a websocket to port", socketPort);
  const socket = io(`ws://localhost:${socketPort}`);
  console.info("Socket created!");

  let firstConnection = true;

  socket.on("connect", () => {
    console.info("Socket connected! ^__^!");

    if (firstConnection) {
      console.info("Registering socket listeners!");
      registerSocketListeners();
      firstConnection = false;
    }

    socket.emit(SocketMessages.dictionaryStatusRequest);
  });

  const registerSocketListeners = () => {
    socket.on(
      SocketMessages.dictionaryStatusResponse,
      (dictionaryStatusMessage: DictionaryStatusMessage) => {
        console.debug(
          "Got dictionary status! ^__^ -->",
          dictionaryStatusMessage
        );
        dictionaryStatusListener(dictionaryStatusMessage);
      }
    );

    socket.on(
      SocketMessages.commandResponse,
      (commandResponse: CommandResponseMessage) => {
        console.debug("Got command response! ^__^ ->", commandResponse);
        commandResponseListener(commandResponse);
      }
    );
  };

  return socket;
}

export function useBackendWebSocket(
  socketPort: number,
  dictionaryStatusListener: DictionaryStatusListener,
  commandResponseListener: CommandResponseListener
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
      console.log("Closing the socket! ^__^");
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
