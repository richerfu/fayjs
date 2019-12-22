import * as Koa from "koa";
import * as Socket from "socket.io";
import { createServer } from "http";

export class SocketServer {
  private server: Socket.Server;
  public init(app: Koa, config: Object): Socket.Server {
    const s = createServer(app.callback());
    this.server = Socket(s);
    return this.server;
  }

  public getServer(): Socket.Server {
    return this.server;
  }
}
