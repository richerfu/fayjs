import * as Koa from "koa";
import { Config, SoContext } from "../utils/interface";
import { Db } from "iqy-mysql";

class IContext {
  public ctx: SoContext;
  public next: Koa.Next;
  public config: Config;
  [propName: string]: any;

  public constructor(ctx: SoContext, next: Koa.Next, config: Config) {
    this.ctx = ctx;
    this.next = next;
    this.config = config;
  }
}

export class SoController extends IContext {
  public constructor(ctx: SoContext, next: Koa.Next, config: Config) {
    super(ctx, next, config);
  }
}

export class SoService extends IContext {
  public db?: { [key: string]: Db };
  public constructor(ctx: SoContext, next: Koa.Next, config: Config) {
    super(ctx, next, config);
  }
}

export class SoMiddleware extends IContext {
  public constructor(ctx: SoContext, next: Koa.Next, config: Config) {
    super(ctx, next, config);
  }
}
