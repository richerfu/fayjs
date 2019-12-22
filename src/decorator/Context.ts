import * as Koa from "koa";
import { Config, SoContext } from "../utils/interface";
import { Db } from "iqy-mysql";
import { Server } from "socket.io";
import { Curl } from "../plugin/Curl";

class IContext {
  public ctx: SoContext;
  public next: Koa.Next;
  public config: Config;
  public curl: Curl;
  public wss: Server;
  public db?: { [key: string]: Db };
  [propName: string]: any;

  public constructor(
    ctx: SoContext,
    next: Koa.Next,
    config: Config,
    curl: Curl
  ) {
    this.ctx = ctx;
    this.next = next;
    this.config = config;
    this.curl = curl;
  }
}

export class SoController extends IContext {
  public constructor(
    ctx: SoContext,
    next: Koa.Next,
    config: Config,
    curl: Curl
  ) {
    super(ctx, next, config, curl);
  }
}

export class SoService extends IContext {
  public constructor(
    ctx: SoContext,
    next: Koa.Next,
    config: Config,
    curl: Curl
  ) {
    super(ctx, next, config, curl);
  }
}

export class SoMiddleware extends IContext {
  public constructor(
    ctx: SoContext,
    next: Koa.Next,
    config: Config,
    curl: Curl
  ) {
    super(ctx, next, config, curl);
  }
}
