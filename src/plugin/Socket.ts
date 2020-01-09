import * as Koa from "koa";
import * as Socket from "socket.io";
import { createServer } from "http";
import { Plugin } from "../decorator/Decorator";

@Plugin("wss")
export class SocketServer {
  private config: any;
  private app: any;

  private server: Socket.Server;
  constructor(config: any, app: any) {
    this.config = config;
    this.app = app;
    if (app && config) {
      this.init(app, config);
    }
  }
  public init(app: Koa, config: Object): Socket.Server {
    const s = createServer(app.callback());
    this.server = Socket(s);
    return this.server;
  }

  public getServer(): Socket.Server {
    return this.server;
  }
}
