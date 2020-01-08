import * as Koa from "koa";
import { Config, SoContext } from "../utils/interface";
import { Db } from "iqy-mysql";
import { Server } from "socket.io";
import { Curl } from "../plugin/Curl";

interface IContext {
  ctx: SoContext;
  next: Koa.Next;
  config: Config;
  curl: Curl;
  wss: Server;
  db?: { [key: string]: Db };
  [propName: string]: any;
}

export class SoController implements IContext {
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
  public wss: Server;
  public db?: { [key: string]: Db };
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
  public wss: Server;
  public db?: { [key: string]: Db };
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
