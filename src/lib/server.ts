import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { Logger } from "@giancosta86/unified-logging";
import {
  CommandResponse,
  DictionaryStatus,
  InitializationMessage,
  SocketMessages
} from "./shared";

type GenericMessageListener = (...args: any[]) => void | Promise<void>;

export class FrontendWebSocket {
  constructor(
    private readonly socket: Socket,
    private readonly logger?: Logger
  ) {}

  on(
    messageName:
      | SocketMessages.StartPipeline
      | SocketMessages.CancelPipeline
      | SocketMessages.DictionaryStatusRequest,
    listener: () => void | Promise<void>
  ): this;
  on(
    messageName: SocketMessages.RunCommand,
    listener: (command: string) => void | Promise<void>
  ): this;
  on(messageName: string, listener: GenericMessageListener): this {
    this.socket.on(messageName, async (...args: any[]) => {
      this.logger?.info(`Got a message from client! ^__^ --> ${messageName}`);

      await listener(...args);
    });

    return this;
  }

  sendDictionaryStatus(dictionaryStatus: DictionaryStatus): void {
    this.logger?.info("---> Now sending individual dictionary status response");

    this.socket.emit(SocketMessages.DictionaryStatusResponse, dictionaryStatus);
  }

  sendCommandResponse(commandResponse: CommandResponse): void {
    this.logger?.info("---> Now sending command response");

    this.socket.emit(SocketMessages.CommandResponse, commandResponse);
  }
}

export type FrontendWebSocketConsumer = (
  socket: FrontendWebSocket
) => void | Promise<void>;

export type FrontendWebSocketServerSettings = InitializationMessage &
  Readonly<{
    logger?: Logger;
    httpServer: HttpServer;
    enableCors: boolean;
    onNewClient: FrontendWebSocketConsumer;
  }>;

export class FrontendWebSocketServer {
  private readonly logger?: Logger;
  private readonly socketServer: Server;

  constructor({
    logger,
    httpServer,
    enableCors,
    pluginName,
    startupQuery,
    onNewClient
  }: FrontendWebSocketServerSettings) {
    this.socketServer = createWebSocketServer(httpServer, enableCors);

    const initializationMessage: InitializationMessage = {
      pluginName,
      startupQuery
    };

    this.socketServer.on("connect", socket => {
      logger?.info("CLIENT CONNECTED! ^__^");

      const webSocket = new FrontendWebSocket(socket);
      onNewClient(webSocket);

      socket.emit(SocketMessages.InitializeFrontend, initializationMessage);
    });
  }

  broadcastDictionaryStatus(dictionaryStatus: DictionaryStatus): void {
    this.logger?.info("---> Now sending broadcast dictionary status message");

    this.socketServer.sockets.emit(
      SocketMessages.DictionaryStatusResponse,
      dictionaryStatus
    );
  }
}

function createWebSocketServer(
  server: HttpServer,
  enableCors: boolean
): Server {
  const socketOptions = enableCors
    ? {}
    : {
        cors: {
          origin: "*"
        }
      };

  return new Server(server, socketOptions);
}
