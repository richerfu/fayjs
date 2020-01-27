import * as Koa from "koa";
import { Config, SoContext } from "../utils/interface";
import { Curl } from "../plugin/Curl";
import { MySQL } from "../plugin/MySql";
import { SocketServer } from "../plugin/Socket";

interface IContext {
  ctx: SoContext;
  next: Koa.Next;
  config: Config;
  curl: Curl;
  wss: SocketServer;
  db?: MySQL;
  [propName: string]: any;
}

export class SoController implements IContext {
  public ctx: SoContext;
  public next: Koa.Next;
  public config: Config;
  public curl: Curl;
  public wss: SocketServer;
  public db?: MySQL;
  [propName: string]: any;

  public constructor(
    ctx: SoContext,
    next: Koa.Next,
    config: Config,
    curl: Curl
  ) {
    this.config = config;
    this.ctx = ctx;
    this.next = next;
    this.curl = curl;
  }
}

export class SoService implements IContext {
  public ctx: SoContext;
  public next: Koa.Next;
  public config: Config;
  public curl: Curl;
  public wss: SocketServer;
  public db?: MySQL;
  [propName: string]: any;

  public constructor(
    ctx: SoContext,
    next: Koa.Next,
    config: Config,
    curl: Curl
  ) {
    this.config = config;
    this.ctx = ctx;
    this.next = next;
    this.curl = curl;
  }
}

export class SoMiddleware implements IContext {
  public ctx: SoContext;
  public next: Koa.Next;
  public config: Config;
  public curl: Curl;
  public wss: SocketServer;
  public db?: MySQL;
  [propName: string]: any;

  public constructor(
    ctx: SoContext,
    next: Koa.Next,
    config: Config,
    curl: Curl
  ) {
    this.config = config;
    this.ctx = ctx;
    this.next = next;
    this.curl = curl;
  }
}

export interface SoPlugin {
  app: any;
  config: any;
  start: () => void
}
