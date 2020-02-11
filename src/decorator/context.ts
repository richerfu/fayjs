import * as Koa from "koa";
import { Config, SoContext } from "../utils/interface";
import { Curl } from "../plugins/curl";
import { MySQL } from "../plugins/mysql";

interface IContext {
  ctx: SoContext;
  next: Koa.Next;
  config: Config;
  curl: Curl;
  db?: MySQL;
  [propName: string]: any;
}

export class SoController implements IContext {
  public ctx: SoContext;
  public next: Koa.Next;
  public config: Config;
  public curl: Curl;
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

export interface SoMiddleware extends IContext {
  resolve(ctx: Koa.Context, next: Koa.Next): Promise<void> | void;
}

export interface SoPlugin {
  app: any;
  config: any;
  start: () => void;
}
